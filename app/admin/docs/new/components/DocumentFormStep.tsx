/**
 * Component: Document Form Step (Step 2)
 */
"use client";

import { ConventionForm } from "@/components/docs/ConventionForm";
import { EmargementForm } from "@/components/docs/EmargementForm";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/UI/card";
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

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>Remplissez les informations requises</CardDescription>
      </CardHeader>
      <CardContent>
        {kind === "CONVENTION" ? <ConventionForm /> : <EmargementForm />}

        <div className="mt-6">
          <StepNavigation onPrevious={onPrevious} showNext={false} />
        </div>
      </CardContent>
    </Card>
  );
}
