import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@form-me/database";
import { z } from "zod";

const createTrainingSchema = z.object({
  title: z.string().min(1, "Le titre est requis"),
  slug: z.string().min(1).regex(/^[a-z0-9-]+$/, "Le slug doit être en minuscules avec des tirets"),
  categoryId: z.number(),
  shortDescription: z.string().optional(),
  longDescription: z.string().optional(),
  imageUrl: z.string().optional(),
  durationHours: z.number().optional(),
  durationDays: z.number().optional(),
  successRate: z.number().optional(),
  targetAudience: z.string().optional(),
  prerequisites: z.string().optional(),
  technicalMeans: z.string().optional(),
  teachingMeans: z.string().optional(),
  evaluationMethods: z.string().optional(),
  validationMethod: z.string().optional(),
  monitoringMethods: z.string().optional(),
  renewalRecommendation: z.string().optional(),
  status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]).default("DRAFT"),
  objectives: z.array(z.object({ text: z.string() })).optional(),
  modules: z.array(z.object({
    title: z.string(),
    order: z.number(),
    type: z.string().optional(),
    content: z.string().optional(),
  })).optional(),
});

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";
    const status = searchParams.get("status") || "";
    const categoryId = searchParams.get("categoryId");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");

    const where: any = {};

    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { shortDescription: { contains: search, mode: "insensitive" } },
      ];
    }

    if (status && status !== "all") {
      where.status = status;
    }

    if (categoryId) {
      where.categoryId = parseInt(categoryId);
    }

    const [trainings, total] = await Promise.all([
      prisma.training.findMany({
        where,
        include: {
          category: { select: { id: true, name: true, slug: true } },
          _count: { select: { modules: true, objectives: true, sessions: true, quotes: true } },
        },
        orderBy: { updatedAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.training.count({ where }),
    ]);

    return NextResponse.json({
      trainings,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching trainings:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = createTrainingSchema.parse(body);

    // Check slug uniqueness
    const existingSlug = await prisma.training.findUnique({
      where: { slug: validatedData.slug },
    });
    if (existingSlug) {
      return NextResponse.json({ error: "Ce slug est déjà utilisé" }, { status: 400 });
    }

    const { objectives, modules, ...trainingData } = validatedData;

    const training = await prisma.training.create({
      data: {
        ...trainingData,
        createdById: parseInt(session.user.id),
        updatedById: parseInt(session.user.id),
        objectives: objectives?.length ? {
          create: objectives,
        } : undefined,
        modules: modules?.length ? {
          create: modules,
        } : undefined,
      },
      include: {
        category: true,
        objectives: true,
        modules: { orderBy: { order: "asc" } },
      },
    });

    return NextResponse.json(training, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 });
    }
    console.error("Error creating training:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
