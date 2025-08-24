import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Accès non autorisé" },
        { status: 401 }
      );
    }

    // Récupérer les statistiques en parallèle pour optimiser les performances
    const [totalUsers, totalGroups, totalTrainings, recentActivities] =
      await Promise.all([
        // Compter tous les utilisateurs
        prisma.user.count(),

        // Compter tous les groupes de support
        prisma.supportGroup.count(),

        // Compter toutes les formations
        prisma.training.count(),

        // Récupérer les activités récentes (groupes créés récemment)
        prisma.supportGroup.findMany({
          orderBy: {
            createdAt: "desc",
          },
          take: 5,
          include: {
            training: {
              select: {
                title: true,
              },
            },
          },
        }),
      ]);

    // Transformer les activités récentes en format approprié
    const formattedActivities = recentActivities.map((group) => ({
      id: group.id.toString(),
      type: "group_created",
      message: `Nouveau groupe "${group.name}" créé pour ${group.companyName} - Formation: ${group.training.title}`,
      date: group.createdAt.toISOString(),
    }));

    const stats = {
      totalUsers,
      totalGroups,
      totalTrainings,
      recentActivities: formattedActivities,
    };

    return NextResponse.json(stats);
  } catch (error) {
    console.error("Erreur lors de la récupération des statistiques:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
