import { FormationCardData } from "@/types/formation";
import Image from "next/image";
import Link from "next/link";

interface FormationCardProps {
  formation: FormationCardData;
}

export default function FormationCard({ formation }: FormationCardProps) {
  const href = formation.link || `/formations/${formation.slug}`;

  const getDurationDisplay = () => {
    if (formation.durationDays) {
      return `${formation.durationDays} jour${formation.durationDays > 1 ? "s" : ""}`;
    }
    if (formation.duration) {
      return `${formation.duration}h`;
    }
    return null;
  };

  return (
    <Link
      href={href}
      className="group flex flex-col w-full h-[350px] relative rounded-3xl border border-grayBlue/20 bg-gradient-to-tr from-white to-gray-100 hover:border-primary transition-all duration-300 ease-in-out cursor-pointer hover:bg-gradient-radial hover:from-white hover:via-[#D8E5FF] hover:to-white overflow-hidden"
    >
      {/* Image de la formation */}
      {formation.imageUrl ? (
        <div className="relative w-full h-40 overflow-hidden">
          <Image
            src={formation.imageUrl}
            alt={formation.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
      ) : (
        <div className="w-full h-40 bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center">
          <Image
            src="/formation/picto/Schedule.svg"
            alt="Formation"
            width={48}
            height={48}
            className="opacity-30"
          />
        </div>
      )}

      {/* Contenu */}
      <div className="flex flex-col flex-1 gap-3 p-6">
        {/* Titre */}
        <h3 className="text-base font-satoshi font-semibold tracking-tight text-blackBlue line-clamp-2">
          {formation.title}
        </h3>

        {/* Description courte */}
        {formation.shortDescription && (
          <p className="text-sm text-grayBlue/80 leading-relaxed line-clamp-3">
            {formation.shortDescription}
          </p>
        )}

        {/* Durée */}
        {getDurationDisplay() && (
          <div className="flex items-center gap-2 mt-auto">
            <Image
              src="/formation/picto/Schedule.svg"
              alt="Durée"
              width={16}
              height={16}
              className="opacity-60"
            />
            <span className="text-xs font-satoshi font-medium text-blackBlue/60">
              {getDurationDisplay()}
            </span>
          </div>
        )}
      </div>
    </Link>
  );
}
