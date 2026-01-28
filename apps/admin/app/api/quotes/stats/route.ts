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

    const [
      totalQuotes,
      receivedCount,
      contactedCount,
      processedCount,
      convertedCount,
      archivedCount,
      thisMonthCount,
      topTrainings,
    ] = await Promise.all([
      prisma.quote.count(),
      prisma.quote.count({ where: { status: "received" } }),
      prisma.quote.count({ where: { status: "contacted" } }),
      prisma.quote.count({ where: { status: "processed" } }),
      prisma.quote.count({ where: { status: "converted" } }),
      prisma.quote.count({ where: { status: "archived" } }),
      prisma.quote.count({
        where: {
          createdAt: {
            gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
          },
        },
      }),
      prisma.quote.groupBy({
        by: ["trainingId"],
        _count: { id: true },
        where: { trainingId: { not: null } },
        orderBy: { _count: { id: "desc" } },
        take: 5,
      }),
    ]);

    // Get training names for top trainings
    const trainingIds = topTrainings
      .filter((t) => t.trainingId)
      .map((t) => t.trainingId as number);

    const trainings = await prisma.training.findMany({
      where: { id: { in: trainingIds } },
      select: { id: true, title: true },
    });

    const topTrainingsWithNames = topTrainings.map((t) => ({
      trainingId: t.trainingId,
      trainingTitle: trainings.find((tr) => tr.id === t.trainingId)?.title || "Sans formation",
      count: t._count.id,
    }));

    return NextResponse.json({
      total: totalQuotes,
      byStatus: {
        received: receivedCount,
        contacted: contactedCount,
        processed: processedCount,
        converted: convertedCount,
        archived: archivedCount,
      },
      thisMonth: thisMonthCount,
      topTrainings: topTrainingsWithNames,
    });
  } catch (error) {
    console.error("Error fetching quote stats:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
