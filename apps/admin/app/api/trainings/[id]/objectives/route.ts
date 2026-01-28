import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@form-me/database";
import { z } from "zod";

const objectivesSchema = z.object({
  objectives: z.array(z.object({
    id: z.number().optional(),
    text: z.string().min(1),
  })),
});

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const { id } = await params;
    const trainingId = parseInt(id);
    const body = await request.json();
    const { objectives } = objectivesSchema.parse(body);

    // Delete all existing objectives
    await prisma.trainingObjective.deleteMany({
      where: { trainingId },
    });

    // Create new objectives
    if (objectives.length > 0) {
      await prisma.trainingObjective.createMany({
        data: objectives.map((obj) => ({
          trainingId,
          text: obj.text,
        })),
      });
    }

    // Update training timestamp
    await prisma.training.update({
      where: { id: trainingId },
      data: { updatedById: parseInt(session.user.id) },
    });

    const updatedObjectives = await prisma.trainingObjective.findMany({
      where: { trainingId },
    });

    return NextResponse.json(updatedObjectives);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 });
    }
    console.error("Error updating objectives:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
