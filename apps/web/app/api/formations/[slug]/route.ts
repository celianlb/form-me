import { NextResponse } from "next/server";
import { FormationsService } from "@/services/formations.service";

// Cache headers for CDN and browser
const CACHE_HEADERS = {
  // Cache for 1 hour on CDN, serve stale for 24 hours while revalidating
  "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
};

const NOT_FOUND_CACHE_HEADERS = {
  // Cache 404 responses for 1 hour (prevents repeated DB hits for non-existent slugs)
  "Cache-Control": "public, s-maxage=3600",
};

const NO_CACHE_HEADERS = {
  "Cache-Control": "no-store, must-revalidate",
};

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const formation = await FormationsService.getFormationBySlug(slug);

    if (!formation) {
      return NextResponse.json(
        { error: "Formation not found" },
        { status: 404, headers: NOT_FOUND_CACHE_HEADERS }
      );
    }

    return NextResponse.json(
      { formation },
      { headers: CACHE_HEADERS }
    );
  } catch (error) {
    console.error("Error fetching formation:", error);
    return NextResponse.json(
      { error: "Failed to fetch formation" },
      { status: 500, headers: NO_CACHE_HEADERS }
    );
  }
}
