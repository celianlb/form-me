import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@form-me/database";
import { z } from "zod";

const updateSessionSchema = z.object({
  title: z.string().min(1).optional(),
  description: z.string().optional().nullable(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional().nullable(),
  registrationDeadline: z.string().datetime().optional().nullable(),
  maxLearners: z.number().positive().optional().nullable(),
  mode: z.enum(["PARTNER_CENTER", "E_LEARNING"]).optional(),
  location: z.string().optional().nullable(),
  status: z.enum(["SCHEDULED", "ONGOING", "COMPLETED", "CANCELLED"]).optional(),
  isActive: z.boolean().optional(),
});

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authSession = await getServerSession(authOptions);
    if (!authSession?.user || authSession.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const { id } = await params;
    const session = await prisma.trainingSession.findUnique({
      where: { id: parseInt(id) },
      include: {
        training: { select: { id: true, title: true, slug: true, category: { select: { name: true } } } },
        createdBy: { select: { id: true, email: true, firstName: true, lastName: true } },
        quotes: {
          select: { id: true, firstName: true, lastName: true, email: true, status: true, createdAt: true },
          orderBy: { createdAt: "desc" },
        },
        childSessions: {
          select: { id: true, title: true, startDate: true, status: true },
          orderBy: { startDate: "asc" },
        },
        parentSession: {
          select: { id: true, title: true, startDate: true },
        },
      },
    });

    if (!session) {
      return NextResponse.json({ error: "Session non trouvée" }, { status: 404 });
    }

    return NextResponse.json(session);
  } catch (error) {
    console.error("Error fetching session:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authSession = await getServerSession(authOptions);
    if (!authSession?.user || authSession.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const validatedData = updateSessionSchema.parse(body);

    const existing = await prisma.trainingSession.findUnique({
      where: { id: parseInt(id) },
    });
    if (!existing) {
      return NextResponse.json({ error: "Session non trouvée" }, { status: 404 });
    }

    const session = await prisma.trainingSession.update({
      where: { id: parseInt(id) },
      data: {
        ...validatedData,
        startDate: validatedData.startDate ? new Date(validatedData.startDate) : undefined,
        endDate: validatedData.endDate ? new Date(validatedData.endDate) : undefined,
        registrationDeadline: validatedData.registrationDeadline
          ? new Date(validatedData.registrationDeadline)
          : undefined,
      },
      include: {
        training: { select: { title: true } },
      },
    });

    return NextResponse.json(session);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 });
    }
    console.error("Error updating session:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authSession = await getServerSession(authOptions);
    if (!authSession?.user || authSession.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const { id } = await params;

    const session = await prisma.trainingSession.findUnique({
      where: { id: parseInt(id) },
      include: { _count: { select: { quotes: true } } },
    });

    if (!session) {
      return NextResponse.json({ error: "Session non trouvée" }, { status: 404 });
    }

    // If has quotes, cancel instead of delete
    if (session._count.quotes > 0) {
      await prisma.trainingSession.update({
        where: { id: parseInt(id) },
        data: { status: "CANCELLED", isActive: false },
      });
      return NextResponse.json({ message: "Session annulée (devis existants)" });
    }

    // Delete child sessions first if any
    await prisma.trainingSession.deleteMany({
      where: { parentSessionId: parseInt(id) },
    });

    await prisma.trainingSession.delete({
      where: { id: parseInt(id) },
    });

    return NextResponse.json({ message: "Session supprimée" });
  } catch (error) {
    console.error("Error deleting session:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
