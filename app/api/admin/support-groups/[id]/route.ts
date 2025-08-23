import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { PrismaClient } from "../../../../../generated/prisma";
import { authOptions } from "../../../../../lib/auth";

const prisma = new PrismaClient();

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
    const groupId = parseInt(id);

    if (isNaN(groupId)) {
      return NextResponse.json(
        { error: "ID de groupe invalide" },
        { status: 400 }
      );
    }

    // Vérifier que le groupe existe
    const group = await prisma.supportGroup.findUnique({
      where: { id: groupId }
    });

    if (!group) {
      return NextResponse.json(
        { error: "Groupe non trouvé" },
        { status: 404 }
      );
    }

    // Supprimer en cascade : d'abord les membres, puis le groupe
    await prisma.supportGroupMember.deleteMany({
      where: { groupId: groupId }
    });

    await prisma.supportGroup.delete({
      where: { id: groupId }
    });

    return NextResponse.json({
      success: true,
      message: "Groupe supprimé avec succès"
    });

  } catch (error) {
    console.error("Erreur lors de la suppression du groupe:", error);
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
    const groupId = parseInt(id);

    if (isNaN(groupId)) {
      return NextResponse.json(
        { error: "ID de groupe invalide" },
        { status: 400 }
      );
    }

    const { name, companyName, trainingDate, trainingId, isActive } = await request.json();

    // Validation des champs requis
    if (!name || !companyName || !trainingDate || !trainingId) {
      return NextResponse.json(
        { error: "Tous les champs sont requis" },
        { status: 400 }
      );
    }

    // Vérifier que le groupe existe
    const existingGroup = await prisma.supportGroup.findUnique({
      where: { id: groupId }
    });

    if (!existingGroup) {
      return NextResponse.json(
        { error: "Groupe non trouvé" },
        { status: 404 }
      );
    }

    // Mettre à jour le groupe
    const updatedGroup = await prisma.supportGroup.update({
      where: { id: groupId },
      data: {
        name,
        companyName,
        trainingDate: new Date(trainingDate),
        trainingId: parseInt(trainingId),
        isActive: Boolean(isActive)
      },
      include: {
        training: {
          select: {
            title: true
          }
        },
        members: {
          include: {
            user: {
              select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true
              }
            }
          }
        }
      }
    });

    return NextResponse.json({
      success: true,
      message: "Groupe modifié avec succès",
      group: updatedGroup
    });

  } catch (error) {
    console.error("Erreur lors de la modification du groupe:", error);
    return NextResponse.json(
      { error: "Erreur serveur" },
      { status: 500 }
    );
  }
}

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
    const groupId = parseInt(id);

    if (isNaN(groupId)) {
      return NextResponse.json(
        { error: "ID de groupe invalide" },
        { status: 400 }
      );
    }

    const group = await prisma.supportGroup.findUnique({
      where: { id: groupId },
      include: {
        training: {
          select: {
            title: true,
            supports: {
              where: { isActive: true },
              select: {
                id: true,
                title: true,
                description: true,
                type: true,
                fileUrl: true,
                fileSize: true
              }
            }
          }
        },
        members: {
          include: {
            user: {
              select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                lastLoginAt: true
              }
            }
          }
        }
      }
    });

    if (!group) {
      return NextResponse.json(
        { error: "Groupe non trouvé" },
        { status: 404 }
      );
    }

    // Convertir les BigInt en number pour la sérialisation
    const groupWithConvertedFileSize = {
      ...group,
      training: {
        ...group.training,
        supports: group.training.supports.map(support => ({
          ...support,
          fileSize: support.fileSize ? Number(support.fileSize) : null
        }))
      }
    };

    return NextResponse.json(groupWithConvertedFileSize);

  } catch (error) {
    console.error("Erreur lors de la récupération du groupe:", error);
    return NextResponse.json(
      { error: "Erreur serveur" },
      { status: 500 }
    );
  }
}