import CategorySection from "@/components/Section/CategorySection";
import Top10Formations from "@/components/Section/Top10Formations";
import { createMetadata } from "@/lib/metadata";
import {
  getAllFormationsCached,
  getRandomFormationsCached,
} from "@/lib/cached-queries";
import Link from "next/link";
import { Suspense } from "react";
import AllFormationsClient from "./AllFormationsClient";

// ISR: Revalidate every 30 minutes (1800 seconds)
// List page changes more frequently than detail pages
export const revalidate = 1800;

export const metadata = createMetadata({
  title: "Toutes nos formations professionnelles",
  description:
    "Découvrez notre catalogue complet de formations professionnelles en sécurité et prévention : CACES, AIPR, habilitations électriques, gestes et postures, travaux en hauteur et bien plus.",
  keywords: [
    "formations professionnelles",
    "CACES",
    "AIPR",
    "habilitations électriques",
    "gestes et postures",
    "travaux en hauteur",
    "sécurité au travail",
    "prévention des risques",
    "catalogue formations",
  ],
  path: "/formations",
});

export default async function FormationsPage() {
  // Récupérer les formations et top formations en parallèle
  // Uses React cache() for deduplication within request
  const [formations, topFormations] = await Promise.all([
    getAllFormationsCached(),
    getRandomFormationsCached(10),
  ]);

  return (
    <div className="pt-32 md:pt-40">
      {/* Breadcrumb */}
      <nav className="px-5 lg:px-[120px] mb-6">
        <ol className="flex items-center space-x-2 text-sm text-grayBlue font-satoshi">
          <li>
            <Link href="/" className="hover:text-primary transition-colors">
              Accueil
            </Link>
          </li>
          <li>/</li>
          <li className="text-darkBlue font-medium">Formations</li>
        </ol>
      </nav>

      {/* Header avec titre */}
      <section className="px-5 lg:px-[120px] mb-12">
        <div className="max-w-3xl">
          <h1 className="text-3xl md:text-4xl font-sora font-bold text-darkBlue tracking-tight">
            Toutes nos formations professionnelles
          </h1>
          <p className="text-grayBlue mt-4 text-lg font-satoshi">
            Découvrez notre catalogue complet de formations professionnelles en
            sécurité et prévention. Des formations CACES aux habilitations
            électriques, nous couvrons tous vos besoins.
          </p>
        </div>
      </section>

      {/* Contenu client avec filtres, pagination et formations */}
      <Suspense
        fallback={
          <div className="px-5 lg:px-[120px] py-12 text-center">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-grayBlue font-satoshi">
              Chargement des formations...
            </p>
          </div>
        }
      >
        <AllFormationsClient formations={formations} />
      </Suspense>

      {/* Section des catégories */}
      <CategorySection />

      {/* Section Top 10 formations */}
      <Top10Formations formations={topFormations} />
    </div>
  );
}
