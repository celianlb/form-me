import HeroSection from "@/components/HeroSection";
import BentoSection from "@/components/Home/Bento/BentoSection";
import SearchFormation from "@/components/Home/SearchFormation";
import CategorySection from "@/components/Section/CategorySection";
import CTA from "@/components/Section/CTA";
import CTADevis from "@/components/Section/CTADevis";
import PartnerCTA from "@/components/Section/PartnerCTA";
import SocialProof from "@/components/Section/SocialProof";
import Top10Formations from "@/components/Section/Top10Formations";
import Heading from "@/components/UI/Heading";
import { createMetadata } from "@/lib/metadata";
import { CategoriesService } from "@/services/categories.service";
import { FormationsService } from "@/services/formations.service";

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
        <HeroSection className="flex flex-col gap-16">
          <Heading
            level={1}
            className="max-w-[300px] md:max-w-[830px] text-start flex flex-col items-center gap-2"
          >
            On aide les entreprises et particuliers à se former rapidement et
            efficacement
          </Heading>
          <SearchFormation categories={categoryOptions} />
        </HeroSection>
        <CategorySection />
        <BentoSection />
        <CTA />
        <PartnerCTA />
        <SocialProof />
        <Top10Formations formations={topFormations} />
        <CTADevis />
      </main>
    </>
  );
}
