"use client";

import { FileText, ClipboardList, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type DocumentKind = "CONVENTION" | "EMARGEMENT" | null;

interface DocumentTypeStepProps {
  selectedKind: DocumentKind;
  onKindChange: (kind: DocumentKind) => void;
  onNext: () => void;
}

const documentTypes = [
  {
    kind: "CONVENTION" as const,
    title: "Convention de formation",
    description: "Document contractuel entre l'organisme de formation et le client.",
    icon: FileText,
    features: [
      "Informations entreprise et formation",
      "Conditions generales",
      "Modalites de paiement",
    ],
  },
  {
    kind: "EMARGEMENT" as const,
    title: "Feuille d'emargement",
    description: "Document de presence pour les sessions de formation.",
    icon: ClipboardList,
    features: [
      "Liste des participants",
      "Signature par demi-journee",
      "Attestation de presence",
    ],
  },
];

export function DocumentTypeStep({
  selectedKind,
  onKindChange,
  onNext,
}: DocumentTypeStepProps) {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-xl font-semibold">Choisissez le type de document</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Selectionnez le type de document que vous souhaitez generer.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {documentTypes.map((type) => {
          const Icon = type.icon;
          const isSelected = selectedKind === type.kind;

          return (
            <button
              key={type.kind}
              type="button"
              onClick={() => onKindChange(type.kind)}
              className={cn(
                "flex flex-col items-start p-6 rounded-lg border-2 text-left transition-all",
                isSelected
                  ? "border-primary bg-primary/5"
                  : "border-border hover:border-primary/50 hover:bg-muted/50"
              )}
            >
              <div
                className={cn(
                  "flex h-12 w-12 items-center justify-center rounded-lg",
                  isSelected ? "bg-primary text-primary-foreground" : "bg-muted"
                )}
              >
                <Icon className="h-6 w-6" />
              </div>
              <h3 className="mt-4 font-semibold">{type.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{type.description}</p>
              <ul className="mt-4 space-y-1">
                {type.features.map((feature, index) => (
                  <li key={index} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                    {feature}
                  </li>
                ))}
              </ul>
            </button>
          );
        })}
      </div>

      <div className="flex justify-end">
        <Button onClick={onNext} disabled={!selectedKind}>
          Continuer
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
