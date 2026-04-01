"use client";

import Button from "@/components/UI/Button";
import Dropdown from "@/components/UI/Dropdown";
import FormationCard from "@/components/UI/FormationCard";
import SearchInput from "@/components/UI/SearchInput";
import { useFilterSync } from "@/hooks/useFilterSync";
import { X } from "lucide-react";
import { FormationCardData } from "@/types/formation";
import { durationOptions } from "@/utils/filterConstants";
import { filterFormations } from "@/utils/formationFilters";
import { useMemo, useState } from "react";

interface AllFormationsClientProps {
  formations: FormationCardData[];
}

const FORMATIONS_PER_PAGE = 12;

export default function AllFormationsClient({
  formations,
}: AllFormationsClientProps) {
  const { filters, updateFilters, resetFilters } = useFilterSync();
  const [currentPage, setCurrentPage] = useState(1);

  // Filtrer les formations selon les critères
  const filteredFormations = useMemo(() => {
    return filterFormations(formations, filters);
  }, [formations, filters]);

  // Pagination des formations filtrées
  const totalPages = Math.ceil(filteredFormations.length / FORMATIONS_PER_PAGE);
  const startIndex = (currentPage - 1) * FORMATIONS_PER_PAGE;
  const endIndex = startIndex + FORMATIONS_PER_PAGE;
  const currentFormations = filteredFormations.slice(startIndex, endIndex);

  // Réinitialiser la page quand les filtres changent
  const handleSearchChange = (value: string) => {
    setCurrentPage(1);
    updateFilters({ ...filters, search: value });
  };

  const handleDurationChange = (value: string) => {
    setCurrentPage(1);
    updateFilters({ ...filters, duration: value });
  };

  const hasActiveFilters = filters.search || filters.duration;

  // Navigation pagination
  const goToPage = (page: number) => {
    setCurrentPage(page);

    // Scroll vers le début de la section filtres
    setTimeout(() => {
      const filtersSection = document.querySelector(
        'section[data-section="formations-filters"]'
      );
      if (filtersSection) {
        const yOffset = -100;
        const rect = filtersSection.getBoundingClientRect();
        const y = rect.top + window.scrollY + yOffset;

        window.scrollTo({
          top: y,
          behavior: "smooth",
        });
      }
    }, 50);
  };

  // Générer les numéros de page à afficher
  const getVisiblePages = () => {
    const visiblePages = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        visiblePages.push(i);
      }
    } else {
      let startPage = Math.max(1, currentPage - 2);
      const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

      if (endPage - startPage < maxVisiblePages - 1) {
        startPage = Math.max(1, endPage - maxVisiblePages + 1);
      }

      for (let i = startPage; i <= endPage; i++) {
        visiblePages.push(i);
      }
    }

    return visiblePages;
  };

  return (
    <>
      {/* Section filtres */}
      <section
        data-section="formations-filters"
        className="px-5 lg:px-[120px] mb-8"
      >
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-end">
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
            <button
              onClick={resetFilters}
              className="py-2 px-4 rounded-full border border-red-300 text-red-600 hover:bg-red-50 font-satoshi font-semibold text-sm transition-colors cursor-pointer inline-flex items-center gap-2"
            >
              <X className="w-4 h-4" />
              Effacer
            </button>
          )}
        </div>
      </section>

      {/* Liste des formations filtrées */}
      <section
        id="formations-list"
        className="pb-[160px] px-5 lg:px-[120px] pt-[40px]"
      >
        <div className="max-w-7xl mx-auto">
          {filteredFormations.length > 0 ? (
            <div className="flex flex-col gap-8">
              {/* Informations sur les résultats */}
              {filteredFormations.length !== formations.length && (
                <div className="flex justify-between items-center">
                  <p className="text-grayBlue font-satoshi">
                    {filteredFormations.length} résultat
                    {filteredFormations.length > 1 ? "s" : ""} sur{" "}
                    {formations.length}
                  </p>

                  {totalPages > 1 && (
                    <p className="text-grayBlue text-sm font-satoshi">
                      Page {currentPage} sur {totalPages}
                    </p>
                  )}
                </div>
              )}

              {/* Grille des formations */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {currentFormations.map((formation) => (
                  <FormationCard key={formation.id} formation={formation} />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-2 mt-8">
                  {/* Bouton précédent */}
                  <button
                    onClick={() => goToPage(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-4 cursor-pointer py-2 rounded-xl border border-grayBlue/30 text-grayBlue hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-satoshi"
                  >
                    Précédent
                  </button>

                  {/* Numéros de page */}
                  <div className="flex gap-1">
                    {getVisiblePages().map((page) => (
                      <button
                        key={page}
                        onClick={() => goToPage(page)}
                        className={`w-10 cursor-pointer h-10 rounded-xl font-satoshi font-medium transition-colors ${
                          page === currentPage
                            ? "bg-primary text-white"
                            : "border border-grayBlue/30 text-grayBlue hover:bg-gray-50"
                        }`}
                      >
                        {page}
                      </button>
                    ))}
                  </div>

                  {/* Bouton suivant */}
                  <button
                    onClick={() => goToPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="px-4 cursor-pointer py-2 rounded-xl border border-grayBlue/30 text-grayBlue hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-satoshi"
                  >
                    Suivant
                  </button>
                </div>
              )}
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
                <h3 className="text-2xl font-sora font-bold text-darkBlue mb-4">
                  {formations.length === 0
                    ? "Aucune formation disponible"
                    : "Aucun résultat trouvé"}
                </h3>
                <p className="text-grayBlue mb-8 max-w-md mx-auto font-satoshi">
                  {formations.length === 0
                    ? "Il n'y a actuellement aucune formation disponible."
                    : "Aucune formation ne correspond à vos critères de recherche. Essayez de modifier vos filtres."}
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  {formations.length === 0 ? (
                    <Button href="/devis-&-contact" variant="primary">
                      Nous contacter
                    </Button>
                  ) : (
                    <>
                      <Button onClick={resetFilters} variant="secondary">
                        Réinitialiser les filtres
                      </Button>
                      <Button href="/devis-&-contact" variant="primary">
                        Nous contacter
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
