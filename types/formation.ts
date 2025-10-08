export interface Formation {
  id: number;
  title: string;
  slug: string;
  shortDescription?: string;
  durationHours?: number;
  durationDays?: number;
  pricePartnerPerDay?: number;
  priceNonPartnerPerTrainee?: number;
  availableForPartners: boolean;
  applicationType: "STANDARD" | "APPLICATION";
  availableInCenter: boolean;
  availableElearning: boolean;
  minParticipants?: number;
  maxParticipants?: number;
  category: {
    name: string;
    slug: string;
  };
}

export interface FormationCardData {
  id: number;
  title: string;
  slug: string;
  duration?: number; // en heures (calculé depuis durationHours ou durationDays * 7)
  durationDays?: number; // en jours
  location: "center" | "elearning" | "both";
  capacity: {
    min?: number;
    max?: number;
  };
  pricePartnerPerDay?: number; // prix journalier partenaire HT
  priceNonPartnerPerTrainee?: number; // prix par stagiaire non-partenaire HT
  availableForPartners: boolean;
  applicationType: "STANDARD" | "APPLICATION";
  link?: string; // URL vers la page de la formation
}

// Données brutes depuis Prisma
export interface FormationFromDB {
  id: number;
  title: string;
  slug: string;
  durationHours?: number | null;
  durationDays?: number | null;
  minParticipants?: number | null;
  maxParticipants?: number | null;
  availableInCenter: boolean;
  availableElearning: boolean;
  pricePartnerPerDay?: number | null;
  priceNonPartnerPerTrainee?: number | null;
  availableForPartners: boolean;
  applicationType: "STANDARD" | "APPLICATION";
}
