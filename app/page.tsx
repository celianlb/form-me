import HeroSection from "@/components/HeroSection";
import BentoSection from "@/components/Home/Bento/BentoSection";
import SearchFormation from "@/components/Home/SearchFormation";
import CategorySection from "@/components/Section/CategorySection";
import CTA from "@/components/Section/CTA";
import CTADevis from "@/components/Section/CTADevis";
import PartnerCTA from "@/components/Section/PartnerCTA";
import SocialProof from "@/components/Section/SocialProof";
import Top10Formations from "@/components/Section/Top10Formations";
import Badge from "@/components/UI/Badge";
import Heading from "@/components/UI/Heading";
import { CategoriesService } from "@/services/categories.service";
import { FormationsService } from "@/services/formations.service";
import { createMetadata } from "@/lib/metadata";

export const metadata = createMetadata({
  title: "Accueil - Formations Professionnelles Certifiantes",
  description:
    "Form Me, votre partenaire formation professionnelle. Découvrez nos formations certifiantes et qualifiantes adaptées à vos besoins professionnels.",
  keywords: [
    "formation professionnelle",
    "formation certifiante",
    "développement des compétences",
    "apprentissage continu",
  ],
  path: "/",
});

export default async function Home() {
  const categoryOptions = await CategoriesService.getCategoriesForDropdown();
  const topFormations = await FormationsService.getRandomFormations(10);

  return (
    <main>
      <HeroSection className="flex flex-col gap-16 md:gap-36">
        <Heading
          level={1}
          className="max-w-[300px] md:max-w-[500px] text-center flex flex-col items-center gap-2"
        >
          Développez vos compétences avec
          <br />
          <Badge className="w-fit">form.me</Badge>
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
  );
}
