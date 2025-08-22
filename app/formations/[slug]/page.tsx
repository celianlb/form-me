import CTADevis from "@/components/Section/CTADevis";
import Top10Formations from "@/components/Section/Top10Formations";
import { FormationsService } from "@/services/formations.service";
import { notFound } from "next/navigation";
import FormationDetails from "./FormationDetails";
import HeroSection from "./HeroSection";

interface FormationPageProps {
  params: Promise<{ slug: string }>;
}

export default async function FormationPage({ params }: FormationPageProps) {
  const { slug } = await params;

  const formation = await FormationsService.getFullFormationBySlug(slug);
  const topFormations = await FormationsService.getRandomFormations(10);

  if (!formation) {
    notFound();
  }

  return (
    <div>
      <HeroSection formation={formation} />
      <FormationDetails formation={formation} />
      <Top10Formations formations={topFormations} />
      <CTADevis />
    </div>
  );
}
