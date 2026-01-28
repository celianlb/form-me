import Badge from "@/components/UI/Badge";
import { FormationWithDetails } from "@/types/formationDetails";
import Image from "next/image";
import SessionsSection from "./SessionsSection";
import { Clock, Award } from "lucide-react";

interface HeroSectionProps {
  formation: FormationWithDetails;
}

export default function HeroSection({ formation }: HeroSectionProps) {
  const getDurationDisplay = () => {
    if (formation.durationHours) {
      return `${formation.durationHours}h`;
    }
    if (formation.durationDays) {
      return `${formation.durationDays} jour${formation.durationDays > 1 ? "s" : ""}`;
    }
    return null;
  };

  return (
    <section className="relative">
      {/* Hero Image Section - Full Width */}
      <div className="relative h-[420px] md:h-[500px] lg:h-[550px] w-full">
        {/* Image de fond */}
        {formation.imageUrl ? (
          <Image
            src={formation.imageUrl}
            alt={formation.title}
            fill
            className="object-cover"
            priority
          />
        ) : (
          <div className="absolute inset-0 bg-darkBlue" />
        )}

        {/* Overlay gradient pour lisibilité */}
        <div className="absolute inset-0 bg-gradient-to-t from-darkBlue via-darkBlue/70 to-darkBlue/30" />

        {/* Contenu sur l'image */}
        <div className="absolute inset-0 flex flex-col justify-end pb-32 md:pb-40 px-6 md:px-10 lg:px-[120px]">
          <div className="max-w-3xl">
            {/* Badge catégorie */}
            <div className="inline-block px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 mb-4">
              <span className="text-sm font-satoshi font-semibold text-white">
                {formation.category.name}
              </span>
            </div>

            {/* Titre */}
            <h1 className="text-[32px] md:text-[44px] lg:text-[56px] tracking-[-1px] md:tracking-[-2px] text-white font-sora font-bold leading-[1.1] mb-5">
              {formation.title}
            </h1>

            {/* Stats badges */}
            <div className="flex flex-wrap gap-3">
              {getDurationDisplay() && (
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20">
                  <Clock className="w-4 h-4 text-white" />
                  <span className="font-satoshi text-sm font-medium text-white">
                    {getDurationDisplay()}
                  </span>
                </div>
              )}
              {formation.successRate && (
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20">
                  <Award className="w-4 h-4 text-white" />
                  <span className="font-satoshi text-sm font-medium text-white">
                    {formation.successRate}% de réussite
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Section avec card qui chevauche */}
      <div className="relative px-6 md:px-10 lg:px-[120px] -mt-24 md:-mt-28 pb-12">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-start">
          {/* Description - Partie gauche */}
          <div className="flex-1 pt-28 md:pt-32 lg:pt-0">
            {formation.longDescription && (
              <div className="bg-white rounded-3xl p-6 md:p-8 border border-gray-200 shadow-sm">
                <h2 className="font-sora font-bold text-xl text-darkBlue mb-4">
                  À propos de cette formation
                </h2>
                <p className="text-base md:text-lg text-grayBlue font-satoshi leading-relaxed">
                  {formation.longDescription}
                </p>
              </div>
            )}
          </div>

          {/* Sessions Card - Partie droite, chevauche l'image */}
          <div className="w-full lg:w-auto lg:min-w-[380px] lg:max-w-[420px] order-first lg:order-last">
            <div className="lg:sticky lg:top-28">
              <SessionsSection
                formationId={formation.id}
                formationTitle={formation.title}
                categoryName={formation.category?.name}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
