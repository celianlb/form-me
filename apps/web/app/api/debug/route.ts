import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    // Test simple de connexion Prisma
    const count = await prisma.training.count();

    // Test de récupération d'une formation
    const formation = await prisma.training.findFirst({
      where: {
        isActive: true,
        status: "PUBLISHED",
      },
      select: {
        id: true,
        title: true,
        slug: true,
        category: {
          select: {
            name: true,
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      prismaWorking: true,
      trainingCount: count,
      sampleFormation: formation,
      nodeEnv: process.env.NODE_ENV,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("[DEBUG API] Prisma error:", error);

    return NextResponse.json({
      success: false,
      prismaWorking: false,
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
      nodeEnv: process.env.NODE_ENV,
      timestamp: new Date().toISOString(),
    }, { status: 500 });
  }
}
