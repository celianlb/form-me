import Top10Formations from "@/components/Section/Top10Formations";
import {
  getFullFormationBySlugCached,
  getRandomFormationsCached,
} from "@/lib/cached-queries";
import { notFound } from "next/navigation";
import FormationDetails from "./FormationDetails";
import HeroSection from "./HeroSection";
import { createMetadata } from "@/lib/metadata";
import { Metadata } from "next";

interface FormationPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: FormationPageProps): Promise<Metadata> {
  const { slug } = await params;
  // Uses React cache() to deduplicate with page component call
  const formation = await getFullFormationBySlugCached(slug);

  if (!formation) {
    return createMetadata({
      title: "Formation non trouvée",
      description: "La formation demandée n'existe pas.",
      path: `/formations/${slug}`,
      noIndex: true,
    });
  }

  const keywords = [
    formation.title,
    ...(formation.category ? [formation.category.name] : []),
    "formation professionnelle",
    "certification",
  ];

  const duration = formation.durationHours
    ? `${formation.durationHours}h`
    : formation.durationDays
      ? `${formation.durationDays} jour${formation.durationDays > 1 ? "s" : ""}`
      : "";

  return createMetadata({
    title: `${formation.title} - Formation ${formation.category?.name || "Professionnelle"}`,
    description:
      formation.shortDescription ||
      formation.longDescription ||
      `Formation ${formation.title}${duration ? `. Durée: ${duration}` : ""}.`,
    keywords,
    path: `/formations/${slug}`,
  });
}

export default async function FormationPage({ params }: FormationPageProps) {
  const { slug } = await params;

  // Uses React cache() - deduplicated with generateMetadata call (1 DB call instead of 2)
  const formation = await getFullFormationBySlugCached(slug);

  if (!formation) {
    notFound();
  }

  // Uses React cache() for deduplication within request
  const topFormations = await getRandomFormationsCached(10).catch((error) => {
    console.error("[FormationPage] Error fetching random formations:", error);
    return [];
  });

  return (
    <div>
      <HeroSection formation={formation} />
      <FormationDetails formation={formation} />
      <Top10Formations formations={topFormations} />
    </div>
  );
}
