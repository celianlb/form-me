/**
 * Component: Document Review Step (Step 3)
 * Design modernisé avec la DA Form Me
 */
"use client";

import { Alert, AlertDescription } from "@/components/UI/alert";
import Button from "@/components/UI/Button";
import { AlertCircle, Loader2, CheckCircle2 } from "lucide-react";
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
    <div className="bg-white rounded-3xl border border-grayBlue/20 p-8 shadow-[0_0_20px_rgba(75,89,119,0.1)]">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-2xl md:text-3xl font-sora font-bold text-darkBlue mb-3">
          Récapitulatif
        </h2>
        <p className="text-grayBlue font-satoshi">
          Vérifiez les informations avant de générer le document
        </p>
      </div>

      {/* Review Content */}
      <div className="space-y-6 mb-8">
        {kind === "CONVENTION" && conventionData && (
          <ConventionReview data={conventionData} />
        )}

        {kind === "EMARGEMENT" && emargementData && (
          <EmargementReview data={emargementData} />
        )}
      </div>

      {/* Error Alert */}
      {generationError && (
        <Alert variant="destructive" className="mb-8">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="font-satoshi">{generationError}</AlertDescription>
        </Alert>
      )}

      {/* Navigation */}
      <div className="flex justify-between pt-6 border-t border-platinium">
        <Button
          variant="secondary"
          onClick={onPrevious}
          disabled={isGenerating}
        >
          Retour
        </Button>

        <Button onClick={onGenerate} disabled={isGenerating} className="min-w-[180px]">
          {isGenerating ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Génération en cours...
            </>
          ) : (
            <>
              <CheckCircle2 className="w-4 h-4 mr-2" />
              Générer le document
            </>
          )}
        </Button>
      </div>
    </div>
  );
}

const ReviewSection = ({ title, children }: ReviewSectionProps) => (
  <div className="bg-gradient-to-br from-platinium/20 to-white rounded-2xl p-6 border border-grayBlue/10">
    <h3 className="font-sora font-bold text-darkBlue mb-3 text-lg">{title}</h3>
    <div className="space-y-2">{children}</div>
  </div>
);

function ConventionReview({ data }: { data: ConventionFormData }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {data.societe && (
        <ReviewSection title="Société">
          <p className="text-sm font-satoshi font-medium text-blackBlue">
            {data.societe.nom}
          </p>
          <p className="text-sm font-satoshi text-grayBlue">
            SIRET: {data.societe.siret}
          </p>
          <p className="text-sm font-satoshi text-grayBlue">{data.societe.adresse}</p>
        </ReviewSection>
      )}

      {data.formation && (
        <ReviewSection title="Formation">
          <p className="text-sm font-satoshi font-medium text-blackBlue">{data.formation.nom}</p>
          <p className="text-sm font-satoshi text-grayBlue">
            Durée: {data.formation.dureeHeures}h
          </p>
          <p className="text-sm font-satoshi text-grayBlue">
            Lieu: {data.formation.lieu}
          </p>
        </ReviewSection>
      )}

      {data.datesEtHoraires && (
        <ReviewSection title="Dates et horaires">
          <p className="text-sm font-satoshi font-medium text-primary">
            {data.datesEtHoraires.length} session(s) programmée(s)
          </p>
        </ReviewSection>
      )}

      {data.effectif && (
        <ReviewSection title="Effectif">
          <p className="text-sm font-satoshi font-medium text-primary">
            {data.effectif.length} stagiaire(s)
          </p>
        </ReviewSection>
      )}

      {data.tarifJournalierEUR !== undefined && (
        <ReviewSection title="Tarif journalier">
          <p className="text-base font-satoshi font-bold text-primary">
            {data.tarifJournalierEUR}€ HT/jour
          </p>
        </ReviewSection>
      )}
    </div>
  );
}

function EmargementReview({ data }: { data: EmargementFormData }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {data.formationNom && (
        <ReviewSection title="Formation">
          <p className="text-sm font-satoshi font-medium text-blackBlue">{data.formationNom}</p>
        </ReviewSection>
      )}

      {data.organismeNom && (
        <ReviewSection title="Organisme">
          <p className="text-sm font-satoshi font-medium text-blackBlue">{data.organismeNom}</p>
        </ReviewSection>
      )}

      {data.entrepriseNom && (
        <ReviewSection title="Entreprise cliente">
          <p className="text-sm font-satoshi font-medium text-blackBlue">{data.entrepriseNom}</p>
          <p className="text-xs text-grayBlue font-satoshi">
            Affiché en haut à droite du PDF
          </p>
        </ReviewSection>
      )}

      {data.formateur && (
        <ReviewSection title="Formateur">
          <p className="text-sm font-satoshi font-medium text-blackBlue">
            {data.formateur.prenom} {data.formateur.nom}
          </p>
        </ReviewSection>
      )}

      {data.sessions && (
        <ReviewSection title="Sessions">
          <p className="text-sm font-satoshi font-medium text-primary">
            {data.sessions.length} session(s)
          </p>
          <p className="text-sm font-satoshi text-grayBlue">
            {data.sessions.length} PDF(s) seront générés
          </p>
        </ReviewSection>
      )}

      {data.stagiaires && (
        <ReviewSection title="Stagiaires">
          <p className="text-sm font-satoshi font-medium text-primary">
            {data.stagiaires.length} stagiaire(s)
          </p>
          <div className="mt-2 space-y-1">
            {data.stagiaires.map((stagiaire, idx) => (
              <p key={idx} className="text-xs font-satoshi text-grayBlue">
                {stagiaire.prenom} {stagiaire.nom}
              </p>
            ))}
          </div>
        </ReviewSection>
      )}
    </div>
  );
}
