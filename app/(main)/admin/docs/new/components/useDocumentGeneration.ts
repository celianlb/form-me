/**
 * Custom hook for document generation logic
 */
import { useDocumentStore } from "@/lib/stores/useDocumentStore";
import { toast } from "sonner";

export function useDocumentGeneration() {
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
    setConventionResult,
    setEmargementResult,
    setIsGenerating,
    setGenerationError,
    reset,
  } = useDocumentStore();

  const handleGenerate = async () => {
    setIsGenerating(true);
    setGenerationError(null);

    try {
      if (kind === "CONVENTION" && conventionData) {
        const response = await fetch("/api/docs/generate/convention", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(conventionData),
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(
            error.error?.message || "Erreur lors de la génération"
          );
        }

        const result = await response.json();
        setConventionResult(result);
        goToNextStep();
        toast.success("Convention générée avec succès");
      } else if (kind === "EMARGEMENT" && emargementData) {
        const response = await fetch("/api/docs/generate/emargement", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(emargementData),
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(
            error.error?.message || "Erreur lors de la génération"
          );
        }

        const result = await response.json();
        setEmargementResult(result);
        goToNextStep();
        toast.success("Émargements générés avec succès");
      }
    } catch (error) {
      console.error("Generation error:", error);
      const message =
        error instanceof Error ? error.message : "Une erreur est survenue";
      setGenerationError(message);
      toast.error(message);
    } finally {
      setIsGenerating(false);
    }
  };

  return {
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
  };
}
