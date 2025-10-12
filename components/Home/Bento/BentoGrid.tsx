import { FormationsService } from "@/services/formations.service";
import Image from "next/image";
import Button from "../../UI/Button";
import FormationCard from "../../UI/FormationCard";
import BentoGridMobile from "./BentoGridMobile";

export default async function BentoGrid() {
  const formations = await FormationsService.getRandomFormations(2);
  return (
    <>
      {/* Version Mobile */}
      <div className="block lg:hidden">
        <BentoGridMobile formations={formations} />
      </div>

      {/* Version Desktop */}
      <div className="hidden lg:block">
        <div className="flex gap-5 mx-auto">
          {/* Première div - Seule à gauche */}
          <div className="flex-1 max-w-md flex flex-col gap-5 relative rounded-4xl p-6 bg-gradient-to-br from-primary/5 via-white to-white overflow-hidden border border-primary/10 shadow-lg shadow-primary/5">
            <div className="absolute -top-20 -right-20 w-64 h-64 bg-primary/10 rounded-full blur-3xl"></div>
            <Image
              src={"/bento/dot-pattern-bento.svg"}
              width={650}
              height={650}
              alt="dot-background-pattern"
              className="absolute bottom-0 right-0 opacity-30"
            />
            <div className="relative z-10">
              <div className="inline-block p-2 items-center leading-none bg-primary/10 rounded-full mb-3">
                <span className="text-xs font-satoshi font-semibold text-primary">
                  +150 formations
                </span>
              </div>
              <h3 className="font-satoshi text-xl text-darkBlue font-bold tracking-tight">
                Choisissez votre formation
              </h3>
            </div>
            <div className="flex flex-col gap-3 translate-x-8 relative z-10">
              {formations.map((formation) => (
                <FormationCard key={formation.id} formation={formation} />
              ))}
            </div>
          </div>

          {/* Colonne de droite - 4 divs en 2x2 */}
          <div className="flex-1 flex flex-col gap-5">
            {/* Ligne du haut */}
            <div className="flex gap-5 flex-1">
              {/* Deuxième div */}
              <div className="flex-1 flex flex-col gap-4 relative rounded-4xl p-6 bg-gradient-to-br from-[#f0f9ff] via-white to-white overflow-hidden items-center justify-center border border-grayBlue/10 shadow-lg shadow-primary/5 hover:shadow-xl hover:shadow-primary/10 transition-all duration-300 group">
                <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-primary/5 rounded-full blur-2xl group-hover:bg-primary/10 transition-colors"></div>
                <div className="relative z-10 text-center space-y-3">
                  <h3 className="font-satoshi text-lg text-darkBlue font-bold tracking-tight">
                    Demandez un devis
                  </h3>
                  <p className="text-xs text-grayBlue font-satoshi">
                    Réponse sous 24h
                  </p>
                </div>
                <Image
                  src={"/bento/devis.svg"}
                  width={240}
                  height={95}
                  alt="image pour les devis"
                  className="relative z-10"
                />
                <Button variant="secondary" href="/devis-&-contact">
                  Je souhaite un devis
                </Button>
              </div>

              {/* Troisième div */}
              <div className="flex-1 flex flex-col relative rounded-4xl bg-gradient-to-br  overflow-hidden items-start justify-between p-6 shadow-xl shadow-primary/20 group hover:shadow-2xl hover:shadow-primary/30 transition-all duration-300">
                <div className="absolute top-8 right-8 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
                <div className="absolute -bottom-16 -left-16 w-64 h-64 bg-white/5 rounded-full blur-3xl"></div>
                <div className="relative z-10 space-y-1.5">
                  <h3 className="font-satoshi text-xl text-primary font-bold tracking-tight">
                    Suivez votre formation
                  </h3>
                  <p className="text-xs text-primary/80 font-satoshi">
                    À votre rythme
                  </p>
                </div>
                <div className="relative z-10 space-y-2.5 self-center mt-auto">
                  <Image
                    src={"/bento/suivi.svg"}
                    width={200}
                    height={240}
                    alt="mobile mockup"
                    className="relative z-10"
                  />
                </div>
              </div>
            </div>

            {/* Ligne du bas */}
            <div className="flex gap-5 flex-1">
              {/* Quatrième div */}
              <div className="flex-1 flex flex-col relative rounded-4xl px-6 pt-6 bg-gradient-to-br from-primary/5 via-white to-white overflow-hidden items-start justify-between border border-primary/20 shadow-lg shadow-primary/5 group hover:shadow-xl hover:shadow-primary/10 transition-all duration-300">
                <div className="absolute top-4 right-4 w-32 h-32 bg-primary/10 rounded-full blur-3xl"></div>
                <div className="relative z-10 space-y-1.5">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-primary/10 rounded-full">
                    <svg
                      className="w-3.5 h-3.5 text-primary"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <span className="text-[10px] font-satoshi font-bold text-primary">
                      Organisme Certifié
                    </span>
                  </div>
                  <h3 className="font-satoshi text-lg text-darkBlue font-bold tracking-tight leading-tight">
                    Obtenez votre
                    <br />
                    certification
                  </h3>
                </div>
                <Image
                  src={"/bento/certification.svg"}
                  width={110}
                  height={105}
                  alt="certification"
                  className="relative z-10 ml-auto group-hover:scale-110 transition-transform duration-300"
                />
              </div>

              {/* Cinquième div */}
              <div className="flex-1 flex flex-col relative rounded-4xl p-6 bg-gradient-to-br from-darkBlue via-[#152d5e] to-darkBlue overflow-hidden border border-primary/20 shadow-xl shadow-darkBlue/20 justify-between">
                <div className="absolute -top-20 -right-20 w-64 h-64 bg-primary/20 rounded-full blur-3xl"></div>
                <div className="absolute -bottom-16 -left-16 w-48 h-48 bg-primary/10 rounded-full blur-2xl"></div>
                <div className="relative z-10 space-y-1.5">
                  <h3 className="font-satoshi text-lg text-white font-bold tracking-tight leading-tight">
                    Espace documentation
                  </h3>
                  <p className="text-[14px] text-white/60 font-satoshi">
                    Accès illimité à vos ressources
                  </p>
                </div>
                <Image
                  src={"/bento/desktopmockup.svg"}
                  width={400}
                  height={115}
                  alt="documentation"
                  className="absolute bottom-0 right-0 translate-x-16 translate-y-6 opacity-90 group-hover:opacity-100 transition-opacity"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
