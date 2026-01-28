import HeroSection from "@/components/HeroSection";
import BentoSection from "@/components/Home/Bento/BentoSection";
import CategorySection from "@/components/Section/CategorySection";
import PartnerCTA from "@/components/Section/PartnerCTA";
import Top10Formations from "@/components/Section/Top10Formations";
import TrustSection from "@/components/Section/TrustSection";
import { createMetadata } from "@/lib/metadata";
import { CategoriesService } from "@/services/categories.service";
import { FormationsService } from "@/services/formations.service";
import { ArrowDown } from "lucide-react";

export const metadata = createMetadata({
  title: "Form Me - Formations Professionnelles",
  description:
    "On vous forme avec efficacité et rapidité. Formations certifiantes en AIPR, ATEX, CACES, Habilitations électriques, Digital Business et bien plus.",
  keywords: [
    "formation professionnelle",
    "formation certifiante",
    "AIPR",
    "ATEX",
    "CACES",
    "habilitation électrique",
    "sauveteur secouriste",
    "digital business",
    "développement des compétences",
  ],
  path: "/",
});

export default async function Home() {
  const categoryOptions = await CategoriesService.getCategoriesForDropdown();
  const topFormations = await FormationsService.getRandomFormations(10);
  const categories = await CategoriesService.getCategoriesWithTrainingCount();

  // Données structurées pour Google
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    name: "Form Me",
    url: "https://form-me.fr",
    logo: "https://form-me.fr/logo.png",
    description: "On vous forme avec efficacité et rapidité",
    address: {
      "@type": "PostalAddress",
      addressCountry: "FR",
    },
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer service",
      email: "contact@form-me.fr",
    },
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Form Me",
    url: "https://form-me.fr",
    potentialAction: {
      "@type": "SearchAction",
      target: "https://form-me.fr/formations?search={search_term_string}",
      "query-input": "required name=search_term_string",
    },
  };

  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Catégories de formations",
    description: "Les catégories de formations principales",
    itemListElement: categories.map((category, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: category.name,
      url: `https://form-me.fr/formations/category/${category.slug}`,
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
      />
      <main>
        <HeroSection className="flex flex-col gap-8">
          <h1 className="text-[32px] md:text-[48px] tracking-[-2px] md:tracking-[-4px] text-darkBlue font-sora font-bold max-w-[300px] md:max-w-[830px] text-center">
            Nous aidons les entreprises et particuliers à se former{" "}
            <span className="text-darkBlue/60 italic">
              rapidement et efficacement
            </span>
          </h1>
          <p className="text-grayBlue text-lg md:text-xl font-satoshi text-center max-w-2xl">
            Découvrez nos formations certifiantes en AIPR, ATEX, CACES,
            Habilitations électriques et bien plus encore.
          </p>
          {/* Scroll indicator button */}
          <div className="mt-8 inline-flex items-center gap-3 bg-white border border-gray-200 text-darkBlue font-satoshi font-semibold pl-6 pr-2 py-2 rounded-full shadow-sm">
            <span className="text-sm">Découvrir</span>
            <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
              <ArrowDown className="w-5 h-5 text-darkBlue animate-bounce-slow" />
            </div>
          </div>
        </HeroSection>
        <CategorySection />
        <BentoSection />
        <TrustSection />
        <PartnerCTA />
        <Top10Formations formations={topFormations} />
      </main>
    </>
  );
}
