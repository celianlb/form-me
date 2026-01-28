import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@form-me/database";
import { z } from "zod";

const updateTrainingSchema = z.object({
  title: z.string().min(1).optional(),
  slug: z.string().regex(/^[a-z0-9-]+$/).optional(),
  categoryId: z.number().optional(),
  shortDescription: z.string().optional().nullable(),
  longDescription: z.string().optional().nullable(),
  imageUrl: z.string().optional().nullable(),
  durationHours: z.number().optional().nullable(),
  durationDays: z.number().optional().nullable(),
  successRate: z.number().optional().nullable(),
  targetAudience: z.string().optional().nullable(),
  prerequisites: z.string().optional().nullable(),
  technicalMeans: z.string().optional().nullable(),
  teachingMeans: z.string().optional().nullable(),
  evaluationMethods: z.string().optional().nullable(),
  validationMethod: z.string().optional().nullable(),
  monitoringMethods: z.string().optional().nullable(),
  renewalRecommendation: z.string().optional().nullable(),
  status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]).optional(),
  isActive: z.boolean().optional(),
});

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const { id } = await params;
    const training = await prisma.training.findUnique({
      where: { id: parseInt(id) },
      include: {
        category: true,
        objectives: true,
        modules: { orderBy: { order: "asc" } },
        _count: { select: { sessions: true, quotes: true, supportGroups: true } },
      },
    });

    if (!training) {
      return NextResponse.json({ error: "Formation non trouvée" }, { status: 404 });
    }

    return NextResponse.json(training);
  } catch (error) {
    console.error("Error fetching training:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

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
    const body = await request.json();
    const validatedData = updateTrainingSchema.parse(body);

    // Check if training exists
    const existing = await prisma.training.findUnique({
      where: { id: parseInt(id) },
    });
    if (!existing) {
      return NextResponse.json({ error: "Formation non trouvée" }, { status: 404 });
    }

    // Check slug uniqueness if changed
    if (validatedData.slug && validatedData.slug !== existing.slug) {
      const slugExists = await prisma.training.findUnique({
        where: { slug: validatedData.slug },
      });
      if (slugExists) {
        return NextResponse.json({ error: "Ce slug est déjà utilisé" }, { status: 400 });
      }
    }

    const training = await prisma.training.update({
      where: { id: parseInt(id) },
      data: {
        ...validatedData,
        updatedById: parseInt(session.user.id),
        publishedAt: validatedData.status === "PUBLISHED" && existing.status !== "PUBLISHED"
          ? new Date()
          : existing.publishedAt,
      },
      include: {
        category: true,
        objectives: true,
        modules: { orderBy: { order: "asc" } },
      },
    });

    return NextResponse.json(training);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 });
    }
    console.error("Error updating training:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const { id } = await params;

    // Check dependencies
    const training = await prisma.training.findUnique({
      where: { id: parseInt(id) },
      include: {
        _count: { select: { sessions: true, supportGroups: true, quotes: true } },
      },
    });

    if (!training) {
      return NextResponse.json({ error: "Formation non trouvée" }, { status: 404 });
    }

    // If has dependencies, archive instead of delete
    if (training._count.sessions > 0 || training._count.supportGroups > 0 || training._count.quotes > 0) {
      await prisma.training.update({
        where: { id: parseInt(id) },
        data: { status: "ARCHIVED", isActive: false },
      });
      return NextResponse.json({ message: "Formation archivée (dépendances existantes)" });
    }

    // Delete related data first
    await prisma.trainingObjective.deleteMany({ where: { trainingId: parseInt(id) } });
    await prisma.trainingModule.deleteMany({ where: { trainingId: parseInt(id) } });
    await prisma.training.delete({ where: { id: parseInt(id) } });

    return NextResponse.json({ message: "Formation supprimée" });
  } catch (error) {
    console.error("Error deleting training:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
