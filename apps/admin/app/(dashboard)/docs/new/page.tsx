"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, FileText, ClipboardList, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { DocumentTypeStep } from "./components/document-type-step";
import { ConventionFormStep } from "./components/convention-form-step";
import { EmargementFormStep } from "./components/emargement-form-step";
import { ReviewStep } from "./components/review-step";
import { ResultStep } from "./components/result-step";

type DocumentKind = "CONVENTION" | "EMARGEMENT" | null;

export interface ConventionData {
  companyName: string;
  companyAddress: string;
  companyPhone: string;
  companyEmail: string;
  representativeName: string;
  representativeTitle: string;
  trainingTitle: string;
  trainingObjectives: string;
  trainingDuration: string;
  trainingDates: string;
  trainingLocation: string;
  price: string;
  participants: string[];
}

export interface EmargementData {
  trainingTitle: string;
  trainingDate: string;
  trainerName: string;
  companyName: string;
  participants: string[];
}

export interface GenerationResult {
  success: boolean;
  pdfUrl?: string;
  error?: string;
}

const STEPS = [
  { label: "Type", description: "Choisir le document" },
  { label: "Saisie", description: "Remplir le formulaire" },
  { label: "Revision", description: "Verifier les donnees" },
  { label: "Resultat", description: "Telecharger les PDFs" },
];

export default function NewDocumentPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [kind, setKind] = useState<DocumentKind>(null);
  const [conventionData, setConventionData] = useState<ConventionData>({
    companyName: "",
    companyAddress: "",
    companyPhone: "",
    companyEmail: "",
    representativeName: "",
    representativeTitle: "",
    trainingTitle: "",
    trainingObjectives: "",
    trainingDuration: "",
    trainingDates: "",
    trainingLocation: "",
    price: "",
    participants: [],
  });
  const [emargementData, setEmargementData] = useState<EmargementData>({
    trainingTitle: "",
    trainingDate: "",
    trainerName: "",
    companyName: "",
    participants: [],
  });
  const [result, setResult] = useState<GenerationResult | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const goToNextStep = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const goToPreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      const endpoint = kind === "CONVENTION"
        ? "/api/docs/generate/convention"
        : "/api/docs/generate/emargement";

      const data = kind === "CONVENTION" ? conventionData : emargementData;

      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const resultData = await response.json();

      if (response.ok) {
        setResult({ success: true, pdfUrl: resultData.pdfUrl });
        setCurrentStep(4);
      } else {
        setResult({ success: false, error: resultData.error || "Erreur lors de la generation" });
      }
    } catch (error) {
      console.error("Erreur:", error);
      setResult({ success: false, error: "Erreur lors de la generation" });
    } finally {
      setIsGenerating(false);
    }
  };

  const reset = () => {
    setCurrentStep(1);
    setKind(null);
    setConventionData({
      companyName: "",
      companyAddress: "",
      companyPhone: "",
      companyEmail: "",
      representativeName: "",
      representativeTitle: "",
      trainingTitle: "",
      trainingObjectives: "",
      trainingDuration: "",
      trainingDates: "",
      trainingLocation: "",
      price: "",
      participants: [],
    });
    setEmargementData({
      trainingTitle: "",
      trainingDate: "",
      trainerName: "",
      companyName: "",
      participants: [],
    });
    setResult(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/docs">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Generer un document</h1>
          <p className="text-muted-foreground">
            Creez des conventions ou des feuilles d&apos;emargement.
          </p>
        </div>
      </div>

      {/* Stepper */}
      <div className="flex items-center justify-center">
        <div className="flex items-center gap-2">
          {STEPS.map((step, index) => {
            const stepNumber = index + 1;
            const isActive = stepNumber === currentStep;
            const isCompleted = stepNumber < currentStep;

            return (
              <div key={step.label} className="flex items-center">
                <div className="flex flex-col items-center">
                  <div
                    className={cn(
                      "flex h-10 w-10 items-center justify-center rounded-full border-2 font-semibold",
                      isActive && "border-primary bg-primary text-primary-foreground",
                      isCompleted && "border-primary bg-primary text-primary-foreground",
                      !isActive && !isCompleted && "border-muted-foreground/30 text-muted-foreground"
                    )}
                  >
                    {isCompleted ? <Check className="h-5 w-5" /> : stepNumber}
                  </div>
                  <div className="mt-2 text-center">
                    <p className={cn(
                      "text-sm font-medium",
                      (isActive || isCompleted) ? "text-foreground" : "text-muted-foreground"
                    )}>
                      {step.label}
                    </p>
                    <p className="text-xs text-muted-foreground">{step.description}</p>
                  </div>
                </div>
                {index < STEPS.length - 1 && (
                  <div
                    className={cn(
                      "mx-4 h-0.5 w-16",
                      isCompleted ? "bg-primary" : "bg-muted-foreground/30"
                    )}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Step content */}
      <Card>
        <CardContent className="pt-6">
          {currentStep === 1 && (
            <DocumentTypeStep
              selectedKind={kind}
              onKindChange={setKind}
              onNext={goToNextStep}
            />
          )}

          {currentStep === 2 && kind === "CONVENTION" && (
            <ConventionFormStep
              data={conventionData}
              onChange={setConventionData}
              onPrevious={goToPreviousStep}
              onNext={goToNextStep}
            />
          )}

          {currentStep === 2 && kind === "EMARGEMENT" && (
            <EmargementFormStep
              data={emargementData}
              onChange={setEmargementData}
              onPrevious={goToPreviousStep}
              onNext={goToNextStep}
            />
          )}

          {currentStep === 3 && (
            <ReviewStep
              kind={kind!}
              conventionData={conventionData}
              emargementData={emargementData}
              isGenerating={isGenerating}
              onPrevious={goToPreviousStep}
              onGenerate={handleGenerate}
            />
          )}

          {currentStep === 4 && (
            <ResultStep
              result={result}
              onReset={reset}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
