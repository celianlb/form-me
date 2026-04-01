import { FormationCardData } from "@/types/formation";
import Image from "next/image";
import Button from "../../UI/Button";
import FormationCarousel from "./FormationCarousel";

interface BentoGridMobileProps {
  formations: FormationCardData[];
  totalCount: number;
}

export default function BentoGridMobile({ formations, totalCount }: BentoGridMobileProps) {
  return (
    <div className="flex flex-col gap-4">
      {/* Card 1 - Choisissez votre formation */}
      <div className="flex flex-col gap-4 relative rounded-4xl p-5 bg-darkBlue overflow-hidden border border-primary/10">
        <div className="absolute top-1/3 left-1/6 w-40 h-40 bg-blue-400 rounded-full blur-3xl opacity-30"></div>
        <Image
          src={"/bento/dot-pattern-bento.svg"}
          width={400}
          height={400}
          alt="dot-background-pattern"
          className="absolute bottom-0 right-0 opacity-20"
        />
        <div className="relative z-10 flex flex-col gap-2">
          <div className="inline-block w-fit px-3 py-1.5 items-center leading-none bg-primary/30 rounded-full">
            <span className="text-xs text-white font-satoshi font-semibold">
              +{totalCount} formations
            </span>
          </div>
          <h3 className="font-satoshi text-base font-bold tracking-tight text-white">
            Choisissez votre formation
          </h3>
        </div>
        <div className="relative z-10">
          <FormationCarousel formations={formations} />
        </div>
      </div>

      {/* Card 2 - Demandez un devis */}
      <div className="flex flex-col gap-4 relative rounded-4xl p-5 bg-gray-100 overflow-hidden border border-gray-200">
        {/* Titre et bouton */}
        <div className="flex items-center justify-between relative z-10">
          <h3 className="font-satoshi text-base text-darkBlue font-bold tracking-tight">
            Demandez un devis
          </h3>
          <Button variant="dark" href="/devis-&-contact">
            Je souhaite un devis
          </Button>
        </div>

        {/* Badges */}
        <div className="relative z-10 flex flex-col items-center gap-1 py-4">
          <div className="border-2 border-dashed border-gray-300 rounded-xl px-3 py-1.5">
            <span className="font-satoshi font-bold text-xs text-darkBlue">
              Réponse sous 24h
            </span>
          </div>
          <div className="bg-primary rounded-xl px-3 py-1.5 rotate-3 shadow-lg">
            <span className="font-satoshi font-bold text-xs text-white">
              100% gratuit
            </span>
          </div>
          <div className="border-2 border-dashed border-gray-300 rounded-xl px-3 py-1.5 -rotate-2">
            <span className="font-satoshi font-bold text-xs text-darkBlue">
              Sans engagement
            </span>
          </div>
        </div>
      </div>

      {/* Grid 2 colonnes pour les cards 3 et 4 */}
      <div className="grid grid-cols-2 gap-4">
        {/* Card 3 - Suivez votre formation */}
        <div className="relative rounded-4xl overflow-hidden min-h-[140px] border border-gray-200">
          <div className="absolute inset-0 z-0">
            <Image
              src="/bento/formation.jpeg"
              alt="Formation"
              fill
              className="object-cover opacity-40"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-white/90 via-white/50 to-transparent" />
          </div>
          <div className="relative z-10 h-full flex items-center p-4">
            <div className="space-y-1">
              <h3 className="font-satoshi text-sm text-darkBlue font-bold tracking-tight">
                Suivez votre formation
              </h3>
              <p className="text-[10px] text-grayBlue font-satoshi">
                À votre rythme
              </p>
            </div>
          </div>
        </div>

        {/* Card 4 - Obtenez votre certification */}
        <div className="flex flex-col relative rounded-4xl p-4 bg-gray-100 overflow-hidden border border-gray-200 min-h-[140px]">
          {/* Étoiles */}
          <svg className="absolute top-2 left-4 w-2 h-2 text-primary" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0L13.5 9.5L24 12L13.5 14.5L12 24L10.5 14.5L0 12L10.5 9.5L12 0Z" />
          </svg>
          <svg className="absolute top-5 left-10 w-2.5 h-2.5 text-primary/60" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0L13.5 9.5L24 12L13.5 14.5L12 24L10.5 14.5L0 12L10.5 9.5L12 0Z" />
          </svg>
          <svg className="absolute top-2 right-6 w-3 h-3 text-primary" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0L13.5 9.5L24 12L13.5 14.5L12 24L10.5 14.5L0 12L10.5 9.5L12 0Z" />
          </svg>

          {/* Titre */}
          <div className="relative z-10 text-center">
            <h3 className="font-satoshi text-sm text-darkBlue font-bold tracking-tight">
              Obtenez votre certification
            </h3>
          </div>

          {/* Badges */}
          <div className="relative z-10 flex flex-col items-center gap-1 mt-auto pt-2">
            <div className="border-2 border-dashed border-gray-300 rounded-lg px-2 py-1">
              <span className="font-satoshi font-bold text-[10px] text-darkBlue">
                C&apos;est validé !
              </span>
            </div>
            <div className="bg-primary rounded-lg px-2 py-1 -rotate-6 shadow-lg">
              <span className="font-satoshi font-bold text-[10px] text-white">
                Tu es certifié !
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Card 5 - Espace documentation */}
      <div className="flex flex-col relative rounded-4xl p-5 bg-gradient-to-br from-darkBlue via-[#152d5e] to-darkBlue overflow-hidden border border-primary/20 min-h-[120px]">
        <div className="absolute -top-12 -right-12 w-32 h-32 bg-primary/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-8 -left-8 w-24 h-24 bg-primary/10 rounded-full blur-2xl"></div>
        <div className="relative z-10 space-y-1">
          <h3 className="font-satoshi text-base text-white font-bold tracking-tight">
            Espace documentation
          </h3>
          <p className="text-xs text-white/60 font-satoshi">
            Accès illimité à vos ressources
          </p>
        </div>
        <Image
          src={"/bento/desktopmockup.svg"}
          width={240}
          height={140}
          alt="documentation"
          className="absolute bottom-0 right-0 translate-x-8 translate-y-4 z-10 opacity-90"
        />
      </div>
    </div>
  );
}
