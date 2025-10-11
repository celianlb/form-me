/**
 * Page: Génération de documents (Stepper)
 * /admin/docs/new
 */
"use client";

import { Stepper } from "@/components/docs/Stepper";
import { Loader2 } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";
import {
  DocumentFormStep,
  DocumentResultStep,
  DocumentReviewStep,
  DocumentTypeStepper,
  useDocumentGeneration,
} from "./components";

const STEPS = [
  { label: "Type", description: "Choisir le document" },
  { label: "Saisie", description: "Remplir le formulaire" },
  { label: "Révision", description: "Vérifier les données" },
  { label: "Résultat", description: "Télécharger les PDFs" },
];

export default function NewDocumentPage() {
  const router = useRouter();
  const { data: session, status } = useSession();

  const {
    currentStep,
    kind,
    conventionData,
    emargementData,
    conventionResult,
    emargementResult,
    isGenerating,
    generationError,
    setKind,
    goToNextStep,
    goToPreviousStep,
    handleGenerate,
    reset,
  } = useDocumentGeneration();

  // Check admin authentication
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/api/auth/signin");
    }
    if (status === "authenticated" && session?.user?.role !== "ADMIN") {
      router.push("/");
      toast.error("Accès refusé");
    }
  }, [status, session, router]);

  // Reset on mount
  useEffect(() => {
    reset();
  }, [reset]);

  const handleViewAll = () => {
    reset();
    router.push("/admin/docs");
  };

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-5xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Générer un document</h1>
        <p className="text-muted-foreground mt-2">
          Créez des Conventions ou des Feuilles d&apos;Émargement
        </p>
      </div>

      <Stepper currentStep={currentStep} steps={STEPS} />

      <div className="mt-8">
        {currentStep === 1 && (
          <DocumentTypeStepper
            selectedKind={kind}
            onKindChange={setKind}
            onNext={goToNextStep}
          />
        )}

        {currentStep === 2 && (
          <DocumentFormStep kind={kind} onPrevious={goToPreviousStep} />
        )}

        {currentStep === 3 && (
          <DocumentReviewStep
            kind={kind}
            conventionData={conventionData}
            emargementData={emargementData}
            isGenerating={isGenerating}
            generationError={generationError}
            onPrevious={goToPreviousStep}
            onGenerate={handleGenerate}
          />
        )}

        {currentStep === 4 && (
          <DocumentResultStep
            conventionResult={conventionResult}
            emargementResult={emargementResult}
            onViewAll={handleViewAll}
            onGenerateNew={reset}
          />
        )}
      </div>
    </div>
  );
}
