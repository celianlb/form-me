import { FilterState } from "@/components/UI/FormationFilters";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

export function useFilterSync() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // État local des filtres
  const [filters, setFilters] = useState<FilterState>({
    search: "",
    duration: "",
    location: "",
  });

  // Synchroniser les filtres avec l'URL au chargement
  useEffect(() => {
    const urlFilters: FilterState = {
      search: searchParams.get("search") || "",
      duration: searchParams.get("duration") || "",
      location: searchParams.get("location") || "",
    };

    setFilters(urlFilters);
  }, [searchParams]);

  // Mettre à jour les filtres et l'URL
  const updateFilters = useCallback(
    (newFilters: FilterState) => {
      setFilters(newFilters);

      // Mettre à jour l'URL avec les nouveaux filtres
      const params = new URLSearchParams(searchParams.toString());

      if (newFilters.search) {
        params.set("search", newFilters.search);
      } else {
        params.delete("search");
      }

      if (newFilters.duration) {
        params.set("duration", newFilters.duration);
      } else {
        params.delete("duration");
      }

      if (newFilters.location) {
        params.set("location", newFilters.location);
      } else {
        params.delete("location");
      }

      const queryString = params.toString();
      const newUrl = `${window.location.pathname}${
        queryString ? `?${queryString}` : ""
      }`;

      // Mettre à jour l'URL sans recharger la page
      router.replace(newUrl, { scroll: false });
    },
    [searchParams, router]
  );

  // Réinitialiser les filtres
  const resetFilters = useCallback(() => {
    const resetFilters = { search: "", duration: "", location: "" };
    setFilters(resetFilters);

    // Nettoyer l'URL
    router.replace(window.location.pathname, { scroll: false });
  }, [router]);

  // Vérifier s'il y a des filtres actifs
  const hasActiveFilters =
    filters.search || filters.duration || filters.location;

  return {
    filters,
    updateFilters,
    resetFilters,
    hasActiveFilters,
  };
}
