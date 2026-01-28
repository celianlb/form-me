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