import { FormationCardData } from "@/types/formation";
import Image from "next/image";
import Button from "../../UI/Button";
import FormationCard from "../../UI/FormationCard";

interface BentoGridMobileProps {
  formations: FormationCardData[];
}

export default function BentoGridMobile({ formations }: BentoGridMobileProps) {
  return (
    <div className="flex flex-col gap-4">
      {/* Première div - Formations */}
      <div className="flex flex-col gap-5 relative rounded-4xl p-5 bg-gradient-to-br from-primary/5 via-white to-white overflow-hidden border border-primary/10 shadow-lg shadow-primary/5">
        <div className="absolute -top-12 -right-12 w-40 h-40 bg-primary/10 rounded-full blur-3xl"></div>
        <Image
          src={"/bento/dot-pattern-bento.svg"}
          width={400}
          height={400}
          alt="dot-background-pattern"
          className="absolute bottom-0 right-0 opacity-30"
        />
        <div className="relative z-10">
          <div className="inline-block p-2 items-center leading-none bg-primary/10 rounded-full mb-3">
            <span className="text-xs font-satoshi font-semibold text-primary">
              +150 formations
            </span>
          </div>
          <h3 className="font-satoshi text-lg text-darkBlue font-bold tracking-tight">
            Choisissez votre formation
          </h3>
        </div>
        <div className="flex flex-col gap-2.5 relative z-10">
          {formations.map((formation) => (
            <FormationCard key={formation.id} formation={formation} />
          ))}
        </div>
      </div>

      {/* Deuxième div - Devis */}
      <div className="flex flex-col gap-4 relative rounded-4xl p-5 bg-gradient-to-br from-[#f0f9ff] via-white to-white overflow-hidden items-center text-center border border-grayBlue/10 shadow-lg shadow-primary/5">
        <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-primary/5 rounded-full blur-2xl"></div>
        <div className="relative z-10 text-center space-y-3">
          <h3 className="font-satoshi text-base text-darkBlue font-bold tracking-tight">
            Demandez un devis
          </h3>
          <p className="text-xs text-grayBlue font-satoshi">
            Réponse sous 24h
          </p>
        </div>
        <Image
          src={"/bento/devis.svg"}
          width={200}
          height={80}
          alt="image pour les devis"
          className="relative z-10"
        />
        <Button variant="secondary" href="/devis-&-contact">
          Je souhaite un devis
        </Button>
      </div>

      {/* Grid 2x2 pour les 2 autres divs */}
      <div className="grid grid-cols-2 gap-4">
        {/* Troisième div - Suivi */}
        <div className="flex flex-col relative rounded-4xl bg-gradient-to-br overflow-hidden items-start justify-between p-4 shadow-xl shadow-primary/20 min-h-[180px]">
          <div className="absolute top-4 right-4 w-20 h-20 bg-white/10 rounded-full blur-xl"></div>
          <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-white/5 rounded-full blur-2xl"></div>
          <div className="relative z-10 space-y-1">
            <h3 className="font-satoshi text-sm text-primary font-bold tracking-tight leading-tight">
              Suivez votre formation
            </h3>
            <p className="text-[10px] text-primary/80 font-satoshi">
              À votre rythme
            </p>
          </div>
          <div className="relative z-10 mt-auto self-center">
            <Image
              src={"/bento/suivi.svg"}
              width={120}
              height={140}
              alt="mobile mockup"
              className="relative z-10"
            />
          </div>
        </div>

        {/* Quatrième div - Certification */}
        <div className="flex flex-col relative rounded-4xl px-4 pt-4 bg-gradient-to-br from-primary/5 via-white to-white overflow-hidden items-start justify-between border border-primary/20 shadow-lg shadow-primary/5 min-h-[180px]">
          <div className="absolute top-2 right-2 w-20 h-20 bg-primary/10 rounded-full blur-2xl"></div>
          <div className="relative z-10 space-y-1">
            <div className="inline-flex items-center gap-1 px-2 py-1 bg-primary/10 rounded-full">
              <svg
                className="w-3 h-3 text-primary"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <span className="text-[9px] font-satoshi font-bold text-primary">
                Organisme Certifié
              </span>
            </div>
            <h3 className="font-satoshi text-sm text-darkBlue font-bold tracking-tight leading-tight">
              Obtenez votre
              <br />
              certification
            </h3>
          </div>
          <Image
            src={"/bento/certification.svg"}
            width={70}
            height={60}
            alt="certification"
            className="relative z-10 ml-auto"
          />
        </div>
      </div>

      {/* Cinquième div - Documentation (pleine largeur) */}
      <div className="flex flex-col relative rounded-4xl p-5 bg-gradient-to-br from-darkBlue via-[#152d5e] to-darkBlue overflow-hidden border border-primary/20 shadow-xl shadow-darkBlue/20 justify-between min-h-[140px]">
        <div className="absolute -top-12 -right-12 w-40 h-40 bg-primary/20 rounded-full blur-2xl"></div>
        <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-primary/10 rounded-full blur-xl"></div>
        <div className="relative z-10 space-y-1.5">
          <h3 className="font-satoshi text-base text-white font-bold tracking-tight leading-tight">
            Espace documentation
          </h3>
          <p className="text-xs text-white/60 font-satoshi">
            Accès illimité à vos ressources
          </p>
        </div>
        <Image
          src={"/bento/desktopmockup.svg"}
          width={280}
          height={85}
          alt="documentation"
          className="absolute bottom-0 right-0 translate-x-12 translate-y-4 opacity-90"
        />
      </div>
    </div>
  );
}
