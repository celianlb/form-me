import { FormationsService } from "@/services/formations.service";
import Image from "next/image";
import Button from "../../UI/Button";
import BentoGridMobile from "./BentoGridMobile";
import FormationCarousel from "./FormationCarousel";

export default async function BentoGrid() {
  const formations = await FormationsService.getRandomFormations(10);
  return (
    <>
      {/* Version Mobile */}
      <div className="block lg:hidden">
        <BentoGridMobile formations={formations.slice(0, 2)} />
      </div>

      {/* Version Desktop */}
      <div className="hidden lg:block">
        <div className="flex flex-col gap-5 mx-auto">
          {/* Ligne du haut - 2 cards */}
          <div className="flex gap-5">
            {/* Card 1 - Choisissez votre formation (horizontale) */}
            <div className="flex-2 flex flex-col gap-4 bg-darkBlue relative rounded-4xl p-6 overflow-hidden border border-primary/10">
              <div className="absolute top-1/3 left-1/6 w-64 h-64 bg-blue-400 rounded-full blur-3xl opacity-30"></div>
              <Image
                src={"/bento/dot-pattern-bento.svg"}
                width={650}
                height={650}
                alt="dot-background-pattern"
                className="absolute bottom-0 right-0 opacity-20"
              />
              <div className="relative z-10 flex items-center gap-4">
                <div className="inline-block px-3 py-1.5 items-center leading-none bg-primary/30 rounded-full">
                  <span className="text-xs text-white font-satoshi font-semibold">
                    +15 formations
                  </span>
                </div>
                <h3 className="font-satoshi text-lg font-bold tracking-tight text-white">
                  Choisissez votre formation
                </h3>
              </div>
              <div className="relative z-10">
                <FormationCarousel formations={formations} />
              </div>
            </div>

            {/* Card 2 - Demandez un devis */}
            <div className="flex-1 flex flex-col relative rounded-4xl p-6 bg-gray-100 overflow-hidden border border-gray-200">
              {/* Titre */}
              <h3 className="font-satoshi text-lg text-darkBlue font-bold tracking-tight relative z-10">
                Demandez un devis
              </h3>

              {/* Badges style certification */}
              <div className="relative z-10 flex flex-col items-center gap-1 flex-1 justify-center">
                {/* Badge 1 - pointillé */}
                <div className="border-2 border-dashed border-gray-300 rounded-xl px-4 py-2">
                  <span className="font-satoshi font-bold text-sm text-darkBlue">
                    Réponse sous 24h
                  </span>
                </div>
                {/* Badge 2 - bleu incliné */}
                <div className="bg-primary rounded-xl px-4 py-2 rotate-3 shadow-lg">
                  <span className="font-satoshi font-bold text-sm text-white">
                    100% gratuit
                  </span>
                </div>
                {/* Badge 3 - pointillé */}
                <div className="border-2 border-dashed border-gray-300 rounded-xl px-4 py-2 -rotate-2">
                  <span className="font-satoshi font-bold text-sm text-darkBlue">
                    Sans engagement
                  </span>
                </div>
              </div>

              {/* Bouton en bas */}
              <div className="relative z-10 mt-auto">
                <Button
                  variant="primary"
                  href="/devis-&-contact"
                  className="w-full justify-between"
                >
                  Je souhaite un devis
                </Button>
              </div>
            </div>
          </div>

          {/* Ligne du bas - 3 cards avec hauteur réduite */}
          <div className="flex gap-5">
            {/* Card 3 - Suivez votre formation */}
            <div className="flex-1 relative rounded-4xl overflow-hidden min-h-40 border border-gray-200">
              {/* Image de fond */}
              <div className="absolute inset-0 z-0">
                <Image
                  src="/bento/formation.jpeg"
                  alt="Formation"
                  fill
                  className="object-cover opacity-40"
                />
                <div className="absolute inset-0 bg-linear-to-r from-white/90 via-white/50 to-transparent" />
              </div>
              <div className="relative z-10 h-full flex items-center p-5">
                <div className="space-y-1">
                  <h3 className="font-satoshi text-lg text-darkBlue font-bold tracking-tight">
                    Suivez votre formation
                  </h3>
                  <p className="text-xs text-grayBlue font-satoshi">
                    À votre rythme
                  </p>
                </div>
              </div>
            </div>

            {/* Card 4 - Obtenez votre certification */}
            <div className="flex-1 flex flex-col relative rounded-4xl p-5 bg-gray-100 overflow-hidden border border-gray-200 min-h-40">
              {/* Étoiles dispersées autour du titre */}
              <svg
                className="absolute top-3 left-6 w-3 h-3 text-primary"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 0L13.5 9.5L24 12L13.5 14.5L12 24L10.5 14.5L0 12L10.5 9.5L12 0Z" />
              </svg>
              <svg
                className="absolute top-8 left-16 w-4 h-4 text-primary/60"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 0L13.5 9.5L24 12L13.5 14.5L12 24L10.5 14.5L0 12L10.5 9.5L12 0Z" />
              </svg>
              <svg
                className="absolute top-2 right-12 w-5 h-5 text-primary"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 0L13.5 9.5L24 12L13.5 14.5L12 24L10.5 14.5L0 12L10.5 9.5L12 0Z" />
              </svg>
              <svg
                className="absolute top-10 right-6 w-3 h-3 text-primary/70"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 0L13.5 9.5L24 12L13.5 14.5L12 24L10.5 14.5L0 12L10.5 9.5L12 0Z" />
              </svg>
              <svg
                className="absolute top-14 left-8 w-2.5 h-2.5 text-primary/50"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 0L13.5 9.5L24 12L13.5 14.5L12 24L10.5 14.5L0 12L10.5 9.5L12 0Z" />
              </svg>

              {/* Titre centré */}
              <div className="relative z-10 text-center">
                <h3 className="font-satoshi text-lg text-darkBlue font-bold tracking-tight">
                  Obtenez votre
                </h3>
                <span className="font-satoshi text-lg text-darkBlue font-bold tracking-tight">
                  attestation
                </span>
              </div>

              {/* Visuel style "validé" en bas */}
              <div className="relative z-10 flex flex-col items-center gap-1 mt-auto pt-4">
                {/* Encadré pointillé */}
                <div className="border-2 border-dashed border-gray-300 rounded-xl px-4 py-2">
                  <span className="font-satoshi font-bold text-sm text-darkBlue">
                    C&apos;est validé !
                  </span>
                </div>
                {/* Badge bleu incliné */}
                <div className="bg-primary rounded-xl px-4 py-2 -rotate-6 shadow-lg">
                  <span className="font-satoshi font-bold text-sm text-white">
                    Félicitations, ton attestation est validée !
                  </span>
                </div>
              </div>
            </div>

            {/* Card 5 - Espace documentation */}
            <div className="flex-1 flex flex-col relative rounded-4xl p-5 bg-linear-to-br from-darkBlue via-[#152d5e] to-darkBlue overflow-hidden border border-primary/20 min-h-40">
              <div className="absolute -top-16 -right-16 w-48 h-48 bg-primary/20 rounded-full blur-3xl"></div>
              <div className="absolute -bottom-12 -left-12 w-40 h-40 bg-primary/10 rounded-full blur-2xl"></div>
              <div className="relative z-10 space-y-1">
                <h3 className="font-satoshi text-lg text-white font-bold tracking-tight">
                  Espace documentation
                </h3>
                <p className="text-xs text-white/60 font-satoshi">
                  Accès illimité à vos ressources
                </p>
              </div>
              <Image
                src={"/bento/desktopmockup.svg"}
                width={308}
                height={176}
                alt="documentation"
                className="absolute bottom-0 right-0 translate-x-8 translate-y-4 z-10 opacity-90"
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
