import { FormationCardData } from "@/types/formation";
import Image from "next/image";
import Button from "../../UI/Button";
import FormationCard from "../../UI/FormationCard";

interface BentoGridMobileProps {
  formations: FormationCardData[];
}

export default function BentoGridMobile({ formations }: BentoGridMobileProps) {
  return (
    <div className="flex flex-col gap-6">
      {/* Première div - Formations */}
      <div className="flex flex-col gap-8 relative border border-grayBlue/20 rounded-4xl p-6 bg-white overflow-hidden">
        <Image
          src={"/bento/dot-pattern-bento.svg"}
          width={400}
          height={400}
          alt="dot-background-pattern"
          className="absolute bottom-0 right-0 opacity-50"
        />
        <h3 className="font-satoshi text-lg text-darkBlue font-semibold tracking-tight relative z-10">
          Choisissez votre formation
        </h3>
        <div className="flex flex-col gap-3 relative z-10">
          {formations.map((formation) => (
            <FormationCard key={formation.id} formation={formation} />
          ))}
        </div>
      </div>

      {/* Deuxième div - Devis */}
      <div className="flex flex-col gap-6 relative border border-grayBlue/20 rounded-4xl p-6 bg-white overflow-hidden items-center text-center">
        <h3 className="font-satoshi text-lg text-darkBlue font-semibold tracking-tight">
          Demandez un devis
        </h3>
        <Image
          src={"/bento/devis.svg"}
          width={250}
          height={95}
          alt="image pour les devis"
        />
        <Button variant="secondary" href="/devis-&-contact">
          Je souhaite un devis
        </Button>
      </div>

      {/* Grid 2x2 pour les 3 autres divs */}
      <div className="grid grid-cols-2 gap-4">
        {/* Troisième div - Suivi */}
        <div className="flex flex-col gap-4 relative border border-grayBlue/20 rounded-4xl p-4 bg-white overflow-hidden items-center">
          <h3 className="font-satoshi text-sm text-darkBlue font-semibold tracking-tight text-center">
            Suivez votre formation
          </h3>
          <Image
            src={"/bento/suivi.svg"}
            width={120}
            height={60}
            alt="image pour le suivi"
            className="mt-auto"
          />
        </div>

        {/* Quatrième div - Certification */}
        <div className="flex flex-col gap-4 relative border border-grayBlue/20 rounded-4xl p-4 bg-white overflow-hidden items-center">
          <h3 className="font-satoshi text-sm text-darkBlue font-semibold tracking-tight text-center">
            Obtenez votre certification
          </h3>
          <Image
            src={"/bento/certification.svg"}
            width={100}
            height={75}
            alt="image pour certification"
            className="mt-auto"
          />
        </div>
      </div>

      {/* Cinquième div - Documentation (pleine largeur) */}
      <div className="flex flex-col gap-4 relative border border-grayBlue/20 rounded-4xl p-6 bg-white overflow-hidden">
        <h3 className="font-satoshi text-sm text-darkBlue font-semibold tracking-tight">
          Gardez un suivi avec notre espace documentation
        </h3>
        <div className="relative h-20">
          <Image
            src={"/bento/desktopmockup.svg"}
            width={200}
            height={80}
            alt="image pour documentation"
            className="absolute right-0 bottom-0 translate-x-12 translate-y-12"
          />
        </div>
      </div>
    </div>
  );
}
