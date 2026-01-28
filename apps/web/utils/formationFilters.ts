import { FormationCardData } from "@/types/formation";
import { FilterState } from "@/components/UI/FormationFilters";

/**
 * Filtre les formations selon les critères spécifiés
 * @param formations - Liste des formations à filtrer
 * @param filters - Critères de filtrage
 * @returns Liste des formations filtrées
 */
export function filterFormations(
  formations: FormationCardData[],
  filters: FilterState
): FormationCardData[] {
  return formations.filter((formation) => {
    // Filtre par recherche textuelle (insensible à la casse)
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      const title = formation.title.toLowerCase();
      const description = formation.shortDescription?.toLowerCase() || "";
      if (!title.includes(searchTerm) && !description.includes(searchTerm)) {
        return false;
      }
    }

    // Filtre par durée
    if (filters.duration) {
      const formationDurationDays = formation.duration
        ? Math.ceil(formation.duration / 7) // Convertir heures en jours (7h = 1 jour)
        : 0;

      switch (filters.duration) {
        case "1":
          if (formationDurationDays !== 1) return false;
          break;
        case "2":
          if (formationDurationDays !== 2) return false;
          break;
        case "3":
          if (formationDurationDays !== 3) return false;
          break;
        case "3+":
          if (formationDurationDays < 3) return false;
          break;
        default:
          break;
      }
    }

    return true;
  });
}

/**
 * Compte les formations par critère de filtre
 * @param formations - Liste des formations
 * @returns Objet avec les comptages par critère
 */
export function getFilterCounts(formations: FormationCardData[]) {
  const counts = {
    duration: {
      "1": 0,
      "2": 0,
      "3": 0,
      "3+": 0,
    },
  };

  formations.forEach((formation) => {
    // Compter par durée
    const durationDays = formation.duration
      ? Math.ceil(formation.duration / 7)
      : 0;

    if (durationDays === 1) counts.duration["1"]++;
    else if (durationDays === 2) counts.duration["2"]++;
    else if (durationDays === 3) counts.duration["3"]++;
    else if (durationDays > 3) counts.duration["3+"]++;
  });

  return counts;
}
