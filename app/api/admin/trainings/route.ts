import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { PrismaClient } from "../../../../generated/prisma";
import { authOptions } from "../../../../lib/auth";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id || session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Non autorisé" },
        { status: 401 }
      );
    }

    const trainings = await prisma.training.findMany({
      where: {
        isActive: true,
        status: 'PUBLISHED'
      },
      select: {
        id: true,
        title: true
      },
      orderBy: {
        title: 'asc'
      }
    });

    return NextResponse.json(trainings);

  } catch (error) {
    console.error("Erreur lors de la récupération des formations:", error);
    return NextResponse.json(
      { error: "Erreur serveur" },
      { status: 500 }
    );
  }
}