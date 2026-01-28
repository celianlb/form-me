import { prisma } from "@/lib/prisma";
import { FormationCardData, FormationFromDB } from "@/types/formation";

export class FormationsService {
  // Transformation des données DB vers FormationCardData
  static transformToCardData(formation: FormationFromDB): FormationCardData {
    // Calcul de la durée en heures
    let duration: number | undefined;
    if (formation.durationHours) {
      duration = formation.durationHours;
    } else if (formation.durationDays) {
      duration = formation.durationDays * 7; // 7h par jour
    }

    return {
      id: formation.id,
      title: formation.title,
      slug: formation.slug,
      shortDescription: formation.shortDescription ?? undefined,
      duration,
      durationDays: formation.durationDays ?? undefined,
      imageUrl: formation.imageUrl ?? undefined,
      link: `/formations/${formation.slug}`,
    };
  }

  // Récupérer toutes les formations actives
  static async getAllFormations(): Promise<FormationCardData[]> {
    const formations = await prisma.training.findMany({
      where: {
        isActive: true,
        status: "PUBLISHED",
      },
      select: {
        id: true,
        title: true,
        slug: true,
        shortDescription: true,
        durationHours: true,
        durationDays: true,
        imageUrl: true,
      },
      orderBy: {
        title: "asc",
      },
    });

    return formations.map((formation) =>
      this.transformToCardData(formation as FormationFromDB)
    );
  }

  // Récupérer des formations aléatoires (pour Top 10)
  static async getRandomFormations(
    limit: number = 10
  ): Promise<FormationCardData[]> {
    // Première requête pour compter le total
    const totalCount = await prisma.training.count({
      where: {
        isActive: true,
        status: "PUBLISHED",
      },
    });

    if (totalCount === 0) return [];

    // Générer des IDs aléatoires
    const randomSkips = Array.from(
      { length: Math.min(limit, totalCount) },
      () => Math.floor(Math.random() * totalCount)
    );

    // Récupérer les formations à ces positions
    const formations = await Promise.all(
      randomSkips.map((skip) =>
        prisma.training.findMany({
          where: {
            isActive: true,
            status: "PUBLISHED",
          },
          select: {
            id: true,
            title: true,
            slug: true,
            shortDescription: true,
            durationHours: true,
            durationDays: true,
            imageUrl: true,
          },
          skip,
          take: 1,
        })
      )
    );

    // Aplatir le tableau et éliminer les doublons
    const flatFormations = formations.flat();
    const uniqueFormations = flatFormations.filter(
      (formation, index, self) =>
        self.findIndex((f) => f.id === formation.id) === index
    );

    return uniqueFormations.map((formation) =>
      this.transformToCardData(formation as FormationFromDB)
    );
  }

  // Récupérer les formations par catégorie
  static async getFormationsByCategory(
    categorySlug: string
  ): Promise<FormationCardData[]> {
    const formations = await prisma.training.findMany({
      where: {
        isActive: true,
        status: "PUBLISHED",
        category: {
          slug: categorySlug,
        },
      },
      select: {
        id: true,
        title: true,
        slug: true,
        shortDescription: true,
        durationHours: true,
        durationDays: true,
        imageUrl: true,
      },
      orderBy: {
        title: "asc",
      },
    });

    return formations.map((formation) =>
      this.transformToCardData(formation as FormationFromDB)
    );
  }

  // Récupérer une formation par slug
  static async getFormationBySlug(
    slug: string
  ): Promise<FormationCardData | null> {
    const formation = await prisma.training.findUnique({
      where: {
        slug,
        isActive: true,
        status: "PUBLISHED",
      },
      select: {
        id: true,
        title: true,
        slug: true,
        shortDescription: true,
        durationHours: true,
        durationDays: true,
        imageUrl: true,
      },
    });

    return formation
      ? this.transformToCardData(formation as FormationFromDB)
      : null;
  }

  // Récupérer une formation complète avec catégorie pour la page détaillée
  static async getFullFormationBySlug(slug: string) {
    const formation = await prisma.training.findUnique({
      where: {
        slug,
        isActive: true,
        status: "PUBLISHED",
      },
      select: {
        id: true,
        title: true,
        slug: true,
        shortDescription: true,
        longDescription: true,
        imageUrl: true,
        durationHours: true,
        durationDays: true,
        successRate: true,
        targetAudience: true,
        learningObjectives: true,
        teachingMeans: true,
        evaluationMethods: true,
        validationMethod: true,
        monitoringMethods: true,
        renewalRecommendation: true,
        objectives: {
          select: {
            id: true,
            text: true,
          },
        },
        modules: {
          select: {
            id: true,
            title: true,
            order: true,
            type: true,
            content: true,
          },
          orderBy: {
            order: "asc",
          },
        },
        category: {
          select: {
            name: true,
            slug: true,
          },
        },
      },
    });

    if (!formation) return null;

    return {
      id: formation.id,
      title: formation.title,
      slug: formation.slug,
      shortDescription: formation.shortDescription ?? undefined,
      longDescription: formation.longDescription ?? undefined,
      imageUrl: formation.imageUrl ?? undefined,
      durationHours: formation.durationHours ?? undefined,
      durationDays: formation.durationDays ?? undefined,
      successRate: formation.successRate
        ? Number(formation.successRate)
        : undefined,
      targetAudience: formation.targetAudience ?? undefined,
      trainingObjectives: formation.objectives ?? [],
      trainingModules: formation.modules ?? [],
      teachingMeans: formation.teachingMeans ?? undefined,
      evaluationMethods: formation.evaluationMethods ?? undefined,
      validationMethods: formation.validationMethod ?? undefined,
      monitoringMethods: formation.monitoringMethods ?? undefined,
      renewalRecommendation: formation.renewalRecommendation ?? undefined,
      category: formation.category,
    };
  }
}
