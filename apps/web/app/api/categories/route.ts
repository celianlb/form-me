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

export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      select: {
        id: true,
        name: true,
        slug: true,
        description: true,
      },
      orderBy: {
        name: "asc",
      },
    });

    return NextResponse.json(
      { categories },
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
