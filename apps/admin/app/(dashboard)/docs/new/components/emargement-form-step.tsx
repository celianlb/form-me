"use client";

import { useState } from "react";
import { ArrowLeft, ArrowRight, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import type { EmargementData } from "../page";

interface EmargementFormStepProps {
  data: EmargementData;
  onChange: (data: EmargementData) => void;
  onPrevious: () => void;
  onNext: () => void;
}

export function EmargementFormStep({
  data,
  onChange,
  onPrevious,
  onNext,
}: EmargementFormStepProps) {
  const [newParticipant, setNewParticipant] = useState("");

  const handleAddParticipant = () => {
    if (newParticipant.trim()) {
      onChange({
        ...data,
        participants: [...data.participants, newParticipant.trim()],
      });
      setNewParticipant("");
    }
  };

  const handleRemoveParticipant = (index: number) => {
    onChange({
      ...data,
      participants: data.participants.filter((_, i) => i !== index),
    });
  };

  const isValid =
    data.trainingTitle &&
    data.trainingDate &&
    data.trainerName &&
    data.participants.length > 0;

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-xl font-semibold">Feuille d&apos;emargement</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Remplissez les informations pour generer la feuille d&apos;emargement.
        </p>
      </div>

      <div className="space-y-6">
        {/* Formation */}
        <div>
          <h3 className="font-medium mb-4">Informations formation</h3>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="trainingTitle">Intitule de la formation *</Label>
              <Input
                id="trainingTitle"
                value={data.trainingTitle}
                onChange={(e) => onChange({ ...data, trainingTitle: e.target.value })}
                placeholder="Formation Excel Avancee"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="trainingDate">Date *</Label>
              <Input
                id="trainingDate"
                type="date"
                value={data.trainingDate}
                onChange={(e) => onChange({ ...data, trainingDate: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="trainerName">Nom du formateur *</Label>
              <Input
                id="trainerName"
                value={data.trainerName}
                onChange={(e) => onChange({ ...data, trainerName: e.target.value })}
                placeholder="Jean Formateur"
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="companyName">Entreprise</Label>
              <Input
                id="companyName"
                value={data.companyName}
                onChange={(e) => onChange({ ...data, companyName: e.target.value })}
                placeholder="ACME Corp"
              />
            </div>
          </div>
        </div>

        {/* Participants */}
        <div>
          <h3 className="font-medium mb-4">Participants *</h3>
          <div className="flex gap-2 mb-4">
            <Input
              value={newParticipant}
              onChange={(e) => setNewParticipant(e.target.value)}
              placeholder="Nom du participant"
              onKeyDown={(e) => e.key === "Enter" && handleAddParticipant()}
            />
            <Button type="button" onClick={handleAddParticipant}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          {data.participants.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {data.participants.map((participant, index) => (
                <Badge key={index} variant="secondary" className="gap-1">
                  {participant}
                  <button
                    type="button"
                    onClick={() => handleRemoveParticipant(index)}
                    className="ml-1 hover:text-destructive"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              Ajoutez au moins un participant pour generer la feuille.
            </p>
          )}
        </div>
      </div>

      <div className="flex justify-between">
        <Button variant="outline" onClick={onPrevious}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Retour
        </Button>
        <Button onClick={onNext} disabled={!isValid}>
          Continuer
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
