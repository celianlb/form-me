import { CategoriesService } from "@/services/categories.service";
import CategoryCard from "../UI/CategoryCard";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default async function CategorySection() {
  const categories = await CategoriesService.getCategoriesWithTrainingCount();

  if (!categories || categories.length === 0) {
    return null;
  }

  // Max 6 catégories affichées
  const displayCategories = categories.slice(0, 6);
  const count = displayCategories.length;

  // 3 colonnes pour ≤4 catégories, 4 colonnes pour 5-6
  const useThreeCols = count <= 4;
  const cols = useThreeCols ? 3 : 4;
  const totalItems = count + 2; // +titre +CTA
  const remainder = totalItems % cols;
  const ctaSpan = remainder === 0 ? 1 : cols - remainder + 1;

  const ctaSpanClass: Record<number, string> = {
    1: "",
    2: "md:col-span-2",
    3: "md:col-span-3",
  };

  return (
    <section className="py-[90px] px-10 md:px-[120px]">
      <div
        className={`grid grid-cols-1 sm:grid-cols-2 ${
          useThreeCols ? "md:grid-cols-3" : "md:grid-cols-4"
        } gap-4 auto-rows-[240px]`}
      >
        {/* Bloc titre */}
        <div className="flex flex-col justify-center gap-4 p-6 rounded-3xl bg-gray-100">
          <h2 className="text-2xl text-darkBlue font-sora font-bold">
            Les catégories de{" "}
            <span className="text-darkBlue/60 italic">formations</span>
          </h2>
          <p className="text-sm text-grayBlue">
            Explorez les différentes catégories que nous proposons
          </p>
        </div>

        {/* Catégories dynamiques */}
        {displayCategories.map((category) => (
          <CategoryCard
            key={category.id}
            titre={category.name}
            nombreFormations={category.trainingCount}
            slug={category.slug}
            imageUrl={category.imageUrl}
            size="flex"
          />
        ))}

        {/* CTA Voir tout */}
        <Link
          href="/formations"
          className={`flex items-center justify-between p-6 rounded-3xl border border-gray-200 bg-transparent group hover:bg-gray-50 transition-all duration-300 ${ctaSpanClass[ctaSpan] || ""}`}
        >
          <span className="text-darkBlue font-sora font-bold text-lg">
            Voir tout
          </span>
          <div className="bg-gray-100 rounded-full p-2.5 group-hover:scale-110 transition-transform duration-300">
            <ArrowRight className="w-4 h-4 text-darkBlue" />
          </div>
        </Link>
      </div>
    </section>
  );
}
