import Badge from "@/components/UI/Badge";
import Button from "@/components/UI/Button";
import Heading from "@/components/UI/Heading";
import { FormationWithDetails } from "@/types/formationDetails";
import Image from "next/image";
import DevisForm from "./DevisForm";

interface HeroSectionProps {
  formation: FormationWithDetails;
}

export default function HeroSection({ formation }: HeroSectionProps) {
  const getLocationDisplay = () => {
    if (formation.availableInCenter && formation.availableElearning) {
      return "Sur site et Distanciel";
    }
    if (formation.availableElearning) {
      return "Distanciel";
    }
    return "Sur site";
  };

  const getDurationDisplay = () => {
    if (formation.durationHours) {
      return `${formation.durationHours}h`;
    }
    if (formation.durationDays) {
      return `${formation.durationDays} jour(s)`;
    }
    return "Durée non définie";
  };

  const getParticipantsDisplay = () => {
    if (formation.minParticipants && formation.maxParticipants) {
      return `${formation.minParticipants} à ${formation.maxParticipants} participants`;
    }
    if (formation.maxParticipants) {
      return `Max ${formation.maxParticipants} participants`;
    }
    if (formation.minParticipants) {
      return `Min ${formation.minParticipants} participants`;
    }
    return "Capacité non définie";
  };

  return (
    <section className="pt-[180px] pb-[80px] px-[40px] md:px-[120px] relative">
      <div
        className="absolute w-full h-full bg-cover bg-top bg-no-repeat left-0 top-0 -z-10"
        style={{
          backgroundImage: "url('/hero/hero-dotted.png')",
        }}
      />
      <div className="flex flex-col lg:flex-row gap-12 items-start">
        {/* Partie gauche - Informations de la formation */}
        <div className="flex-1">
          <Badge className="mb-2">{formation.category.name}</Badge>
          <Heading level={1}>{formation.title}</Heading>
          {formation.longDescription && (
            <p className="text-lg text-darkBlue/70 mt-4 mb-6">
              {formation.longDescription}
            </p>
          )}
          {formation.successRate && (
            <p className="text-primary font-semibold mb-6">
              Taux de réussite: {formation.successRate}%
            </p>
          )}
          <div className="flex flex-wrap gap-6 mt-6">
            <div className="flex items-center gap-2">
              <Image
                src="/formation/picto/Schedule.svg"
                alt="Durée"
                width={24}
                height={24}
              />
              <p className=" font-satoshi text-[16px] font-medium text-darkBlue">
                {getDurationDisplay()}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Image
                src="/formation/picto/Apartment.svg"
                alt="Modalité"
                width={24}
                height={24}
              />
              <p className=" font-satoshi text-[16px] font-medium text-darkBlue">
                {getLocationDisplay()}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Image
                src="/formation/picto/Person.svg"
                alt="Capacité"
                width={24}
                height={24}
              />
              <p className=" font-satoshi text-[16px] font-medium text-darkBlue">
                {getParticipantsDisplay()}
              </p>
            </div>

            <div className="flex items-center gap-2 bg-primary/10 p-2 w-fit rounded-full">
              <Image
                src="/formation/picto/Euro.svg"
                alt="Prix"
                width={24}
                height={24}
              />
              <p className=" font-satoshi text-[16px] font-bold text-darkBlue ">
                {formation.priceExclTax
                  ? `${formation.priceExclTax}€ HT`
                  : "Sur devis"}
              </p>
            </div>

            {formation.successRate && (
              <div className="flex items-center gap-3">
                <Image
                  src="/formation/picto/Rate.svg"
                  alt="Taux de réussite"
                  width={24}
                  height={24}
                />
                <p>Taux de réussite: {formation.successRate}%</p>
              </div>
            )}
          </div>
        </div>

        {/* Partie droite Desktop - Formulaire de devis */}
        <div className="flex-1 hidden md:block md:max-w-1/2">
          <DevisForm formation={formation} />
        </div>
        {/* Partie droite Desktop - Formulaire de devis */}
        <div className="block md:hidden w-full max-w-md">
          <Button variant="primary" className="w-full">
            Demander un devis
          </Button>
        </div>
      </div>
    </section>
  );
}
