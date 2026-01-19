/**
 * Component: Document Form Step (Step 2)
 * Design modernisé avec la DA Form Me
 */
"use client";

import { ConventionForm } from "@/components/docs/ConventionForm";
import { EmargementForm } from "@/components/docs/EmargementForm";
import { StepNavigation } from "./StepNavigation";
import type { DocumentKind } from "./types";

interface DocumentFormStepProps {
  kind: DocumentKind | null;
  onPrevious: () => void;
}

export function DocumentFormStep({ kind, onPrevious }: DocumentFormStepProps) {
  const title =
    kind === "CONVENTION"
      ? "Convention de formation"
      : "Feuilles d'émargement";

  const description =
    kind === "CONVENTION"
      ? "Remplissez les informations de la société, formation, dates et effectif"
      : "Remplissez les informations du formateur, sessions et stagiaires";

  return (
    <div className="bg-white rounded-3xl border border-grayBlue/20 p-8 shadow-[0_0_20px_rgba(75,89,119,0.1)]">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-2xl md:text-3xl font-sora font-bold text-darkBlue mb-3">
          {title}
        </h2>
        <p className="text-grayBlue font-satoshi">{description}</p>
      </div>

      {/* Form */}
      <div className="space-y-6">
        {kind === "CONVENTION" ? <ConventionForm /> : <EmargementForm />}
      </div>

      {/* Navigation */}
      <div className="mt-8 pt-6 border-t border-platinium">
        <StepNavigation onPrevious={onPrevious} showNext={false} />
      </div>
    </div>
  );
}
