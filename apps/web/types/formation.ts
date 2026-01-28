export interface Formation {
  id: number;
  title: string;
  slug: string;
  shortDescription?: string;
  durationHours?: number;
  durationDays?: number;
  imageUrl?: string;
  category: {
    name: string;
    slug: string;
  };
}

export interface FormationCardData {
  id: number;
  title: string;
  slug: string;
  shortDescription?: string;
  duration?: number; // en heures (calculé depuis durationHours ou durationDays * 7)
  durationDays?: number; // en jours
  imageUrl?: string;
  link?: string; // URL vers la page de la formation
}

// Données brutes depuis Prisma
export interface FormationFromDB {
  id: number;
  title: string;
  slug: string;
  shortDescription?: string | null;
  durationHours?: number | null;
  durationDays?: number | null;
  imageUrl?: string | null;
}
