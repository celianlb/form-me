import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Cache headers for CDN and browser
const CACHE_HEADERS = {
  // Cache for 24 hours on CDN, serve stale for 7 days while revalidating
  "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=604800",
};

const NO_CACHE_HEADERS = {
  "Cache-Control": "no-store, must-revalidate",
};

const CATEGORY_DISPLAY_ORDER = [
  "CACES & autorisations de conduite",
  "Prévention, santé & sécurité au travail",
  "Électricité & habilitations électriques",
  "Travail en hauteur & levage",
  "Formation de formateur",
  "Sécurité incendie & sûreté",
  "Digital, Web & développement",
];

export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      select: {
        id: true,
        name: true,
        slug: true,
        description: true,
        _count: {
          select: {
            trainings: {
              where: { isActive: true, status: "PUBLISHED" },
            },
          },
        },
      },
    });

    const filtered = categories
      .filter((c) => c._count.trainings > 0)
      .sort((a, b) => {
        const posA = CATEGORY_DISPLAY_ORDER.indexOf(a.name);
        const posB = CATEGORY_DISPLAY_ORDER.indexOf(b.name);
        return (
          (posA === -1 ? CATEGORY_DISPLAY_ORDER.length : posA) -
          (posB === -1 ? CATEGORY_DISPLAY_ORDER.length : posB)
        );
      })
      .map(({ _count, ...rest }) => rest);

    return NextResponse.json(
      { categories: filtered },
      { headers: CACHE_HEADERS }
    );
  } catch (error) {
    console.error("Error fetching categories:", error);
    return NextResponse.json(
      { error: "Failed to fetch categories" },
      { status: 500, headers: NO_CACHE_HEADERS }
    );
  }
}
