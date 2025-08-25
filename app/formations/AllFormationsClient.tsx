"use client";

import Button from "@/components/UI/Button";
import FormationCard from "@/components/UI/FormationCard";
import FormationFilters, { FilterState } from "@/components/UI/FormationFilters";
import { useFilterSync } from "@/hooks/useFilterSync";
import { FormationCardData } from "@/types/formation";
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
  const handleFilterChange = (newFilters: FilterState) => {
    setCurrentPage(1);
    updateFilters(newFilters);
  };

  // Navigation pagination
  const goToPage = (page: number) => {
    setCurrentPage(page);
    
    // Scroll vers le début du titre de la section formations avec un petit offset
    setTimeout(() => {
      const formationsTitle = document.querySelector('section[data-section="formations-title"]');
      if (formationsTitle) {
        const yOffset = -100; // Offset pour éviter que le header fixe cache le titre
        const rect = formationsTitle.getBoundingClientRect();
        const y = rect.top + window.scrollY + yOffset;
        
        window.scrollTo({
          top: y,
          behavior: 'smooth'
        });
      }
    }, 50); // Petit délai pour s'assurer que le changement de page est appliqué
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
      {/* Système de filtrage */}
      <section className="px-5 lg:px-[120px] py-[80px] relative z-10">
        <div className="max-w-7xl mx-auto">
          <FormationFilters
            onFilter={handleFilterChange}
            initialFilters={filters}
          />
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
              <div className="flex justify-between items-center">
                <p className="text-grayBlue">
                  {filteredFormations.length} formation
                  {filteredFormations.length > 1 ? "s" : ""}
                  {filteredFormations.length !== formations.length &&
                    ` sur ${formations.length} au total`}
                </p>

                {totalPages > 1 && (
                  <p className="text-grayBlue text-sm">
                    Page {currentPage} sur {totalPages}
                  </p>
                )}
              </div>

              {/* Grille des formations */}
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
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
                <h3 className="text-2xl font-satoshi font-bold text-blackBlue mb-4">
                  {formations.length === 0
                    ? "Aucune formation disponible"
                    : "Aucun résultat trouvé"}
                </h3>
                <p className="text-grayBlue mb-8 max-w-md mx-auto">
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
