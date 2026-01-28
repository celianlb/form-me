"use client";

import { FormationCardData } from "@/types/formation";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";

interface FormationCarouselProps {
  formations: FormationCardData[];
}

function MiniFormationCard({ formation }: { formation: FormationCardData }) {
  const href = formation.link || `/formations/${formation.slug}`;

  const getDurationDisplay = () => {
    if (formation.durationDays) {
      return `${formation.durationDays} jour${formation.durationDays > 1 ? "s" : ""}`;
    }
    if (formation.duration) {
      return `${formation.duration}h`;
    }
    return null;
  };

  return (
    <Link
      href={href}
      className="flex flex-col w-[280px] min-w-[280px] h-[220px] relative rounded-2xl border border-grayBlue/20 bg-white cursor-pointer overflow-hidden"
    >
      {/* Image de la formation */}
      {formation.imageUrl ? (
        <div className="relative w-full h-28 shrink-0 overflow-hidden">
          <Image
            src={formation.imageUrl}
            alt={formation.title}
            fill
            className="object-cover"
          />
        </div>
      ) : (
        <div className="w-full h-28 shrink-0 bg-gray-100 flex items-center justify-center">
          <Image
            src="/formation/picto/Schedule.svg"
            alt="Formation"
            width={32}
            height={32}
            className="opacity-30"
          />
        </div>
      )}

      {/* Contenu */}
      <div className="flex flex-col gap-2 p-4 flex-1">
        {/* Titre */}
        <h4 className="text-sm font-satoshi font-medium tracking-tight text-blackBlue line-clamp-2">
          {formation.title}
        </h4>

        {/* Durée */}
        {getDurationDisplay() && (
          <div className="flex items-center gap-1.5 mt-auto">
            <Image
              src="/formation/picto/Schedule.svg"
              alt="Durée"
              width={14}
              height={14}
              className="text-grayBlue"
            />
            <span className="text-xs font-satoshi font-medium text-blackBlue/70">
              {getDurationDisplay()}
            </span>
          </div>
        )}
      </div>
    </Link>
  );
}

export default function FormationCarousel({
  formations,
}: FormationCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const scrollPositionRef = useRef(0);
  const animationIdRef = useRef<number | null>(null);

  // Duplicate formations for infinite scroll effect
  const duplicatedFormations = [...formations, ...formations];

  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;

    const scrollSpeed = 0.5; // pixels per frame

    const scroll = () => {
      if (!scrollContainer) return;

      scrollPositionRef.current += scrollSpeed;

      // Reset to start when we've scrolled through the first set
      const halfWidth = scrollContainer.scrollWidth / 2;
      if (scrollPositionRef.current >= halfWidth) {
        scrollPositionRef.current = 0;
      }

      scrollContainer.scrollLeft = scrollPositionRef.current;
      animationIdRef.current = requestAnimationFrame(scroll);
    };

    animationIdRef.current = requestAnimationFrame(scroll);

    return () => {
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
    };
  }, []);

  return (
    <div className="relative w-full overflow-hidden">
      {/* Scrolling container */}
      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-hidden py-2"
        style={{ scrollBehavior: "auto" }}
      >
        {duplicatedFormations.map((formation, index) => (
          <MiniFormationCard
            key={`${formation.id}-${index}`}
            formation={formation}
          />
        ))}
      </div>
    </div>
  );
}
