import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { PrismaClient } from "../../../../../generated/prisma";
import { authOptions } from "../../../../../lib/auth";

const prisma = new PrismaClient();

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id || session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Non autorisé" },
        { status: 401 }
      );
    }

    const { id } = await params;
    const supportId = parseInt(id);

    if (isNaN(supportId)) {
      return NextResponse.json(
        { error: "ID de support invalide" },
        { status: 400 }
      );
    }

    const support = await prisma.support.findUnique({
      where: { id: supportId },
      include: {
        training: {
          select: {
            id: true,
            title: true
          }
        }
      }
    });

    if (!support) {
      return NextResponse.json(
        { error: "Support non trouvé" },
        { status: 404 }
      );
    }

    // Convertir BigInt pour la sérialisation
    const supportWithConvertedFileSize = {
      ...support,
      fileSize: support.fileSize ? Number(support.fileSize) : null
    };

    return NextResponse.json(supportWithConvertedFileSize);

  } catch (error) {
    console.error("Erreur lors de la récupération du support:", error);
    return NextResponse.json(
      { error: "Erreur serveur" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id || session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Non autorisé" },
        { status: 401 }
      );
    }

    const { id } = await params;
    const supportId = parseInt(id);

    if (isNaN(supportId)) {
      return NextResponse.json(
        { error: "ID de support invalide" },
        { status: 400 }
      );
    }

    const { 
      title, 
      description, 
      type, 
      fileUrl, 
      fileSize, 
      isActive 
    } = await request.json();

    // Validation des champs requis
    if (!title || !type || !fileUrl) {
      return NextResponse.json(
        { error: "Les champs titre, type et URL sont requis" },
        { status: 400 }
      );
    }

    // Vérifier que le support existe
    const existingSupport = await prisma.support.findUnique({
      where: { id: supportId }
    });

    if (!existingSupport) {
      return NextResponse.json(
        { error: "Support non trouvé" },
        { status: 404 }
      );
    }

    // Mettre à jour le support
    const updatedSupport = await prisma.support.update({
      where: { id: supportId },
      data: {
        title,
        description: description || null,
        type,
        fileUrl,
        fileSize: fileSize ? BigInt(fileSize) : null,
        isActive: isActive !== undefined ? Boolean(isActive) : undefined
      },
      include: {
        training: {
          select: {
            id: true,
            title: true
          }
        }
      }
    });

    // Convertir BigInt pour la sérialisation
    const supportWithConvertedFileSize = {
      ...updatedSupport,
      fileSize: updatedSupport.fileSize ? Number(updatedSupport.fileSize) : null
    };

    return NextResponse.json({
      success: true,
      message: "Support modifié avec succès",
      support: supportWithConvertedFileSize
    });

  } catch (error) {
    console.error("Erreur lors de la modification du support:", error);
    return NextResponse.json(
      { error: "Erreur serveur" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id || session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Non autorisé" },
        { status: 401 }
      );
    }

    const { id } = await params;
    const supportId = parseInt(id);

    if (isNaN(supportId)) {
      return NextResponse.json(
        { error: "ID de support invalide" },
        { status: 400 }
      );
    }

    // Vérifier que le support existe
    const support = await prisma.support.findUnique({
      where: { id: supportId }
    });

    if (!support) {
      return NextResponse.json(
        { error: "Support non trouvé" },
        { status: 404 }
      );
    }

    // Supprimer le support
    await prisma.support.delete({
      where: { id: supportId }
    });

    return NextResponse.json({
      success: true,
      message: "Support supprimé avec succès"
    });

  } catch (error) {
    console.error("Erreur lors de la suppression du support:", error);
    return NextResponse.json(
      { error: "Erreur serveur" },
      { status: 500 }
    );
  }
}