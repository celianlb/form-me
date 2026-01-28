"use client";

import FormationCard from "@/components/UI/FormationCard";
import Heading from "@/components/UI/Heading";
import { FormationCardData } from "@/types/formation";
import Image from "next/image";
import { useRef } from "react";
import Button from "../UI/Button";

interface Top10FormationsProps {
  formations: FormationCardData[];
}

export default function Top10Formations({ formations }: Top10FormationsProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  if (!formations || formations.length === 0) {
    return (
      <section className="py-[80px] px-6 md:px-[120px]">
        <div className="text-center">
          <Heading level={2} className="mb-4">
            Top 10 Formations
          </Heading>
          <p className="text-grayBlue">
            Aucune formation disponible pour le moment
          </p>
        </div>
      </section>
    );
  }

  const scrollLeft = () => {
    if (scrollRef.current) {
      const cardWidth = 500 + 24; // FormationCard width + gap (estimated)
      scrollRef.current.scrollBy({ left: -cardWidth, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      const cardWidth = 500 + 24; // FormationCard width + gap (estimated)
      scrollRef.current.scrollBy({ left: cardWidth, behavior: "smooth" });
    }
  };

  return (
    <section className="py-16  relative overflow-y-hidden">
      <Image
        src={"/top10/dot-pattern-left.svg"}
        width={650}
        height={650}
        alt=""
        className="absolute left-0 -top-50 -z-10"
      />
      <Image
        src={"/top10/dot-pattern-right.svg"}
        width={650}
        height={650}
        alt=""
        className="absolute right-0 -top-50"
      />
      <div className="flex flex-col gap-12 relative ">
        {/* Header */}
        <div className="flex flex-col md:flex-row gap-4 md:gap-0 justify-between items-start px-10 md:px-[120px]">
          <div>
            <h2 className="text-[28px] md:text-[32px] tracking-[-1.5px] text-darkBlue font-sora font-bold mb-4">
              Les formations les plus{" "}
              <span className="text-darkBlue/60 italic">appréciées</span>
            </h2>
            <p className="text-grayBlue max-w-[400px]">
              Découvrez notre sélection des meilleures formations pour
              développer vos compétences
            </p>
          </div>
          <Button
            variant="primary"
            href="/formations"
          >
            Voir toutes les formations
          </Button>
        </div>

        {/* Container scrollable */}
        <div className="flex flex-col gap-10 pl-[48px] md:pl-[120px]">
          <div
            ref={scrollRef}
            className="flex gap-6 overflow-x-auto scrollbar-hide scroll-smooth"
            style={{
              scrollbarWidth: "none",
              msOverflowStyle: "none",
            }}
          >
            {formations.map((formation) => (
              <div key={formation.id} className="py-4 flex-shrink-0">
                <FormationCard formation={formation} />
              </div>
            ))}
          </div>

          {/* Boutons de navigation */}
          <div className="space-x-6 w-fit ml-auto mr-10 md:mr-0 px-6 md:px-[120px]">
            <button
              onClick={scrollLeft}
              className="cursor-pointer z-10 bg-white/90 hover:bg-white border border-gray-200 rounded-full p-3 shadow-lg transition-all duration-200 hover:scale-105"
              aria-label="Défiler vers la gauche"
            >
              <svg
                className="w-5 h-5 text-gray-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>

            <button
              onClick={scrollRight}
              className="cursor-pointer z-10 bg-white/90 hover:bg-white border border-gray-200 rounded-full p-3 shadow-lg transition-all duration-200 hover:scale-105"
              aria-label="Défiler vers la droite"
            >
              <svg
                className="w-5 h-5 text-gray-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
