"use client";

import { Testimonial } from "@/types/testimonial";
import Image from "next/image";

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
  {
    id: 7,
    name: "Isabelle Roux",
    formation: "Formation Sécurité",
    quote:
      "Très satisfaite de ma formation. Le suivi personnalisé fait toute la différence chez Form.me.",
  },
  {
    id: 8,
    name: "Michel Petit",
    formation: "CACES R489",
    quote:
      "Formation de haute qualité avec des cas pratiques très utiles. Je recommande sans hésitation.",
  },
];

const TestimonialCard = ({ testimonial }: { testimonial: Testimonial }) => (
  <div className="flex-shrink-0 flex flex-col gap-6 bg-white w-[350px] p-6 rounded-4xl border border-primary/30">
    <p className="font-satoshi text-darkBlue font-semibold text-sm leading-relaxed">
      &ldquo;{testimonial.quote}&rdquo;
    </p>
    <div className="flex items-center gap-4">
      <Image
        src={testimonial.avatar || "/formation/picto/Person.svg"}
        width={32}
        height={32}
        alt="Avatar"
        className="rounded-full"
      />
      <div className="flex flex-col">
        <p className="font-satoshi text-grayBlue font-bold tracking-tight text-sm">
          {testimonial.name}
        </p>
        <p className="text-grayBlue font-satoshi text-xs">
          a suivi la formation {testimonial.formation}
        </p>
      </div>
    </div>
  </div>
);

export default function Testimonials() {
  // Première ligne : testimonials impairs
  const firstRow = testimonials.filter((_, index) => index % 2 === 0);
  // Deuxième ligne : testimonials pairs
  const secondRow = testimonials.filter((_, index) => index % 2 === 1);

  return (
    <div className="flex flex-col relative gap-8 bg-[#DBE6FF]/20 px-8 py-16 md:p-16 md:rounded-4xl overflow-hidden md:px-[120px]">
      {/* Header */}
      <div className="flex relative flex-col gap-4 items-center">
        <p className="flex relative gap-2 bg-primary text-white p-3 rounded-full w-[200px] md:w-fit font-satoshi font-semibold shadow-[0_4px_4px_rgba(202,219,255,1)]">
          <Image
            className="absolute -rotate-12 -left-10 -top-6 md:-left-20 md:-top-10 w-[32px] h-[32px]"
            src={"/Quote.png"}
            width={48}
            height={48}
            alt="quote"
          />
          <Image
            className="absolute rotate-12 -right-10 -top-6 md:-right-20 md:-top-10 w-[32px] h-[32px]"
            src={"/QuoteDown.png"}
            width={48}
            height={48}
            alt="quote"
          />
          <Image
            src={"/formation/picto/Rate.svg"}
            width={20}
            height={20}
            alt="Star"
            className="text-white"
          />
          Noté par plus de 1000 étudiants
        </p>
      </div>

      {/* Testimonials - Première ligne (scroll vers la gauche) */}
      <div className="relative overflow-hidden mask-fade-horizontal">
        <div className="flex gap-6 animate-scroll-left">
          {/* Première série */}
          {firstRow.map((testimonial) => (
            <TestimonialCard key={testimonial.id} testimonial={testimonial} />
          ))}
          {/* Duplication pour l'effet infini */}
          {firstRow.map((testimonial) => (
            <TestimonialCard
              key={`duplicate-${testimonial.id}`}
              testimonial={testimonial}
            />
          ))}
        </div>
      </div>

      {/* Testimonials - Deuxième ligne (scroll vers la droite) */}
      <div className="relative overflow-hidden mask-fade-horizontal">
        <div className="flex gap-6 animate-scroll-right">
          {/* Première série */}
          {secondRow.map((testimonial) => (
            <TestimonialCard key={testimonial.id} testimonial={testimonial} />
          ))}
          {/* Duplication pour l'effet infini */}
          {secondRow.map((testimonial) => (
            <TestimonialCard
              key={`duplicate-${testimonial.id}`}
              testimonial={testimonial}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
