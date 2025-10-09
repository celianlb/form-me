/**
 * Page: Génération de documents (Stepper)
 * /admin/docs/new
 */
"use client";

import { ConventionForm } from "@/components/docs/ConventionForm";
import { EmargementForm } from "@/components/docs/EmargementForm";
import { Stepper } from "@/components/docs/Stepper";
import { Alert, AlertDescription } from "@/components/UI/alert";
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
import { useDocumentStore } from "@/lib/stores/useDocumentStore";
import {
  AlertCircle,
  ClipboardList,
  Download,
  FileText,
  Loader2,
} from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";

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
    setConventionResult,
    setEmargementResult,
    setIsGenerating,
    setGenerationError,
    reset,
  } = useDocumentStore();

  // Vérifier l'authentification admin
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/api/auth/signin");
    }
    if (status === "authenticated" && session?.user?.role !== "ADMIN") {
      router.push("/");
      toast.error("Accès refusé");
    }
  }, [status, session, router]);

  // Reset au montage
  useEffect(() => {
    reset();
  }, [reset]);

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
        {/* === STEP 1: Choix du type === */}
        {currentStep === 1 && (
          <Card>
            <CardHeader>
              <CardTitle>
                Quel type de document souhaitez-vous générer ?
              </CardTitle>
              <CardDescription>
                Choisissez entre Convention et Émargement
              </CardDescription>
            </CardHeader>
            <CardContent>
              <RadioGroup
                value={kind || ""}
                onValueChange={(value) =>
                  setKind(value as "CONVENTION" | "EMARGEMENT")
                }
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
                <Button onClick={goToNextStep} disabled={!kind}>
                  Suivant
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* === STEP 2: Formulaire === */}
        {currentStep === 2 && (
          <Card>
            <CardHeader>
              <CardTitle>
                {kind === "CONVENTION"
                  ? "Convention de formation"
                  : "Feuilles d'émargement"}
              </CardTitle>
              <CardDescription>
                Remplissez les informations requises
              </CardDescription>
            </CardHeader>
            <CardContent>
              {kind === "CONVENTION" ? <ConventionForm /> : <EmargementForm />}

              <div className="flex justify-between mt-6">
                <Button variant="outline" onClick={goToPreviousStep}>
                  Retour
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* === STEP 3: Récapitulatif === */}
        {currentStep === 3 && (
          <Card>
            <CardHeader>
              <CardTitle>Récapitulatif</CardTitle>
              <CardDescription>
                Vérifiez les informations avant de générer
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {kind === "CONVENTION" && conventionData && (
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold mb-2">Société</h3>
                    <p className="text-sm">
                      {conventionData.societe?.nom} - SIRET:{" "}
                      {conventionData.societe?.siret}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {conventionData.societe?.adresse}
                    </p>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-2">Formation</h3>
                    <p className="text-sm">{conventionData.formation?.nom}</p>
                    <p className="text-sm text-muted-foreground">
                      {conventionData.formation?.dureeHeures}h -{" "}
                      {conventionData.formation?.lieu}
                    </p>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-2">Dates</h3>
                    <p className="text-sm">
                      {conventionData.datesEtHoraires?.length} session(s)
                    </p>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-2">Effectif</h3>
                    <p className="text-sm">
                      {conventionData.effectif?.length} stagiaire(s)
                    </p>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-2">Tarif</h3>
                    <p className="text-sm">
                      {conventionData.tarifJournalierEUR}€ HT/jour
                    </p>
                  </div>
                </div>
              )}

              {kind === "EMARGEMENT" && emargementData && (
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold mb-2">Formation</h3>
                    <p className="text-sm">{emargementData.formationNom}</p>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-2">Organisme</h3>
                    <p className="text-sm">{emargementData.organismeNom}</p>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-2">Formateur</h3>
                    <p className="text-sm">
                      {emargementData.formateur?.prenom}{" "}
                      {emargementData.formateur?.nom}
                    </p>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-2">Sessions</h3>
                    <p className="text-sm">
                      {emargementData.sessions?.length} session(s)
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {emargementData.sessions?.length} PDF(s) seront générés
                    </p>
                  </div>
                </div>
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
                  onClick={goToPreviousStep}
                  disabled={isGenerating}
                >
                  Retour
                </Button>

                <Button onClick={handleGenerate} disabled={isGenerating}>
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
        )}

        {/* === STEP 4: Résultats === */}
        {currentStep === 4 && (
          <Card>
            <CardHeader>
              <CardTitle>Documents générés</CardTitle>
              <CardDescription>Téléchargez vos PDFs</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {conventionResult && (
                <div className="border rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold">Convention de formation</p>
                      <p className="text-sm text-muted-foreground">
                        Document ID: {conventionResult.documentId}
                      </p>
                    </div>
                    <Button>
                      <a
                        href={conventionResult.pdfUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Télécharger
                      </a>
                    </Button>
                  </div>
                </div>
              )}

              {emargementResult && (
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground mb-2">
                    Batch ID: {emargementResult.batchId}
                  </p>
                  {emargementResult.documents.map((doc, index) => (
                    <div key={doc.documentId} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-semibold">{doc.label}</p>
                          <p className="text-sm text-muted-foreground">
                            Document ID: {doc.documentId}
                          </p>
                        </div>
                        <Button>
                          <a
                            href={doc.pdfUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <Download className="w-4 h-4 mr-2" />
                            Télécharger
                          </a>
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className="flex justify-between pt-4">
                <Button
                  variant="outline"
                  onClick={() => {
                    reset();
                    router.push("/admin/docs");
                  }}
                >
                  Voir tous les documents
                </Button>

                <Button onClick={reset}>Générer un nouveau document</Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
