import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { PrismaClient } from "../../../../generated/prisma";
import { authOptions } from "../../../../lib/auth";

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id || session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Non autorisé" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const trainingId = searchParams.get('trainingId');

    const where = trainingId ? { trainingId: parseInt(trainingId) } : {};

    const supports = await prisma.support.findMany({
      where,
      orderBy: {
        createdAt: 'desc'
      },
      include: {
        training: {
          select: {
            title: true
          }
        }
      }
    });

    // Convertir les BigInt en number pour la sérialisation
    const supportsWithConvertedFileSize = supports.map(support => ({
      ...support,
      fileSize: support.fileSize ? Number(support.fileSize) : null
    }));

    return NextResponse.json(supportsWithConvertedFileSize);

  } catch (error) {
    console.error("Erreur lors de la récupération des supports:", error);
    return NextResponse.json(
      { error: "Erreur serveur" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id || session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Non autorisé" },
        { status: 401 }
      );
    }

    const { 
      title, 
      description, 
      type, 
      fileUrl, 
      fileSize, 
      trainingId 
    } = await request.json();

    // Validation des champs requis
    if (!title || !type || !fileUrl || !trainingId) {
      return NextResponse.json(
        { error: "Les champs titre, type, URL et formation sont requis" },
        { status: 400 }
      );
    }

    // Vérifier que la formation existe
    const training = await prisma.training.findUnique({
      where: { id: parseInt(trainingId) }
    });

    if (!training) {
      return NextResponse.json(
        { error: "Formation non trouvée" },
        { status: 404 }
      );
    }

    // Créer le support
    const support = await prisma.support.create({
      data: {
        title,
        description: description || null,
        type,
        fileUrl,
        fileSize: fileSize ? BigInt(fileSize) : null,
        trainingId: parseInt(trainingId),
        isActive: true
      },
      include: {
        training: {
          select: {
            title: true
          }
        }
      }
    });

    // Convertir BigInt pour la sérialisation
    const supportWithConvertedFileSize = {
      ...support,
      fileSize: support.fileSize ? Number(support.fileSize) : null
    };

    return NextResponse.json({
      success: true,
      message: "Support créé avec succès",
      support: supportWithConvertedFileSize
    });

  } catch (error) {
    console.error("Erreur lors de la création du support:", error);
    return NextResponse.json(
      { error: "Erreur serveur" },
      { status: 500 }
    );
  }
}