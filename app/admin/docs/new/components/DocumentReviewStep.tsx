/**
 * Component: Document Review Step (Step 3)
 */
"use client";

import { Alert, AlertDescription } from "@/components/UI/alert";
import Button from "@/components/UI/Button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/UI/card";
import { AlertCircle, Loader2 } from "lucide-react";
import type {
  ConventionFormData,
  DocumentKind,
  EmargementFormData,
} from "./types";

interface ReviewSectionProps {
  title: string;
  children: React.ReactNode;
}

interface DocumentReviewStepProps {
  kind: DocumentKind | null;
  conventionData: ConventionFormData | null;
  emargementData: EmargementFormData | null;
  isGenerating: boolean;
  generationError: string | null;
  onPrevious: () => void;
  onGenerate: () => void;
}

export function DocumentReviewStep({
  kind,
  conventionData,
  emargementData,
  isGenerating,
  generationError,
  onPrevious,
  onGenerate,
}: DocumentReviewStepProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Récapitulatif</CardTitle>
        <CardDescription>
          Vérifiez les informations avant de générer
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {kind === "CONVENTION" && conventionData && (
          <ConventionReview data={conventionData} />
        )}

        {kind === "EMARGEMENT" && emargementData && (
          <EmargementReview data={emargementData} />
        )}

        {generationError && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{generationError}</AlertDescription>
          </Alert>
        )}

        <div className="flex justify-between pt-4">
          <Button
            variant="outline"
            onClick={onPrevious}
            disabled={isGenerating}
          >
            Retour
          </Button>

          <Button onClick={onGenerate} disabled={isGenerating}>
            {isGenerating ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Génération en cours...
              </>
            ) : (
              "Générer"
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

const ReviewSection = ({ title, children }: ReviewSectionProps) => (
  <div>
    <h3 className="font-semibold mb-2">{title}</h3>
    {children}
  </div>
);

function ConventionReview({ data }: { data: ConventionFormData }) {
  return (
    <div className="space-y-4">
      {data.societe && (
        <ReviewSection title="Société">
          <p className="text-sm">
            {data.societe.nom} - SIRET: {data.societe.siret}
          </p>
          <p className="text-sm text-muted-foreground">{data.societe.adresse}</p>
        </ReviewSection>
      )}

      {data.formation && (
        <ReviewSection title="Formation">
          <p className="text-sm">{data.formation.nom}</p>
          <p className="text-sm text-muted-foreground">
            {data.formation.dureeHeures}h - {data.formation.lieu}
          </p>
        </ReviewSection>
      )}

      {data.datesEtHoraires && (
        <ReviewSection title="Dates">
          <p className="text-sm">{data.datesEtHoraires.length} session(s)</p>
        </ReviewSection>
      )}

      {data.effectif && (
        <ReviewSection title="Effectif">
          <p className="text-sm">{data.effectif.length} stagiaire(s)</p>
        </ReviewSection>
      )}

      {data.tarifJournalierEUR !== undefined && (
        <ReviewSection title="Tarif">
          <p className="text-sm">{data.tarifJournalierEUR}€ HT/jour</p>
        </ReviewSection>
      )}
    </div>
  );
}

function EmargementReview({ data }: { data: EmargementFormData }) {
  return (
    <div className="space-y-4">
      {data.formationNom && (
        <ReviewSection title="Formation">
          <p className="text-sm">{data.formationNom}</p>
        </ReviewSection>
      )}

      {data.organismeNom && (
        <ReviewSection title="Organisme">
          <p className="text-sm">{data.organismeNom}</p>
        </ReviewSection>
      )}

      {data.formateur && (
        <ReviewSection title="Formateur">
          <p className="text-sm">
            {data.formateur.prenom} {data.formateur.nom}
          </p>
        </ReviewSection>
      )}

      {data.sessions && (
        <ReviewSection title="Sessions">
          <p className="text-sm">{data.sessions.length} session(s)</p>
          <p className="text-sm text-muted-foreground">
            {data.sessions.length} PDF(s) seront générés
          </p>
        </ReviewSection>
      )}
    </div>
  );
}
