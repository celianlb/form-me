import { FormationCardData } from "@/types/formation";
import Image from "next/image";
import Link from "next/link";

interface FormationCardProps {
  formation: FormationCardData;
}

export default function FormationCard({ formation }: FormationCardProps) {
  const getLocationDisplay = () => {
    switch (formation.location) {
      case "center":
        return "Sur site";
      case "elearning":
        return "Distanciel";
      case "both":
        return "Mixte";
      default:
        return "Non défini";
    }
  };

  const getLocationIcon = () => {
    switch (formation.location) {
      case "center":
        return "/formation/picto/Apartment.svg";
      case "elearning":
        return "/formation/dot-pattern.svg";
      case "both":
        return "/formation/picto/Apartment.svg";
      default:
        return "/formation/picto/Apartment.svg";
    }
  };

  const getCapacityDisplay = () => {
    if (formation.capacity.min && formation.capacity.max) {
      return `${formation.capacity.min}-${formation.capacity.max}`;
    }
    if (formation.capacity.max) {
      return `Max ${formation.capacity.max}`;
    }
    if (formation.capacity.min) {
      return `Min ${formation.capacity.min}`;
    }
    return "Non défini";
  };

  const href = formation.link || `/formations/${formation.slug}`;

  return (
    <Link 
      href={href}
      className="group flex justify-center w-full md:w-fit h-full relative p-6 rounded-3xl border border-grayBlue/20 bg-gradient-to-tr from-white to-gray-100 hover:border-primary transition-all duration-300 ease-in-out cursor-pointer hover:bg-gradient-radial hover:from-white hover:via-[#D8E5FF] hover:to-white"
    >
      <div className="flex flex-col md:flex-row gap-12 items-center justify-center">
        {/* Partie gauche - Titre */}
        <div className="flex-1 max-w-[250px]">
          <h3 className="text-[18px] font-satoshi font-medium tracking-tight text-blackBlue mb-2 ">
            {formation.title}
          </h3>
        </div>

        {/* Partie droite - Infos avec pictos */}
        <div className="flex flex-col gap-3 md:w-1/2">
          <div className="flex gap-3">
            {/* Durée - masquée si formation sur candidature */}
            {formation.applicationType === "STANDARD" && (
              <div className="flex items-center gap-1 w-full">
                <div className="w-8 h-8 flex items-center justify-center">
                  <Image
                    src="/formation/picto/Schedule.svg"
                    alt="Durée"
                    width={20}
                    height={20}
                    className="text-grayBlue"
                  />
                </div>
                <span className="text-sm font-satoshi font-medium text-blackBlue/70">
                  {formation.duration
                    ? `${formation.duration}h`
                    : "Durée non définie"}
                </span>
              </div>
            )}

            {/* Lieu */}
            <div className="flex items-center gap-1 w-full">
              <div className="w-8 h-8 flex items-center justify-center">
                <Image
                  src={getLocationIcon()}
                  alt="Lieu"
                  width={20}
                  height={20}
                  className="text-grayBlue"
                />
              </div>
              <span className="text-sm w-full font-satoshi font-medium text-blackBlue/70">
                {getLocationDisplay()}
              </span>
            </div>
          </div>

          <div className="flex gap-3">
            {/* Capacité */}
            <div className="flex items-center gap-1 w-full">
              <div className="w-8 h-8 flex items-center justify-center">
                <Image
                  src="/formation/picto/Person.svg"
                  alt="Capacité"
                  width={20}
                  height={20}
                  className="text-grayBlue"
                />
              </div>
              <span className="text-sm font-satoshi font-medium text-blackBlue/70">
                {getCapacityDisplay()}
              </span>
            </div>

            {/* Prix */}
            <div className="flex items-center gap-1 w-full">
              <div className="w-8 h-8 flex items-center justify-center">
                <Image
                  src="/formation/picto/Euro.svg"
                  alt="Prix"
                  width={20}
                  height={20}
                  className="text-grayBlue"
                />
              </div>
              <span className="text-sm font-satoshi w-full text-blackBlue/70 font-bold">
                {formation.applicationType === "APPLICATION"
                  ? "Sur candidature"
                  : formation.priceNonPartnerPerTrainee
                  ? `${formation.priceNonPartnerPerTrainee}€ HT/stagiaire`
                  : formation.pricePartnerPerDay
                  ? `${formation.pricePartnerPerDay}€ HT/j`
                  : "Sur devis"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
