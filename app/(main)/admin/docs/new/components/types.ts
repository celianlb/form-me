/**
 * Types for document generation stepper
 * Re-exports types from validation schemas and store
 */

import type { ConventionInputType, EmargementInputType } from "@/lib/validations/docs";

export type DocumentKind = "CONVENTION" | "EMARGEMENT";

export interface Step {
  label: string;
  description: string;
}

// Use the actual types from validation schemas
export type ConventionFormData = Partial<ConventionInputType>;
export type EmargementFormData = Partial<EmargementInputType>;

export interface ConventionResult {
  documentId: string;
  pdfUrl: string;
}

export interface EmargementResult {
  batchId: string;
  documents: Array<{
    documentId: string;
    label: string;
    pdfUrl: string;
  }>;
}
