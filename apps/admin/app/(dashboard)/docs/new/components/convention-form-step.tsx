"use client";

import { useState } from "react";
import { ArrowLeft, ArrowRight, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import type { ConventionData } from "../page";

interface ConventionFormStepProps {
  data: ConventionData;
  onChange: (data: ConventionData) => void;
  onPrevious: () => void;
  onNext: () => void;
}

export function ConventionFormStep({
  data,
  onChange,
  onPrevious,
  onNext,
}: ConventionFormStepProps) {
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
    data.companyName &&
    data.companyAddress &&
    data.representativeName &&
    data.trainingTitle &&
    data.trainingDuration &&
    data.trainingDates &&
    data.price;

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-xl font-semibold">Convention de formation</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Remplissez les informations pour generer la convention.
        </p>
      </div>

      <div className="space-y-6">
        {/* Entreprise */}
        <div>
          <h3 className="font-medium mb-4">Informations entreprise</h3>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="companyName">Nom de l&apos;entreprise *</Label>
              <Input
                id="companyName"
                value={data.companyName}
                onChange={(e) => onChange({ ...data, companyName: e.target.value })}
                placeholder="ACME Corp"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="companyEmail">Email</Label>
              <Input
                id="companyEmail"
                type="email"
                value={data.companyEmail}
                onChange={(e) => onChange({ ...data, companyEmail: e.target.value })}
                placeholder="contact@acme.com"
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="companyAddress">Adresse *</Label>
              <Input
                id="companyAddress"
                value={data.companyAddress}
                onChange={(e) => onChange({ ...data, companyAddress: e.target.value })}
                placeholder="123 rue de la Formation, 75000 Paris"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="companyPhone">Telephone</Label>
              <Input
                id="companyPhone"
                value={data.companyPhone}
                onChange={(e) => onChange({ ...data, companyPhone: e.target.value })}
                placeholder="01 23 45 67 89"
              />
            </div>
          </div>
        </div>

        <Separator />

        {/* Representant */}
        <div>
          <h3 className="font-medium mb-4">Representant legal</h3>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="representativeName">Nom et prenom *</Label>
              <Input
                id="representativeName"
                value={data.representativeName}
                onChange={(e) => onChange({ ...data, representativeName: e.target.value })}
                placeholder="Jean Dupont"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="representativeTitle">Fonction</Label>
              <Input
                id="representativeTitle"
                value={data.representativeTitle}
                onChange={(e) => onChange({ ...data, representativeTitle: e.target.value })}
                placeholder="Directeur des Ressources Humaines"
              />
            </div>
          </div>
        </div>

        <Separator />

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
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="trainingObjectives">Objectifs</Label>
              <Textarea
                id="trainingObjectives"
                value={data.trainingObjectives}
                onChange={(e) => onChange({ ...data, trainingObjectives: e.target.value })}
                placeholder="Objectifs pedagogiques de la formation..."
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="trainingDuration">Duree *</Label>
              <Input
                id="trainingDuration"
                value={data.trainingDuration}
                onChange={(e) => onChange({ ...data, trainingDuration: e.target.value })}
                placeholder="14 heures (2 jours)"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="trainingDates">Dates *</Label>
              <Input
                id="trainingDates"
                value={data.trainingDates}
                onChange={(e) => onChange({ ...data, trainingDates: e.target.value })}
                placeholder="15 et 16 janvier 2026"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="trainingLocation">Lieu</Label>
              <Input
                id="trainingLocation"
                value={data.trainingLocation}
                onChange={(e) => onChange({ ...data, trainingLocation: e.target.value })}
                placeholder="Dans les locaux de l'entreprise"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="price">Prix HT *</Label>
              <Input
                id="price"
                value={data.price}
                onChange={(e) => onChange({ ...data, price: e.target.value })}
                placeholder="2 500,00"
              />
            </div>
          </div>
        </div>

        <Separator />

        {/* Participants */}
        <div>
          <h3 className="font-medium mb-4">Participants</h3>
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
          {data.participants.length > 0 && (
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
