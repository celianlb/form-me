"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface Training {
  id: number;
  title: string;
  slug: string;
}

interface SupportGroupFormProps {
  trainings: Training[];
}

export function SupportGroupForm({ trainings }: SupportGroupFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    companyName: "",
    trainingDate: "",
    trainingId: "",
    participantEmails: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Validation des emails
    const emailList = formData.participantEmails
      .split("\n")
      .map((email) => email.trim())
      .filter((email) => email.length > 0);

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const invalidEmails = emailList.filter((email) => !emailRegex.test(email));

    if (invalidEmails.length > 0) {
      toast.error("Emails invalides", {
        description: `Les emails suivants sont invalides : ${invalidEmails.join(", ")}`,
      });
      setIsLoading(false);
      return;
    }

    if (emailList.length === 0) {
      toast.error("Aucun participant", {
        description: "Veuillez saisir au moins un email de participant.",
      });
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/support-groups", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          participantEmails: emailList,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        // Envoyer les invitations
        if (result.invitationsToSend?.length > 0) {
          await fetch("/api/send-invitations", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              groupId: result.group.id,
              members: result.invitationsToSend,
            }),
          });
        }

        toast.success("Groupe cree avec succes", {
          description: `${emailList.length} participant(s) ont ete invites.`,
        });
        router.push("/support-groups");
      } else {
        toast.error("Erreur", { description: result.error || "Erreur lors de la creation du groupe" });
      }
    } catch (error) {
      console.error("Erreur:", error);
      toast.error("Erreur", { description: "Erreur lors de la creation du groupe" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="name">Nom du groupe *</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Ex: Formation Excel - Groupe A"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="companyName">Nom de l&apos;entreprise *</Label>
          <Input
            id="companyName"
            value={formData.companyName}
            onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
            placeholder="Ex: ACME Corp"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="trainingDate">Date de la formation *</Label>
          <Input
            id="trainingDate"
            type="date"
            value={formData.trainingDate}
            onChange={(e) => setFormData({ ...formData, trainingDate: e.target.value })}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="trainingId">Formation *</Label>
          <Select
            value={formData.trainingId}
            onValueChange={(value) => setFormData({ ...formData, trainingId: value })}
            required
          >
            <SelectTrigger>
              <SelectValue placeholder="Selectionner une formation" />
            </SelectTrigger>
            <SelectContent>
              {trainings.map((training) => (
                <SelectItem key={training.id} value={String(training.id)}>
                  {training.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="participantEmails">Emails des participants *</Label>
        <Textarea
          id="participantEmails"
          value={formData.participantEmails}
          onChange={(e) => setFormData({ ...formData, participantEmails: e.target.value })}
          rows={8}
          placeholder={"Saisissez un email par ligne:\nparticipant1@entreprise.com\nparticipant2@entreprise.com\nparticipant3@entreprise.com"}
          required
        />
        <Alert>
          <Info className="h-4 w-4" />
          <AlertDescription>
            <ul className="list-disc list-inside text-sm space-y-1">
              <li>Saisissez un email par ligne</li>
              <li>Les utilisateurs sans compte recevront une invitation</li>
              <li>Les utilisateurs existants seront ajoutes automatiquement</li>
            </ul>
          </AlertDescription>
        </Alert>
      </div>

      <div className="flex justify-end gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/support-groups")}
        >
          Annuler
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Creer le groupe
        </Button>
      </div>
    </form>
  );
}
