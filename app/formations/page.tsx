import HeroSection from "@/components/HeroSection";
import CategorySection from "@/components/Section/CategorySection";
import CTADevis from "@/components/Section/CTADevis";
import Top10Formations from "@/components/Section/Top10Formations";
import Badge from "@/components/UI/Badge";
import Heading from "@/components/UI/Heading";
import { FormationsService } from "@/services/formations.service";
import Link from "next/link";
import { Suspense } from "react";
import AllFormationsClient from "./AllFormationsClient";
import { createMetadata } from "@/lib/metadata";

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
  const [formations, topFormations] = await Promise.all([
    FormationsService.getAllFormations(),
    FormationsService.getRandomFormations(10),
  ]);

  return (
    <div className="min-h-screen">
      {/* Titre principal */}
      <HeroSection className="min-h-auto pt-[160px] pb-[80px]">
        <nav className="mb-8 text-sm">
          <ol className="flex items-center space-x-2 text-grayBlue">
            <li>
              <Link href="/" className="hover:text-primary transition-colors">
                Accueil
              </Link>
            </li>
            <li className="mx-2">/</li>
            <li className="text-blackBlue font-medium">Formations</li>
          </ol>
        </nav>
        <Heading level={1} className="flex flex-col items-center gap-2">
          Toutes nos formations <br />{" "}
          <Badge className="text-center">professionnelles</Badge>
        </Heading>
        <p className="text-grayBlue max-w-[500px] text-center mt-8">
          Découvrez notre catalogue complet de formations professionnelles en
          sécurité et prévention. Des formations CACES aux habilitations
          électriques, nous couvrons tous vos besoins de formation.
        </p>
      </HeroSection>

      {/* Section des catégories */}
      <CategorySection />

      {/* Section titre pour toutes les formations */}
      <section
        data-section="formations-title"
        className="px-5 lg:px-[120px] pt-[80px]"
      >
        <div className="max-w-[500px] mx-auto text-center">
          <Heading level={2}>
            Parcourez toutes nos formations professionnelles
          </Heading>
          <p className="text-grayBlue text-lg mt-4">
            Parcourez l&apos;intégralité de notre catalogue et trouvez la
            formation qui vous correspond grâce à nos filtres de recherche.
          </p>
        </div>
      </section>

      {/* Contenu client avec filtres, pagination et formations */}
      <Suspense
        fallback={
          <div className="px-5 lg:px-[120px] py-[80px] text-center">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Chargement des formations...</p>
          </div>
        }
      >
        <AllFormationsClient formations={formations} />
      </Suspense>

      {/* Section Top 10 formations */}
      <Top10Formations formations={topFormations} />

      {/* CTA Section */}
      {formations.length > 0 && <CTADevis />}
    </div>
  );
}
