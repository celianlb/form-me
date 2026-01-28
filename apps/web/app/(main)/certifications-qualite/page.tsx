import HeroSection from "@/components/HeroSection";
import CTA from "@/components/Section/CTA";
import Badge from "@/components/UI/Badge";
import Heading from "@/components/UI/Heading";
import { Award, Building, Calendar, Shield, Star } from "lucide-react";
import { createMetadata } from "@/lib/metadata";

export const metadata = createMetadata({
  title: "Certifications et qualité",
  description:
    "Découvrez nos certifications Qualiopi, ISO 9001 et label OPQF qui garantissent l'excellence de nos formations professionnelles. Un gage de qualité et de professionnalisme pour vos formations.",
  keywords: [
    "certification Qualiopi",
    "ISO 9001",
    "label OPQF",
    "qualité formation",
    "organisme certifié",
    "excellence pédagogique",
    "AFNOR certification",
    "Bureau Veritas",
  ],
  path: "/certifications-qualite",
});

interface Certification {
  id: string;
  title: string;
  description: string;
  validUntil: string;
  certifyingBody: string;
  icon: React.ComponentType<{ className?: string }>;
  level: "gold" | "silver" | "platinum";
  features: string[];
}

const certifications: Certification[] = [
  {
    id: "1",
    title: "Certification Qualiopi",
    description:
      "Certification nationale qui atteste de la qualité de notre processus de formation. Elle garantit notre engagement envers l'excellence pédagogique et l'amélioration continue de nos services de formation professionnelle.",
    validUntil: "2026",
    certifyingBody: "AFNOR Certification",
    icon: Award,
    level: "platinum",
    features: [
      "Processus qualité certifié",
      "Amélioration continue",
      "Excellence pédagogique",
    ],
  },
  {
    id: "2",
    title: "Certification ISO 9001",
    description:
      "Standard international pour les systèmes de management de la qualité. Cette certification démontre notre capacité à fournir constamment des services qui répondent aux exigences des clients et réglementaires.",
    validUntil: "2025",
    certifyingBody: "Bureau Veritas",
    icon: Shield,
    level: "gold",
    features: [
      "Standard international",
      "Management qualité",
      "Conformité réglementaire",
    ],
  },
  {
    id: "3",
    title: "Label OPQF",
    description:
      "Qualification professionnelle des organismes de formation. Ce label reconnaît notre professionnalisme, notre compétence pédagogique et le respect des engagements contractuels envers nos apprenants.",
    validUntil: "2025",
    certifyingBody: "OPQF",
    icon: Star,
    level: "silver",
    features: [
      "Qualification professionnelle",
      "Compétence pédagogique",
      "Respect des engagements",
    ],
  },
];

function CertificationCard({
  certification,
  isLarge = false,
}: {
  certification: Certification;
  isLarge?: boolean;
}) {
  return (
    <div
      className={`group relative bg-white border border-gray-100 rounded-[20px] p-6  transition-all duration-300 hover:shadow-lg ${
        isLarge ? "md:p-8" : ""
      }`}
    >
      {/* Header avec icône et badge */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-2 text-xs font-satoshi">
          <Calendar className="w-3 h-3 text-grayBlue" />
          <span className="text-grayBlue">
            Jusqu&apos;en {certification.validUntil}
          </span>
        </div>
      </div>

      {/* Titre */}
      <h3
        className={`font-sora font-bold text-darkBlue mb-3 ${
          isLarge ? "text-2xl" : "text-xl"
        }`}
      >
        {certification.title}
      </h3>

      {/* Description */}
      <p
        className={`text-grayBlue font-satoshi leading-relaxed mb-4 ${
          isLarge ? "text-base" : "text-sm"
        }`}
      >
        {certification.description}
      </p>

      {/* Features */}
      <div className="space-y-2 mb-4">
        {certification.features.map((feature, index) => (
          <div key={index} className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 bg-primary rounded-full flex-shrink-0" />
            <span className="text-sm font-satoshi text-grayBlue">
              {feature}
            </span>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="flex items-center gap-2 pt-4 border-t border-gray-100">
        <Building className="w-4 h-4 text-primary" />
        <span className="text-sm font-satoshi font-medium text-primary">
          {certification.certifyingBody}
        </span>
      </div>

      {/* Effet hover subtil */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent rounded-[20px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
    </div>
  );
}

export default function CertificationsQualitePage() {
  return (
    <main>
      {/* Header Section */}
      <HeroSection className="text-center min-h-0 pt-[180px] pb-[80px] px-[48px] md:px-[120px]">
        <Badge className="mb-6">Certifications & Qualité</Badge>
        <Heading level={1} className="mb-6 mx-auto max-w-3xl">
          Nos certifications garantissent l&apos;excellence de nos formations
        </Heading>
        <p className="text-grayBlue font-satoshi text-lg max-w-2xl mx-auto tracking-tight leading-relaxed">
          Nous sommes fiers de nos certifications qui témoignent de notre
          engagement constant envers la qualité, l&apos;innovation pédagogique
          et la satisfaction de nos apprenants.
        </p>
      </HeroSection>

      {/* Stats Section */}
      <CTA />

      {/* Certifications Layout Asymétrique */}
      <div className="px-6 md:px-[120px] mb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Carte principale (Qualiopi) - Plus grande */}
          <div className="md:col-span-2 lg:col-span-2">
            <CertificationCard
              certification={certifications[0]}
              isLarge={true}
            />
            <div className="text-center bg-[#DBE6FF]/20 border mt-6 border-primary/10 rounded-[32px] p-12">
              <Heading level={2} className="mb-4">
                Un gage de qualité pour vos formations
              </Heading>
              <p className="text-grayBlue font-satoshi mb-8 max-w-2xl mx-auto">
                Ces certifications ne sont pas seulement des labels, elles
                représentent notre engagement quotidien à vous offrir des
                formations d&apos;excellence qui répondent aux plus hauts
                standards.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Badge className="bg-white/80 border-primary/50">
                  Audits réguliers
                </Badge>
                <Badge className="bg-white/80 border-primary/50">
                  Amélioration continue
                </Badge>
                <Badge className="bg-white/80 border-primary/50">
                  Satisfaction client
                </Badge>
              </div>
            </div>
          </div>

          {/* Cartes secondaires en stack vertical */}
          <div className="space-y-6">
            <CertificationCard certification={certifications[1]} />
            <CertificationCard certification={certifications[2]} />
          </div>
        </div>
      </div>

      {/* Bottom Section */}
    </main>
  );
}
