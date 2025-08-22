"use client";

import CategoryCard from "@/components/UI/CategoryCard";
import { CategoryWithCount } from "@/types/category";
import { useRef } from "react";

interface FormationCategoryProps {
  categories: CategoryWithCount[];
}

export default function FormationCategory({
  categories,
}: FormationCategoryProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  if (!categories || categories.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-grayBlue">Aucune categorie disponible</p>
      </div>
    );
  }

  const scrollLeft = () => {
    if (scrollRef.current) {
      const cardWidth = 300 + 24; // width of card + gap
      scrollRef.current.scrollBy({ left: -cardWidth, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      const cardWidth = 300 + 24; // width of card + gap
      scrollRef.current.scrollBy({ left: cardWidth, behavior: "smooth" });
    }
  };

  return (
    <div className="">
      <div className="flex flex-col gap-10">
        {/* Container scrollable */}
        <div
          ref={scrollRef}
          className="flex gap-6 overflow-x-auto scrollbar-hide scroll-smooth"
          style={{
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
        >
          {categories.map((category) => (
            <div key={category.id} className="py-4 flex-shrink-0">
              <CategoryCard
                picto={category.picto || "/formation/picto/person.svg"}
                titre={category.name}
                nombreFormations={category.trainingCount}
              />
            </div>
          ))}
        </div>

        <div className=" space-x-6 w-fit ml-auto mr-10 md:mr-[120px]">
          <button
            onClick={scrollLeft}
            className="cursor-pointer z-10 bg-white/90 hover:bg-white border border-gray-200 rounded-full p-3 shadow-lg transition-all duration-200 hover:scale-105"
            aria-label="Defiler vers la gauche"
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

          {/* Bouton droit */}
          <button
            onClick={scrollRight}
            className="cursor-pointer z-10 bg-white/90 hover:bg-white border border-gray-200 rounded-full p-3 shadow-lg transition-all duration-200 hover:scale-105"
            aria-label="Defiler vers la droite"
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
  );
}
