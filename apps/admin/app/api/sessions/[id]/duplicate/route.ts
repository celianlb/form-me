import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@form-me/database";
import { addWeeks } from "date-fns";

export async function POST(
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
    const { newStartDate } = body;

    const original = await prisma.trainingSession.findUnique({
      where: { id: parseInt(id) },
    });

    if (!original) {
      return NextResponse.json({ error: "Session non trouvée" }, { status: 404 });
    }

    const startDate = newStartDate ? new Date(newStartDate) : addWeeks(original.startDate, 1);
    const duration = original.endDate
      ? original.endDate.getTime() - original.startDate.getTime()
      : 0;

    const newSession = await prisma.trainingSession.create({
      data: {
        trainingId: original.trainingId,
        title: original.title,
        description: original.description,
        startDate,
        endDate: duration ? new Date(startDate.getTime() + duration) : null,
        maxLearners: original.maxLearners,
        mode: original.mode,
        location: original.location,
        status: "SCHEDULED",
        createdById: parseInt(authSession.user.id),
      },
      include: {
        training: { select: { title: true } },
      },
    });

    return NextResponse.json(newSession, { status: 201 });
  } catch (error) {
    console.error("Error duplicating session:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
