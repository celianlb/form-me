import { getServerSession } from "next-auth/next";
import { NextResponse } from "next/server";
import { prisma } from "@form-me/database";
import { authOptions } from "@/lib/auth";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }

    const userId = parseInt(session.user.id);

    // Récupérer tous les groupes auxquels l'utilisateur appartient
    const userGroups = await prisma.supportGroupMember.findMany({
      where: {
        userId: userId,
        status: "ACTIVE", // Seulement les membres actifs
      },
      include: {
        group: {
          include: {
            training: {
              include: {
                supports: {
                  where: {
                    isActive: true,
                  },
                  select: {
                    id: true,
                    title: true,
                    description: true,
                    type: true,
                    fileUrl: true,
                    fileSize: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    // Transformer les données pour l'affichage
    const groups = userGroups.map((membership) => ({
      id: membership.group.id,
      name: membership.group.name,
      companyName: membership.group.companyName,
      trainingDate: membership.group.trainingDate,
      training: {
        title: membership.group.training.title,
        supports: membership.group.training.supports.map((support) => ({
          ...support,
          fileSize: support.fileSize ? Number(support.fileSize) : null,
        })),
      },
    }));

    return NextResponse.json(groups);
  } catch (error) {
    console.error(
      "Erreur lors de la récupération des groupes utilisateur:",
      error
    );
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
