"use client";

import Button from "@/components/UI/Button";
import Dropdown from "@/components/UI/Dropdown";
import FormationCard from "@/components/UI/FormationCard";
import SearchInput from "@/components/UI/SearchInput";
import { useFilterSync } from "@/hooks/useFilterSync";
import { Category } from "@/types/category";
import { FormationCardData } from "@/types/formation";
import { durationOptions } from "@/utils/filterConstants";
import { filterFormations } from "@/utils/formationFilters";
import { useMemo } from "react";

interface CategoryPageClientProps {
  category: Category;
  formations: FormationCardData[];
}

export default function CategoryPageClient({
  category,
  formations,
}: CategoryPageClientProps) {
  const { filters, updateFilters, resetFilters } = useFilterSync();

  // Filtrer les formations selon les critères
  const filteredFormations = useMemo(() => {
    return filterFormations(formations, filters);
  }, [formations, filters]);

  const handleSearchChange = (value: string) => {
    updateFilters({ ...filters, search: value });
  };

  const handleDurationChange = (value: string) => {
    updateFilters({ ...filters, duration: value });
  };

  const hasActiveFilters = filters.search || filters.duration;

  return (
    <>
      {/* Header avec titre et filtres */}
      <section className="px-5 lg:px-[120px] mb-8">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
          {/* Titre et description */}
          <div>
            <h1 className="text-3xl md:text-4xl font-satoshi font-bold text-darkBlue">
              {category.name}
            </h1>
            {category.description && (
              <p className="text-grayBlue mt-2 max-w-2xl">{category.description}</p>
            )}
          </div>

          {/* Filtres à droite */}
          <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
            <SearchInput
              value={filters.search}
              onChange={handleSearchChange}
              placeholder="Rechercher..."
            />
            <Dropdown
              options={durationOptions}
              value={filters.duration}
              onChange={handleDurationChange}
              placeholder="Durée"
              className="w-full sm:w-auto"
            />
            {hasActiveFilters && (
              <Button
                onClick={resetFilters}
                variant="secondary"
                className="text-red-600 border-red-600 hover:bg-red-50"
              >
                X
              </Button>
            )}
          </div>
        </div>
      </section>

      {/* Liste des formations filtrées */}
      <section className="pb-[160px] px-10 lg:px-[120px] pt-[40px]">
        <div className="max-w-7xl mx-auto">
          {filteredFormations.length > 0 ? (
            <div className="flex flex-col gap-6 md:gap-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mx-auto">
                {filteredFormations.map((formation) => (
                  <FormationCard key={formation.id} formation={formation} />
                ))}
              </div>

              <div className="flex justify-between items-center">
                <p className="text-grayBlue">
                  {filteredFormations.length} formation
                  {filteredFormations.length > 1 ? "s" : ""}
                  {filteredFormations.length !== formations.length &&
                    ` sur ${formations.length} au total`}
                </p>
              </div>
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="mb-8">
                <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-grayBlue/10 flex items-center justify-center">
                  <svg
                    className="w-12 h-12 text-grayBlue/50"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-2xl font-satoshi font-bold text-blackBlue mb-4">
                  {formations.length === 0
                    ? "Aucune formation disponible"
                    : "Aucun résultat trouvé"}
                </h3>
                <p className="text-grayBlue mb-8 max-w-md mx-auto">
                  {formations.length === 0
                    ? `Il n'y a actuellement aucune formation disponible dans la catégorie "${category.name}".`
                    : "Aucune formation ne correspond à vos critères de recherche. Essayez de modifier vos filtres."}
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  {formations.length === 0 ? (
                    <>
                      <Button href="/formations" variant="secondary">
                        Voir toutes les formations
                      </Button>
                      <Button href="/devis-&-contact" variant="primary">
                        Nous contacter
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button onClick={resetFilters} variant="secondary">
                        Réinitialiser les filtres
                      </Button>
                      <Button href="/formations" variant="primary">
                        Voir toutes nos formations
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
