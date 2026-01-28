import CategoryCard from "@/components/UI/CategoryCard";
import { CategoryWithCount } from "@/types/category";

interface FormationCategoryProps {
  categories: CategoryWithCount[];
}

export default function FormationCategory({
  categories,
}: FormationCategoryProps) {
  if (!categories || categories.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-grayBlue">Aucune categorie disponible</p>
      </div>
    );
  }

  // On prend les 5 premières catégories pour le bento
  const displayCategories = categories.slice(0, 5);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mr-10 md:mr-[120px]">
      {/* Première colonne - 2 cards empilées */}
      <div className="flex flex-col gap-4">
        {displayCategories[0] && (
          <CategoryCard
            titre={displayCategories[0].name}
            nombreFormations={displayCategories[0].trainingCount}
            slug={displayCategories[0].slug}
            imageUrl={displayCategories[0].imageUrl}
            size="medium"
          />
        )}
        {displayCategories[1] && (
          <CategoryCard
            titre={displayCategories[1].name}
            nombreFormations={displayCategories[1].trainingCount}
            slug={displayCategories[1].slug}
            imageUrl={displayCategories[1].imageUrl}
            size="medium"
          />
        )}
      </div>

      {/* Deuxième colonne - 1 grande card */}
      <div className="flex flex-col gap-4">
        {displayCategories[2] && (
          <CategoryCard
            titre={displayCategories[2].name}
            nombreFormations={displayCategories[2].trainingCount}
            slug={displayCategories[2].slug}
            imageUrl={displayCategories[2].imageUrl}
            size="large"
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
    </div>
  );
}
