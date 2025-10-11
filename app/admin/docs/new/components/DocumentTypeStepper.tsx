/**
 * Component: Document Type Selection (Step 1)
 */
"use client";

import Button from "@/components/UI/Button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/UI/card";
import { Label } from "@/components/UI/label";
import { RadioGroup, RadioGroupItem } from "@/components/UI/radio-group";
import { ClipboardList, FileText } from "lucide-react";
import type { DocumentKind } from "./types";

interface DocumentTypeStepperProps {
  selectedKind: DocumentKind | null;
  onKindChange: (kind: DocumentKind) => void;
  onNext: () => void;
}

export function DocumentTypeStepper({
  selectedKind,
  onKindChange,
  onNext,
}: DocumentTypeStepperProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Quel type de document souhaitez-vous générer ?</CardTitle>
        <CardDescription>
          Choisissez entre Convention et Émargement
        </CardDescription>
      </CardHeader>
      <CardContent>
        <RadioGroup
          value={selectedKind || ""}
          onValueChange={(value) => onKindChange(value as DocumentKind)}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Label
              htmlFor="CONVENTION"
              className="flex flex-col items-center justify-center p-6 border-2 rounded-lg cursor-pointer hover:border-primary transition-colors"
            >
              <RadioGroupItem
                value="CONVENTION"
                id="CONVENTION"
                className="sr-only"
              />
              <FileText className="w-12 h-12 mb-4 text-primary" />
              <span className="font-semibold text-lg">Convention</span>
              <span className="text-sm text-muted-foreground text-center mt-2">
                Document unique avec société, formation, dates, effectif,
                tarifs
              </span>
            </Label>

            <Label
              htmlFor="EMARGEMENT"
              className="flex flex-col items-center justify-center p-6 border-2 rounded-lg cursor-pointer hover:border-primary transition-colors"
            >
              <RadioGroupItem
                value="EMARGEMENT"
                id="EMARGEMENT"
                className="sr-only"
              />
              <ClipboardList className="w-12 h-12 mb-4 text-primary" />
              <span className="font-semibold text-lg">Émargement</span>
              <span className="text-sm text-muted-foreground text-center mt-2">
                1 PDF par session (date + créneaux matin/après-midi)
              </span>
            </Label>
          </div>
        </RadioGroup>

        <div className="flex justify-end mt-6">
          <Button onClick={onNext} disabled={!selectedKind}>
            Suivant
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
