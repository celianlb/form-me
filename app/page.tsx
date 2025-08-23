import HeroSection from "@/components/HeroSection";
import BentoSection from "@/components/Home/Bento/BentoSection";
import SearchFormation from "@/components/Home/SearchFormation";
import CategorySection from "@/components/Section/CategorySection";
import CTA from "@/components/Section/CTA";
import CTADevis from "@/components/Section/CTADevis";
import SocialProof from "@/components/Section/SocialProof";
import Top10Formations from "@/components/Section/Top10Formations";
import Badge from "@/components/UI/Badge";
import Heading from "@/components/UI/Heading";
import { CategoriesService } from "@/services/categories.service";
import { FormationsService } from "@/services/formations.service";

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
      <SocialProof />
      <Top10Formations formations={topFormations} />
      <CTADevis />
    </main>
  );
}
