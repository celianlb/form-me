import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import bcrypt from "bcryptjs";
import { prisma } from "@form-me/database";
import { authOptions } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Non authentifié" },
        { status: 401 }
      );
    }

    const { currentPassword, newPassword } = await request.json();

    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        { error: "Tous les champs sont requis" },
        { status: 400 }
      );
    }

    if (newPassword.length < 8) {
      return NextResponse.json(
        { error: "Le mot de passe doit contenir au moins 8 caractères" },
        { status: 400 }
      );
    }

    // Récupérer l'utilisateur
    const user = await prisma.user.findUnique({
      where: { id: parseInt(session.user.id) }
    });

    if (!user || !user.passwordHash) {
      return NextResponse.json(
        { error: "Utilisateur non trouvé" },
        { status: 404 }
      );
    }

    // Vérifier le mot de passe actuel
    const isCurrentPasswordValid = await bcrypt.compare(
      currentPassword,
      user.passwordHash
    );

    if (!isCurrentPasswordValid) {
      return NextResponse.json(
        { error: "Mot de passe actuel incorrect" },
        { status: 400 }
      );
    }

    // Hasher le nouveau mot de passe
    const hashedNewPassword = await bcrypt.hash(newPassword, 12);

    // Mettre à jour le mot de passe et supprimer le flag de changement obligatoire
    await prisma.user.update({
      where: { id: user.id },
      data: {
        passwordHash: hashedNewPassword,
        mustChangePassword: false
      }
    });

    // Activer les membres de groupe en statut INVITED pour cet utilisateur
    await prisma.supportGroupMember.updateMany({
      where: {
        userId: user.id,
        status: 'INVITED'
      },
      data: {
        status: 'ACTIVE',
        acceptedAt: new Date()
      }
    });

    return NextResponse.json({
      success: true,
      message: "Mot de passe modifié avec succès"
    });

  } catch (error) {
    console.error("Erreur lors du changement de mot de passe:", error);
    return NextResponse.json(
      { error: "Erreur serveur" },
      { status: 500 }
    );
  }
}