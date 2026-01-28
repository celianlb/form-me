/**
 * Formation (Training) types
 * Adapted from existing types in the main app
 */

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

export interface TrainingObjective {
  id: number;
  text: string;
}

export interface TrainingModule {
  id: number;
  title: string;
  order: number;
  type?: string | null;
  content?: string | null;
}

export interface FormationWithDetails {
  id: number;
  title: string;
  slug: string;
  shortDescription?: string;
  longDescription?: string;
  imageUrl?: string;
  durationHours?: number;
  durationDays?: number;
  successRate?: number;
  targetAudience?: string;
  trainingObjectives?: TrainingObjective[];
  trainingModules?: TrainingModule[];
  teachingMeans?: string;
  evaluationMethods?: string;
  validationMethods?: string;
  monitoringMethods?: string;
  renewalRecommendation?: string;
  category: {
    name: string;
    slug: string;
  };
}
