import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@form-me/database";
import { z } from "zod";
import { addWeeks, addMonths, isBefore } from "date-fns";

const createSessionSchema = z.object({
  trainingId: z.number(),
  title: z.string().min(1, "Le titre est requis"),
  description: z.string().optional().nullable(),
  startDate: z.string().datetime(),
  endDate: z.string().datetime().optional().nullable(),
  registrationDeadline: z.string().datetime().optional().nullable(),
  maxLearners: z.number().positive().optional().nullable(),
  mode: z.enum(["PARTNER_CENTER", "E_LEARNING"]),
  location: z.string().optional().nullable(),
  recurrencePattern: z.enum(["WEEKLY", "BIWEEKLY", "MONTHLY", "NONE"]).optional().nullable(),
  recurrenceEndDate: z.string().datetime().optional().nullable(),
});

// GET - List sessions with filters
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const trainingId = searchParams.get("trainingId");
    const status = searchParams.get("status");
    const upcoming = searchParams.get("upcoming") === "true";
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");

    const where: any = {};

    if (trainingId) {
      where.trainingId = parseInt(trainingId);
    }

    if (status && status !== "all") {
      where.status = status;
    }

    if (upcoming) {
      where.startDate = { gte: new Date() };
      where.status = { not: "CANCELLED" };
    }

    const [sessions, total] = await Promise.all([
      prisma.trainingSession.findMany({
        where,
        include: {
          training: { select: { id: true, title: true, slug: true, category: { select: { name: true } } } },
          createdBy: { select: { id: true, email: true, firstName: true, lastName: true } },
          _count: { select: { quotes: true, childSessions: true } },
        },
        orderBy: { startDate: "asc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.trainingSession.count({ where }),
    ]);

    return NextResponse.json({
      sessions,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  } catch (error) {
    console.error("Error fetching sessions:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

// POST - Create session with optional recurrence
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = createSessionSchema.parse(body);

    // Check training exists
    const training = await prisma.training.findUnique({
      where: { id: validatedData.trainingId },
    });
    if (!training) {
      return NextResponse.json({ error: "Formation non trouvée" }, { status: 404 });
    }

    const { recurrencePattern, recurrenceEndDate, ...sessionData } = validatedData;

    // Create main session
    const mainSession = await prisma.trainingSession.create({
      data: {
        ...sessionData,
        startDate: new Date(sessionData.startDate),
        endDate: sessionData.endDate ? new Date(sessionData.endDate) : null,
        registrationDeadline: sessionData.registrationDeadline
          ? new Date(sessionData.registrationDeadline)
          : null,
        recurrencePattern: recurrencePattern && recurrencePattern !== "NONE" ? recurrencePattern : null,
        recurrenceEndDate: recurrenceEndDate ? new Date(recurrenceEndDate) : null,
        createdById: parseInt(session.user.id),
      },
      include: {
        training: { select: { title: true } },
      },
    });

    // Generate recurring sessions if pattern is set
    if (recurrencePattern && recurrencePattern !== "NONE" && recurrenceEndDate) {
      const childSessions = generateRecurringSessions(
        mainSession,
        recurrencePattern,
        new Date(recurrenceEndDate),
        parseInt(session.user.id)
      );

      if (childSessions.length > 0) {
        await prisma.trainingSession.createMany({
          data: childSessions,
        });
      }
    }

    return NextResponse.json(mainSession, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 });
    }
    console.error("Error creating session:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

function generateRecurringSessions(
  baseSession: any,
  pattern: string,
  endDate: Date,
  createdById: number
): any[] {
  const sessions: any[] = [];
  let currentDate = new Date(baseSession.startDate);

  const getNextDate = (date: Date): Date => {
    switch (pattern) {
      case "WEEKLY":
        return addWeeks(date, 1);
      case "BIWEEKLY":
        return addWeeks(date, 2);
      case "MONTHLY":
        return addMonths(date, 1);
      default:
        return date;
    }
  };

  // Generate up to 52 occurrences or until end date
  let count = 0;
  while (count < 52) {
    currentDate = getNextDate(currentDate);

    if (!isBefore(currentDate, endDate)) {
      break;
    }

    const duration = baseSession.endDate
      ? baseSession.endDate.getTime() - baseSession.startDate.getTime()
      : 0;

    sessions.push({
      trainingId: baseSession.trainingId,
      title: baseSession.title,
      description: baseSession.description,
      startDate: currentDate,
      endDate: duration ? new Date(currentDate.getTime() + duration) : null,
      registrationDeadline: baseSession.registrationDeadline
        ? new Date(currentDate.getTime() - (baseSession.startDate.getTime() - baseSession.registrationDeadline.getTime()))
        : null,
      maxLearners: baseSession.maxLearners,
      mode: baseSession.mode,
      location: baseSession.location,
      status: "SCHEDULED",
      recurrencePattern: pattern,
      parentSessionId: baseSession.id,
      createdById,
    });

    count++;
  }

  return sessions;
}
