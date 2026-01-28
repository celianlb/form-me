import { Users, Zap, HeadphonesIcon } from "lucide-react";
import Image from "next/image";
import Button from "../UI/Button";

export default function PartnerCTA() {
  const benefits = [
    {
      icon: Zap,
      title: "Tarifs préférentiels",
      description: "Accédez à des prix réduits à la journée",
    },
    {
      icon: Users,
      title: "Facturation simplifiée",
      description: "Un forfait mensuel sans surprise",
    },
    {
      icon: HeadphonesIcon,
      title: "Support prioritaire",
      description: "Une équipe dédiée à votre réussite",
    },
  ];

  return (
    <section className="px-10 md:px-[120px] py-16 md:py-24">
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        {/* Card principale - Programme Partenaire */}
        <div className="lg:col-span-3 bg-darkBlue rounded-4xl p-8 md:p-10 relative overflow-hidden flex flex-col justify-between min-h-[320px]">
          {/* Background effects */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary/20 rounded-full blur-3xl" />
          <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-primary/10 rounded-full blur-2xl" />
          <Image
            src="/bento/dot-pattern-bento.svg"
            width={400}
            height={400}
            alt=""
            className="absolute bottom-0 right-0 opacity-10"
          />

          <div className="relative z-10">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-3 py-1.5 mb-4">
              <span className="text-xs font-satoshi font-semibold text-white">
                Programme Partenaire
              </span>
            </div>

            {/* Titre */}
            <h2 className="font-sora font-bold text-2xl md:text-3xl text-white mb-3 tracking-tight">
              Rejoignez notre réseau{" "}
              <span className="text-white/80 italic">partenaire</span>
            </h2>

            {/* Description */}
            <p className="text-white/70 font-satoshi max-w-md mb-6">
              Développez votre activité avec un engagement de seulement{" "}
              <span className="font-bold text-white">10 formations / an</span>.
            </p>
          </div>

          {/* CTA Button */}
          <div className="relative z-10">
            <Button variant="light" href="/nous-rejoindre">
              Devenir partenaire
            </Button>
          </div>
        </div>

        {/* Cards avantages - style badges */}
        <div className="lg:col-span-2 flex flex-col gap-5 justify-center">
          {benefits.map((benefit, index) => (
            <div
              key={index}
              className={`border-2 border-dashed border-gray-300 bg-white rounded-xl px-5 py-4 flex items-center gap-4 ${
                index === 1 ? "rotate-2" : index === 2 ? "-rotate-1" : ""
              }`}
            >
              <benefit.icon className="w-5 h-5 text-primary shrink-0" />
              <div>
                <h3 className="font-satoshi font-bold text-darkBlue text-sm">
                  {benefit.title}
                </h3>
                <p className="text-grayBlue text-xs font-satoshi">
                  {benefit.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
