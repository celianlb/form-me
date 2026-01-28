import { cache } from "react";
import { FormationsService } from "@/services/formations.service";
import { CategoriesService } from "@/services/categories.service";
import { prisma } from "@/lib/prisma";

/**
 * Cached Queries - React cache() for request-level deduplication
 *
 * React's cache() deduplicates calls within a single server request.
 * This is useful when generateMetadata() and the page component
 * both need the same data.
 *
 * For cross-request caching, use unstable_cache() (see Phase 3).
 */

// Formation detail - deduplicated within single request
export const getFullFormationBySlugCached = cache(async (slug: string) => {
  return FormationsService.getFullFormationBySlug(slug);
});

// All formations - deduplicated within single request
export const getAllFormationsCached = cache(async () => {
  return FormationsService.getAllFormations();
});

// Formations by category - deduplicated within single request
export const getFormationsByCategoryCached = cache(
  async (categorySlug: string) => {
    return FormationsService.getFormationsByCategory(categorySlug);
  }
);

// Random formations - deduplicated within single request
export const getRandomFormationsCached = cache(async (limit: number = 10) => {
  return FormationsService.getRandomFormations(limit);
});

// Category by slug - deduplicated within single request
export const getCategoryBySlugCached = cache(async (slug: string) => {
  return CategoriesService.getCategoryBySlug(slug);
});

// All categories - deduplicated within single request
export const getAllCategoriesCached = cache(async () => {
  return CategoriesService.getAllCategories();
});

// Public sessions for a training - fetched server-side to avoid waterfall
export const getPublicSessionsForTraining = cache(
  async (trainingId: number) => {
    const now = new Date();

    const sessions = await prisma.trainingSession.findMany({
      where: {
        trainingId,
        status: "SCHEDULED",
        isActive: true,
        startDate: { gte: now },
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
      take: 10,
    });

    return sessions.map((session) => ({
      ...session,
      availableSpots: session.maxLearners
        ? Math.max(0, session.maxLearners - session.registeredCount)
        : null,
      isFull: session.maxLearners
        ? session.registeredCount >= session.maxLearners
        : false,
    }));
  }
);
