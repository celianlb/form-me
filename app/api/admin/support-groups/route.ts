import { getServerSession } from "next-auth/next";
import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "../../../../generated/prisma";
import { authOptions } from "../../../../lib/auth";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const groups = await prisma.supportGroup.findMany({
      include: {
        training: {
          select: {
            title: true,
          },
        },
        members: {
          include: {
            user: {
              select: {
                email: true,
                firstName: true,
                lastName: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(groups);
  } catch (error) {
    console.error("Erreur lors de la récupération des groupes:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const { name, companyName, trainingDate, trainingId, participantEmails } =
      await request.json();

    // Validation des champs requis
    if (
      !name ||
      !companyName ||
      !trainingDate ||
      !trainingId ||
      !participantEmails?.length
    ) {
      return NextResponse.json(
        { error: "Tous les champs sont requis" },
        { status: 400 }
      );
    }

    // Créer le groupe de support
    const group = await prisma.supportGroup.create({
      data: {
        name,
        companyName,
        trainingDate: new Date(trainingDate),
        trainingId: parseInt(trainingId),
        createdById: parseInt(session.user.id),
      },
    });

    // Créer ou trouver les utilisateurs et les ajouter au groupe
    const createdMembers: { userId: number }[] = [];

    for (const email of participantEmails) {
      let user = await prisma.user.findUnique({
        where: { email },
      });

      // Si l'utilisateur n'existe pas, le créer
      if (!user) {
        user = await prisma.user.create({
          data: {
            email,
            role: "LEARNER",
            mustChangePassword: true,
            isActive: true,
          },
        });
      }

      // Ajouter l'utilisateur au groupe
      const member = await prisma.supportGroupMember.create({
        data: {
          groupId: group.id,
          userId: user.id,
          status: user.passwordHash ? "ACTIVE" : "INVITED",
        },
      });

      createdMembers.push(member);
    }

    // Retourner le groupe créé avec ses membres
    const createdGroup = await prisma.supportGroup.findUnique({
      where: { id: group.id },
      include: {
        training: {
          select: {
            title: true,
          },
        },
        members: {
          include: {
            user: {
              select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
              },
            },
          },
        },
      },
    });

    return NextResponse.json({
      group: createdGroup,
      message: "Groupe créé avec succès",
      invitationsToSend: createdMembers.filter((m) =>
        createdMembers.find((cm) => cm.userId === m.userId)
      ),
    });
  } catch (error) {
    console.error("Erreur lors de la création du groupe:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
