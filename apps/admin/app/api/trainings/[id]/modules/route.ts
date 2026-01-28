import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@form-me/database";
import { z } from "zod";

const modulesSchema = z.object({
  modules: z.array(z.object({
    id: z.number().optional(),
    title: z.string().min(1),
    order: z.number(),
    type: z.string().optional().nullable(),
    content: z.string().optional().nullable(),
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
    const { modules } = modulesSchema.parse(body);

    // Delete all existing modules
    await prisma.trainingModule.deleteMany({
      where: { trainingId },
    });

    // Create new modules
    if (modules.length > 0) {
      await prisma.trainingModule.createMany({
        data: modules.map((mod) => ({
          trainingId,
          title: mod.title,
          order: mod.order,
          type: mod.type,
          content: mod.content,
        })),
      });
    }

    // Update training timestamp
    await prisma.training.update({
      where: { id: trainingId },
      data: { updatedById: parseInt(session.user.id) },
    });

    const updatedModules = await prisma.trainingModule.findMany({
      where: { trainingId },
      orderBy: { order: "asc" },
    });

    return NextResponse.json(updatedModules);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 });
    }
    console.error("Error updating modules:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
