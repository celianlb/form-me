/**
 * Zustand store pour le Stepper de génération de documents
 */
import { create } from 'zustand';
import type { ConventionInputType, EmargementInputType } from '@/lib/validations/docs';

export type DocumentKind = 'CONVENTION' | 'EMARGEMENT';

export type StepperStep = 1 | 2 | 3 | 4;

interface DocumentStoreState {
  // Step actuel
  currentStep: StepperStep;

  // Type de document choisi (Step 1)
  kind: DocumentKind | null;

  // Données du formulaire (Step 2)
  conventionData: Partial<ConventionInputType> | null;
  emargementData: Partial<EmargementInputType> | null;

  // Résultats (Step 4)
  conventionResult: { documentId: string; pdfUrl: string } | null;
  emargementResult: {
    batchId: string;
    documents: Array<{ documentId: string; pdfUrl: string; label: string }>;
  } | null;

  // Loading states
  isGenerating: boolean;
  generationError: string | null;

  // Actions
  setStep: (step: StepperStep) => void;
  setKind: (kind: DocumentKind) => void;
  setConventionData: (data: Partial<ConventionInputType>) => void;
  setEmargementData: (data: Partial<EmargementInputType>) => void;
  setConventionResult: (result: { documentId: string; pdfUrl: string }) => void;
  setEmargementResult: (result: {
    batchId: string;
    documents: Array<{ documentId: string; pdfUrl: string; label: string }>;
  }) => void;
  setIsGenerating: (loading: boolean) => void;
  setGenerationError: (error: string | null) => void;
  reset: () => void;
  goToNextStep: () => void;
  goToPreviousStep: () => void;
}

const initialState = {
  currentStep: 1 as StepperStep,
  kind: null,
  conventionData: null,
  emargementData: null,
  conventionResult: null,
  emargementResult: null,
  isGenerating: false,
  generationError: null,
};

export const useDocumentStore = create<DocumentStoreState>((set, get) => ({
  ...initialState,

  setStep: (step) => set({ currentStep: step }),

  setKind: (kind) => set({ kind }),

  setConventionData: (data) =>
    set((state) => ({
      conventionData: { ...state.conventionData, ...data },
    })),

  setEmargementData: (data) =>
    set((state) => ({
      emargementData: { ...state.emargementData, ...data },
    })),

  setConventionResult: (result) => set({ conventionResult: result }),

  setEmargementResult: (result) => set({ emargementResult: result }),

  setIsGenerating: (loading) => set({ isGenerating: loading }),

  setGenerationError: (error) => set({ generationError: error }),

  reset: () => set(initialState),

  goToNextStep: () => {
    const { currentStep } = get();
    if (currentStep < 4) {
      set({ currentStep: (currentStep + 1) as StepperStep });
    }
  },

  goToPreviousStep: () => {
    const { currentStep } = get();
    if (currentStep > 1) {
      set({ currentStep: (currentStep - 1) as StepperStep });
    }
  },
}));
