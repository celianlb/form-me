import { cache } from "react";
import { unstable_cache } from "next/cache";
import { FormationsService } from "@/services/formations.service";
import { CategoriesService } from "@/services/categories.service";
import { prisma } from "@/lib/prisma";

/**
 * Cached Queries - Two-layer caching strategy
 *
 * Layer 1: unstable_cache() - Cross-request persistent caching
 * - Caches data in the Data Cache (persists across requests)
 * - Configurable TTL and tag-based invalidation
 * - Use for: expensive queries, rarely changing data
 *
 * Layer 2: React cache() - Request-level deduplication
 * - Deduplicates calls within a single server request
 * - Auto-clears when request ends
 * - Use for: generateMetadata + page component sharing
 *
 * Combined: unstable_cache wraps the DB call, cache() wraps unstable_cache
 * This gives us both persistent caching AND request deduplication.
 */

// =============================================================================
// CATEGORIES - 24 hour cache (rarely change)
// =============================================================================

const getAllCategoriesBase = unstable_cache(
  async () => {
    return CategoriesService.getAllCategories();
  },
  ["all-categories"],
  {
    revalidate: 86400, // 24 hours
    tags: ["categories"],
  }
);

// Request-level deduplication wrapper
export const getAllCategoriesCached = cache(async () => {
  return getAllCategoriesBase();
});

const getCategoryBySlugBase = unstable_cache(
  async (slug: string) => {
    return CategoriesService.getCategoryBySlug(slug);
  },
  ["category-by-slug"],
  {
    revalidate: 86400, // 24 hours
    tags: ["categories"],
  }
);

export const getCategoryBySlugCached = cache(async (slug: string) => {
  return getCategoryBySlugBase(slug);
});

// =============================================================================
// FORMATIONS - 1 hour cache (moderate change frequency)
// =============================================================================

const getAllFormationsBase = unstable_cache(
  async () => {
    return FormationsService.getAllFormations();
  },
  ["all-formations"],
  {
    revalidate: 3600, // 1 hour
    tags: ["formations"],
  }
);

export const getAllFormationsCached = cache(async () => {
  return getAllFormationsBase();
});

const getFullFormationBySlugBase = unstable_cache(
  async (slug: string) => {
    return FormationsService.getFullFormationBySlug(slug);
  },
  ["formation-by-slug"],
  {
    revalidate: 3600, // 1 hour
    tags: ["formations"],
  }
);

export const getFullFormationBySlugCached = cache(async (slug: string) => {
  return getFullFormationBySlugBase(slug);
});

const getFormationsByCategoryBase = unstable_cache(
  async (categorySlug: string) => {
    return FormationsService.getFormationsByCategory(categorySlug);
  },
  ["formations-by-category"],
  {
    revalidate: 3600, // 1 hour
    tags: ["formations"],
  }
);

export const getFormationsByCategoryCached = cache(
  async (categorySlug: string) => {
    return getFormationsByCategoryBase(categorySlug);
  }
);

// =============================================================================
// RANDOM FORMATIONS - 30 minute cache (frequently changing)
// =============================================================================

const getRandomFormationsBase = unstable_cache(
  async (limit: number = 10) => {
    return FormationsService.getRandomFormations(limit);
  },
  ["random-formations"],
  {
    revalidate: 1800, // 30 minutes
    tags: ["formations", "random"],
  }
);

export const getRandomFormationsCached = cache(async (limit: number = 10) => {
  return getRandomFormationsBase(limit);
});

// =============================================================================
// SESSIONS - 5 minute cache (real-time availability)
// =============================================================================

// Session type matching the client component interface
export interface ServerSession {
  id: number;
  title: string;
  startDate: string; // ISO string for serialization
  endDate: string | null;
  mode: "PARTNER_CENTER" | "E_LEARNING";
  location: string | null;
  availableSpots: number | null;
  isFull: boolean;
}

const getPublicSessionsForTrainingBase = unstable_cache(
  async (trainingId: number): Promise<ServerSession[]> => {
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

    // Serialize dates to ISO strings for client component compatibility
    return sessions.map((session) => ({
      id: session.id,
      title: session.title,
      startDate: session.startDate.toISOString(),
      endDate: session.endDate?.toISOString() ?? null,
      mode: session.mode,
      location: session.location,
      availableSpots: session.maxLearners
        ? Math.max(0, session.maxLearners - session.registeredCount)
        : null,
      isFull: session.maxLearners
        ? session.registeredCount >= session.maxLearners
        : false,
    }));
  },
  ["public-sessions"],
  {
    revalidate: 300, // 5 minutes - sessions need fresher data
    tags: ["sessions"],
  }
);

export const getPublicSessionsForTraining = cache(
  async (trainingId: number): Promise<ServerSession[]> => {
    return getPublicSessionsForTrainingBase(trainingId);
  }
);
