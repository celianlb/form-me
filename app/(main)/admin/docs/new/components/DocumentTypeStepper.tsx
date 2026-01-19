/**
 * Component: Document Type Selection (Step 1)
 * Design modernisé avec la DA Form Me
 */
"use client";

import Button from "@/components/UI/Button";
import { Label } from "@/components/UI/label";
import { RadioGroup, RadioGroupItem } from "@/components/UI/radio-group";
import { ClipboardList, FileText } from "lucide-react";
import { cn } from "@/lib/utils";
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
    <div className="bg-white rounded-3xl border border-grayBlue/20 p-8 shadow-[0_0_20px_rgba(75,89,119,0.1)]">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-2xl md:text-3xl font-sora font-bold text-darkBlue mb-3">
          Quel type de document souhaitez-vous générer ?
        </h2>
        <p className="text-grayBlue font-satoshi">
          Choisissez entre Convention et Émargement
        </p>
      </div>

      {/* Selection Cards */}
      <RadioGroup
        value={selectedKind || ""}
        onValueChange={(value) => onKindChange(value as DocumentKind)}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Label
            htmlFor="CONVENTION"
            className={cn(
              "flex flex-col items-center justify-center p-8 rounded-3xl cursor-pointer transition-all duration-300 border-2",
              selectedKind === "CONVENTION"
                ? "border-primary bg-gradient-to-br from-white to-[#D8E5FF]/30 shadow-[0_0_24px_rgba(20,94,255,0.25)]"
                : "border-grayBlue/20 bg-white hover:border-primary/50 hover:shadow-[0_0_20px_rgba(20,94,255,0.1)]"
            )}
          >
            <RadioGroupItem
              value="CONVENTION"
              id="CONVENTION"
              className="sr-only"
            />
            <div
              className={cn(
                "w-16 h-16 rounded-full flex items-center justify-center mb-4 transition-all duration-300",
                selectedKind === "CONVENTION"
                  ? "bg-primary shadow-[0_0_14px_rgba(20,94,255,0.4)]"
                  : "bg-platinium/50"
              )}
            >
              <FileText
                className={cn(
                  "w-8 h-8 transition-colors duration-300",
                  selectedKind === "CONVENTION" ? "text-white" : "text-primary"
                )}
              />
            </div>
            <span className="font-sora font-bold text-xl text-darkBlue mb-2">
              Convention
            </span>
            <span className="text-sm text-grayBlue text-center font-satoshi leading-relaxed">
              Document unique avec société, formation, dates, effectif, tarifs
            </span>
          </Label>

          <Label
            htmlFor="EMARGEMENT"
            className={cn(
              "flex flex-col items-center justify-center p-8 rounded-3xl cursor-pointer transition-all duration-300 border-2",
              selectedKind === "EMARGEMENT"
                ? "border-primary bg-gradient-to-br from-white to-[#D8E5FF]/30 shadow-[0_0_24px_rgba(20,94,255,0.25)]"
                : "border-grayBlue/20 bg-white hover:border-primary/50 hover:shadow-[0_0_20px_rgba(20,94,255,0.1)]"
            )}
          >
            <RadioGroupItem
              value="EMARGEMENT"
              id="EMARGEMENT"
              className="sr-only"
            />
            <div
              className={cn(
                "w-16 h-16 rounded-full flex items-center justify-center mb-4 transition-all duration-300",
                selectedKind === "EMARGEMENT"
                  ? "bg-primary shadow-[0_0_14px_rgba(20,94,255,0.4)]"
                  : "bg-platinium/50"
              )}
            >
              <ClipboardList
                className={cn(
                  "w-8 h-8 transition-colors duration-300",
                  selectedKind === "EMARGEMENT" ? "text-white" : "text-primary"
                )}
              />
            </div>
            <span className="font-sora font-bold text-xl text-darkBlue mb-2">
              Émargement
            </span>
            <span className="text-sm text-grayBlue text-center font-satoshi leading-relaxed">
              1 PDF par session (date + créneaux matin/après-midi)
            </span>
          </Label>
        </div>
      </RadioGroup>

      {/* Navigation */}
      <div className="flex justify-end">
        <Button
          onClick={onNext}
          disabled={!selectedKind}
          className="min-w-[140px]"
        >
          Suivant
        </Button>
      </div>
    </div>
  );
}
