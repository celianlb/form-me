import { ArrowRight, CheckCircle2, Sparkles } from "lucide-react";
import Link from "next/link";
import Button from "../UI/Button";
import Heading from "../UI/Heading";

export default function PartnerCTA() {
  const benefits = [
    "Tarifs préférentiels à la journée",
    "Facturation forfaitaire simplifiée",
    "Support dédié et prioritaire",
  ];

  return (
    <section className="px-[40px] md:px-[120px] py-[80px]">
      <div className="relative bg-gradient-to-br from-secondary/5 via-white to-primary/5 border border-primary/10 rounded-[32px] md:rounded-[50px] p-8 md:p-12 lg:p-16 overflow-hidden">
        {/* Pattern décoratif */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -z-10"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-secondary/5 rounded-full blur-3xl -z-10"></div>

        <div className="relative z-10 max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm border border-primary/20 rounded-full px-4 py-2 mb-6">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-satoshi font-medium text-darkBlue">
              Programme Partenaire
            </span>
          </div>

          {/* Titre */}
          <Heading
            level={2}
            className="font-satoshi font-bold text-3xl md:text-4xl lg:text-5xl text-darkBlue mb-4 tracking-tight"
          >
            Rejoignez notre réseau{" "}
            <span className="text-primary">partenaire</span>
          </Heading>

          {/* Description */}
          <p className="text-lg text-grayBlue font-satoshi mb-8 max-w-2xl mx-auto">
            Accédez à des tarifs préférentiels et développez votre activité de
            formation avec un engagement de seulement{" "}
            <span className="font-bold text-darkBlue">10 formations / an</span>.
          </p>

          {/* Avantages */}
          <div className="flex flex-col md:flex-row gap-4 justify-center items-center mb-10">
            {benefits.map((benefit, index) => (
              <div
                key={index}
                className="flex items-center gap-2 bg-white/60 backdrop-blur-sm border border-primary/10 rounded-full px-4 py-2"
              >
                <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0" />
                <span className="text-sm font-satoshi text-darkBlue">
                  {benefit}
                </span>
              </div>
            ))}
          </div>

          {/* CTA Button */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/nous-rejoindre">
              <Button variant="primary" className="group">
                Devenir partenaire
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
