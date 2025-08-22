import { FormationsService } from "@/services/formations.service";
import Image from "next/image";
import Button from "../../UI/Button";
import FormationCard from "../../UI/FormationCard";
import BentoGridMobile from "./BentoGridMobile";

export default async function BentoGrid() {
  const formations = await FormationsService.getRandomFormations(3);
  return (
    <>
      {/* Version Mobile */}
      <div className="block lg:hidden">
        <BentoGridMobile formations={formations} />
      </div>

      {/* Version Desktop */}
      <div className="hidden lg:block">
        <div className="flex gap-6 mx-auto">
          {/* Première div - Seule à gauche */}
          <div className="flex-1 max-w-md flex flex-col gap-12 relative border border-grayBlue/20 rounded-4xl p-8 bg-white overflow-hidden">
            <Image
              src={"/bento/dot-pattern-bento.svg"}
              width={650}
              height={650}
              alt="dot-background-pattern"
              className="absolute bottom-0 right-0 "
            />
            <h3 className=" font-satoshi text-xl text-darkBlue font-semibold tracking-tight">
              Choisissez votre formation
            </h3>
            <div className="flex flex-col gap-4 translate-x-12">
              {formations.map((formation) => (
                <FormationCard key={formation.id} formation={formation} />
              ))}
            </div>
          </div>

          {/* Colonne de droite - 4 divs en 2x2 */}
          <div className="flex-1 flex flex-col gap-6">
            {/* Ligne du haut */}
            <div className="flex gap-6 flex-1">
              {/* Deuxième div */}
              <div className="flex-1  flex flex-col gap-6 relative border border-grayBlue/20 rounded-4xl p-8 bg-white overflow-hidden items-center justify-center">
                <h3 className=" font-satoshi text-xl text-darkBlue font-semibold tracking-tight">
                  Demandez un devis
                </h3>
                <Image
                  src={"/bento/devis.svg"}
                  width={308}
                  height={118}
                  alt="image pour les devis"
                />
                <Button variant="secondary">Je souhaites un devis</Button>
              </div>

              {/* Troisième div */}
              <div className="flex-1 flex flex-col gap-6 relative border border-grayBlue/20 rounded-4xl bg-white overflow-hidden items-center justify-start py-8">
                <h3 className=" font-satoshi text-xl text-darkBlue font-semibold tracking-tight">
                  Suivez votre formation
                </h3>
                <Image
                  src={"/bento/suivi.svg"}
                  width={308}
                  height={118}
                  alt="image pour les devis"
                  className="absolute"
                />
              </div>
            </div>

            {/* Ligne du bas */}
            <div className="flex gap-6 flex-1">
              {/* Quatrième div */}
              <div className="flex-1 flex flex-col gap-6 relative border border-grayBlue/20 rounded-4xl p-8 bg-white overflow-hidden items-start justify-center">
                <h3 className=" font-satoshi text-xl text-darkBlue font-semibold tracking-tight">
                  Obtenez votre certification
                </h3>
                <Image
                  src={"/bento/certification.svg"}
                  width={181}
                  height={137}
                  alt="image pour les devis"
                  className=" ml-auto"
                />
              </div>

              {/* Cinquième div */}
              <div className="flex-1 flex flex-col gap-6 relative border border-grayBlue/20 rounded-4xl p-8 bg-white overflow-hidden">
                <h3 className=" font-satoshi text-sm text-darkBlue font-semibold tracking-tight">
                  Gardez un suivi avec notre espace documentation
                </h3>
                <Image
                  src={"/bento/desktopmockup.svg"}
                  width={308}
                  height={118}
                  alt="image pour les devis"
                  className="absolute bottom-0 right-0 translate-x-12 translate-y-8"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
