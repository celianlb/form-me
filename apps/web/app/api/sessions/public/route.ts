import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@form-me/database";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const trainingId = searchParams.get("trainingId");

    if (!trainingId) {
      return NextResponse.json(
        { error: "trainingId is required" },
        { status: 400 }
      );
    }

    const now = new Date();

    const sessions = await prisma.trainingSession.findMany({
      where: {
        trainingId: parseInt(trainingId),
        status: "SCHEDULED",
        isActive: true,
        startDate: { gte: now },
        // Only return sessions where registration is still open
        OR: [
          { registrationDeadline: null },
          { registrationDeadline: { gte: now } },
        ],
      },
      select: {
        id: true,
        title: true,
        startDate: true,
        endDate: true,
        mode: true,
        location: true,
        maxLearners: true,
        registeredCount: true,
      },
      orderBy: { startDate: "asc" },
      take: 10, // Limit to next 10 sessions
    });

    // Calculate available spots
    const sessionsWithAvailability = sessions.map((session) => ({
      ...session,
      availableSpots: session.maxLearners
        ? Math.max(0, session.maxLearners - session.registeredCount)
        : null,
      isFull: session.maxLearners
        ? session.registeredCount >= session.maxLearners
        : false,
    }));

    return NextResponse.json(sessionsWithAvailability);
  } catch (error) {
    console.error("Error fetching public sessions:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
