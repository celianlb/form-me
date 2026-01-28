"use client";

import { ArrowLeft, Loader2, FileCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import type { ConventionData, EmargementData } from "../page";

interface ReviewStepProps {
  kind: "CONVENTION" | "EMARGEMENT";
  conventionData: ConventionData;
  emargementData: EmargementData;
  isGenerating: boolean;
  onPrevious: () => void;
  onGenerate: () => void;
}

export function ReviewStep({
  kind,
  conventionData,
  emargementData,
  isGenerating,
  onPrevious,
  onGenerate,
}: ReviewStepProps) {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-xl font-semibold">Verification des donnees</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Verifiez les informations avant de generer le document.
        </p>
      </div>

      {kind === "CONVENTION" ? (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileCheck className="h-5 w-5" />
              Convention de formation
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="text-sm font-medium text-muted-foreground mb-2">Entreprise</h4>
              <div className="grid gap-2 md:grid-cols-2">
                <div>
                  <p className="font-medium">{conventionData.companyName}</p>
                  <p className="text-sm text-muted-foreground">{conventionData.companyAddress}</p>
                </div>
                <div className="text-sm text-muted-foreground">
                  {conventionData.companyPhone && <p>{conventionData.companyPhone}</p>}
                  {conventionData.companyEmail && <p>{conventionData.companyEmail}</p>}
                </div>
              </div>
            </div>

            <Separator />

            <div>
              <h4 className="text-sm font-medium text-muted-foreground mb-2">Representant</h4>
              <p className="font-medium">{conventionData.representativeName}</p>
              {conventionData.representativeTitle && (
                <p className="text-sm text-muted-foreground">{conventionData.representativeTitle}</p>
              )}
            </div>

            <Separator />

            <div>
              <h4 className="text-sm font-medium text-muted-foreground mb-2">Formation</h4>
              <p className="font-medium">{conventionData.trainingTitle}</p>
              <div className="grid gap-2 md:grid-cols-2 mt-2 text-sm">
                <p><span className="text-muted-foreground">Duree:</span> {conventionData.trainingDuration}</p>
                <p><span className="text-muted-foreground">Dates:</span> {conventionData.trainingDates}</p>
                {conventionData.trainingLocation && (
                  <p><span className="text-muted-foreground">Lieu:</span> {conventionData.trainingLocation}</p>
                )}
                <p><span className="text-muted-foreground">Prix HT:</span> {conventionData.price} EUR</p>
              </div>
              {conventionData.trainingObjectives && (
                <div className="mt-2">
                  <p className="text-sm text-muted-foreground">Objectifs:</p>
                  <p className="text-sm">{conventionData.trainingObjectives}</p>
                </div>
              )}
            </div>

            {conventionData.participants.length > 0 && (
              <>
                <Separator />
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-2">
                    Participants ({conventionData.participants.length})
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {conventionData.participants.map((participant, index) => (
                      <Badge key={index} variant="secondary">
                        {participant}
                      </Badge>
                    ))}
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileCheck className="h-5 w-5" />
              Feuille d&apos;emargement
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="text-sm font-medium text-muted-foreground mb-2">Formation</h4>
              <p className="font-medium">{emargementData.trainingTitle}</p>
              <div className="grid gap-2 md:grid-cols-2 mt-2 text-sm">
                <p><span className="text-muted-foreground">Date:</span> {new Date(emargementData.trainingDate).toLocaleDateString("fr-FR")}</p>
                <p><span className="text-muted-foreground">Formateur:</span> {emargementData.trainerName}</p>
                {emargementData.companyName && (
                  <p><span className="text-muted-foreground">Entreprise:</span> {emargementData.companyName}</p>
                )}
              </div>
            </div>

            <Separator />

            <div>
              <h4 className="text-sm font-medium text-muted-foreground mb-2">
                Participants ({emargementData.participants.length})
              </h4>
              <div className="flex flex-wrap gap-2">
                {emargementData.participants.map((participant, index) => (
                  <Badge key={index} variant="secondary">
                    {participant}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="flex justify-between">
        <Button variant="outline" onClick={onPrevious} disabled={isGenerating}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Retour
        </Button>
        <Button onClick={onGenerate} disabled={isGenerating}>
          {isGenerating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generation en cours...
            </>
          ) : (
            <>
              Generer le document
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
