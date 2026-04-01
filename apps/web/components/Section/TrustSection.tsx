"use client";

import { Testimonial } from "@/types/testimonial";
import Image from "next/image";

const partners = [
  { name: "GreenEnergy", logo: "/partners/GreenEnergy.png", height: "h-8" },
];

const stats = [
  { number: "4,3/5", label: "satisfaction" },
  { number: "3K+", label: "apprenants formés" },
  { number: "20K+", label: "sessions effectuées" },
  { number: "99,94%", label: "taux de réussite" },
];

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: "Sophie Martin",
    formation: "CACES R489",
    quote:
      "Grâce à Form.me, je me maintiens à jour dans mes compétences et connaissances du métier. Une formation de qualité !",
  },
  {
    id: 2,
    name: "Jean Dupont",
    formation: "Habilitation Électrique",
    quote:
      "Excellente formation, très bien organisée avec des formateurs compétents. Je recommande vivement Form.me.",
  },
  {
    id: 3,
    name: "Marie Leclerc",
    formation: "Formation Sécurité",
    quote:
      "Interface intuitive et contenu pédagogique de qualité. J'ai pu progresser à mon rythme efficacement.",
  },
  {
    id: 4,
    name: "Pierre Moreau",
    formation: "CACES R489",
    quote:
      "Formation pratique et théorique parfaitement équilibrée. Formateurs à l'écoute et très professionnels.",
  },
  {
    id: 5,
    name: "Claire Dubois",
    formation: "Prévention Risques",
    quote:
      "Contenu très complet et actualisé. Les exercices pratiques m'ont beaucoup aidée dans ma compréhension.",
  },
  {
    id: 6,
    name: "Thomas Bernard",
    formation: "Habilitation Électrique",
    quote:
      "Plateforme moderne et efficace. J'ai obtenu ma certification rapidement grâce à leur méthode.",
  },
];

const TestimonialCard = ({ testimonial }: { testimonial: Testimonial }) => (
  <div className="flex-shrink-0 flex flex-col gap-4 bg-white w-[300px] p-5 rounded-3xl border border-gray-200 shadow-sm">
    <p className="font-satoshi text-darkBlue text-sm leading-relaxed">
      &ldquo;{testimonial.quote}&rdquo;
    </p>
    <div className="flex items-center gap-3 mt-auto">
      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
        <span className="text-primary font-bold text-xs">
          {testimonial.name.charAt(0)}
        </span>
      </div>
      <div className="flex flex-col">
        <p className="font-satoshi text-darkBlue font-semibold text-sm">
          {testimonial.name}
        </p>
        <p className="text-grayBlue font-satoshi text-xs">
          {testimonial.formation}
        </p>
      </div>
    </div>
  </div>
);

export default function TrustSection() {
  const firstRow = testimonials.filter((_, index) => index % 2 === 0);
  const secondRow = testimonials.filter((_, index) => index % 2 === 1);

  return (
    <section className="py-16 md:py-24 px-10 md:px-[120px]">
      {/* Titre de section */}
      <div className="mb-8 md:mb-12">
        <h2 className="text-[28px] md:text-[32px] tracking-[-1.5px] text-darkBlue font-sora font-bold">
          Ce que disent nos{" "}
          <span className="text-darkBlue/60 italic">apprenants</span>
        </h2>
        <p className="max-w-[600px] text-grayBlue mt-4">
          Découvrez les retours de nos stagiaires sur leurs expériences de formation.
        </p>
      </div>

      <div className="flex flex-col gap-4">
        {/* Ligne du haut - Témoignages (pleine largeur) */}
        <div className="bg-gray-100 rounded-4xl p-6 md:p-8 overflow-hidden">
          {/* Testimonials scroll */}
          <div className="flex flex-col gap-4 -mx-6 md:-mx-8">
            {/* Première ligne */}
            <div className="relative overflow-hidden mask-fade-horizontal">
              <div className="flex gap-4 animate-scroll-left px-6 md:px-8">
                {firstRow.map((testimonial) => (
                  <TestimonialCard key={testimonial.id} testimonial={testimonial} />
                ))}
                {firstRow.map((testimonial) => (
                  <TestimonialCard
                    key={`duplicate-${testimonial.id}`}
                    testimonial={testimonial}
                  />
                ))}
              </div>
            </div>

            {/* Deuxième ligne */}
            <div className="relative overflow-hidden mask-fade-horizontal">
              <div className="flex gap-4 animate-scroll-right px-6 md:px-8">
                {secondRow.map((testimonial) => (
                  <TestimonialCard key={testimonial.id} testimonial={testimonial} />
                ))}
                {secondRow.map((testimonial) => (
                  <TestimonialCard
                    key={`duplicate-${testimonial.id}`}
                    testimonial={testimonial}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Ligne du bas - 2 cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Card Stats (2/3) */}
          <div className="md:col-span-2 bg-darkBlue rounded-4xl p-6 md:p-8 relative overflow-hidden">
            {/* Background effect */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-3xl" />

            <div className="relative z-10">
              <h3 className="font-sora font-bold text-lg text-white mb-6">
                La qualité au cœur de notre mission
              </h3>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {stats.map((stat) => (
                  <div key={stat.label} className="flex flex-col">
                    <span className="font-sora font-bold text-3xl md:text-4xl text-white tracking-tight">
                      {stat.number}
                    </span>
                    <span className="text-white/60 text-xs font-satoshi mt-1">
                      {stat.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Card Partenaires (1/3) */}
          <div className="bg-gray-100 rounded-4xl p-6 md:p-8 flex flex-col justify-between">
            <h3 className="font-sora font-bold text-lg text-darkBlue mb-4">
              Ils nous font confiance
            </h3>

            <div className="flex items-center justify-center">
              {partners.map((partner) => (
                <Image
                  key={partner.name}
                  src={partner.logo}
                  alt={partner.name}
                  width={160}
                  height={50}
                  className={`${partner.height} w-auto object-contain opacity-70`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
