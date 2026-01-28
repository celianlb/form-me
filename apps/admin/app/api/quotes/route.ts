import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@form-me/database";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const trainingId = searchParams.get("trainingId");
    const sessionId = searchParams.get("sessionId");
    const search = searchParams.get("search");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");

    const where: any = {};

    if (status && status !== "all") {
      where.status = status;
    }

    if (trainingId) {
      where.trainingId = parseInt(trainingId);
    }

    if (sessionId) {
      where.sessionId = parseInt(sessionId);
    }

    if (search) {
      where.OR = [
        { firstName: { contains: search, mode: "insensitive" } },
        { lastName: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
        { city: { contains: search, mode: "insensitive" } },
      ];
    }

    const [quotes, total] = await Promise.all([
      prisma.quote.findMany({
        where,
        include: {
          training: { select: { id: true, title: true, slug: true } },
          session: { select: { id: true, title: true, startDate: true, location: true } },
        },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.quote.count({ where }),
    ]);

    return NextResponse.json({
      quotes,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching quotes:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
