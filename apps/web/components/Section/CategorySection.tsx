import { CategoriesService } from "@/services/categories.service";
import CategoryCard from "../UI/CategoryCard";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default async function CategorySection() {
  const categories = await CategoriesService.getCategoriesWithTrainingCount();

  if (!categories || categories.length === 0) {
    return null;
  }

  // Toutes les catégories (7)
  const displayCategories = categories;

  return (
    <section className="py-[90px] px-10 md:px-[120px]">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Première colonne - Titre + 1 card */}
        <div className="flex flex-col gap-4">
          {/* Bloc titre */}
          <div className="flex flex-col gap-4 p-6 rounded-3xl bg-gray-100 h-52">
            <h2 className="text-2xl text-darkBlue font-sora font-bold">
              Les catégories de{" "}
              <span className="text-darkBlue/60 italic">formations</span>
            </h2>
            <p className="text-sm text-grayBlue">
              Explorez les différentes catégories que nous proposons
            </p>
          </div>
          {displayCategories[0] && (
            <CategoryCard
              titre={displayCategories[0].name}
              nombreFormations={displayCategories[0].trainingCount}
              slug={displayCategories[0].slug}
              imageUrl={displayCategories[0].imageUrl}
              size="medium"
            />
          )}
        </div>

        {/* Deuxième colonne - 2 cards empilées */}
        <div className="flex flex-col gap-4">
          {displayCategories[1] && (
            <CategoryCard
              titre={displayCategories[1].name}
              nombreFormations={displayCategories[1].trainingCount}
              slug={displayCategories[1].slug}
              imageUrl={displayCategories[1].imageUrl}
              size="medium"
            />
          )}
          {displayCategories[2] && (
            <CategoryCard
              titre={displayCategories[2].name}
              nombreFormations={displayCategories[2].trainingCount}
              slug={displayCategories[2].slug}
              imageUrl={displayCategories[2].imageUrl}
              size="medium"
            />
          )}
        </div>

        {/* Troisième colonne - 2 cards empilées */}
        <div className="flex flex-col gap-4">
          {displayCategories[3] && (
            <CategoryCard
              titre={displayCategories[3].name}
              nombreFormations={displayCategories[3].trainingCount}
              slug={displayCategories[3].slug}
              imageUrl={displayCategories[3].imageUrl}
              size="medium"
            />
          )}
          {displayCategories[4] && (
            <CategoryCard
              titre={displayCategories[4].name}
              nombreFormations={displayCategories[4].trainingCount}
              slug={displayCategories[4].slug}
              imageUrl={displayCategories[4].imageUrl}
              size="medium"
            />
          )}
        </div>

        {/* Quatrième colonne - 1 card grande + 2 petites cards + CTA */}
        <div className="flex flex-col gap-4">
          {displayCategories[5] && (
            <CategoryCard
              titre={displayCategories[5].name}
              nombreFormations={displayCategories[5].trainingCount}
              slug={displayCategories[5].slug}
              imageUrl={displayCategories[5].imageUrl}
              size="small"
            />
          )}
          {displayCategories[6] && (
            <CategoryCard
              titre={displayCategories[6].name}
              nombreFormations={displayCategories[6].trainingCount}
              slug={displayCategories[6].slug}
              imageUrl={displayCategories[6].imageUrl}
              size="small"
            />
          )}
          <Link
            href="/formations"
            className="flex items-center justify-between p-6 rounded-3xl border border-gray-200 bg-transparent group hover:bg-gray-50 transition-all duration-300"
          >
            <span className="text-darkBlue font-sora font-bold text-lg">
              Voir tout
            </span>
            <div className="bg-gray-100 rounded-full p-2.5 group-hover:scale-110 transition-transform duration-300">
              <ArrowRight className="w-4 h-4 text-darkBlue" />
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
}
