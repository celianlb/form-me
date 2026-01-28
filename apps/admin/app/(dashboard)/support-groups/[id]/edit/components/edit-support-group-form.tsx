"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Training {
  id: number;
  title: string;
  slug: string;
}

interface Member {
  id: number;
  status: string;
  user: {
    id: number;
    email: string;
    firstName: string | null;
    lastName: string | null;
  };
}

interface SupportGroup {
  id: number;
  name: string;
  companyName: string;
  trainingDate: Date;
  isActive: boolean;
  training: {
    id: number;
    title: string;
  };
  members: Member[];
}

interface EditSupportGroupFormProps {
  group: SupportGroup;
  trainings: Training[];
}

export function EditSupportGroupForm({ group, trainings }: EditSupportGroupFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: group.name,
    companyName: group.companyName,
    trainingDate: new Date(group.trainingDate).toISOString().split("T")[0],
    trainingId: String(group.training.id),
    isActive: group.isActive,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch(`/api/support-groups/${group.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok) {
        router.push(`/support-groups/${group.id}`);
        router.refresh();
      } else {
        alert(result.error || "Erreur lors de la modification du groupe");
      }
    } catch (error) {
      console.error("Erreur:", error);
      alert("Erreur lors de la modification du groupe");
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

      <div className="flex items-center space-x-2">
        <Switch
          id="isActive"
          checked={formData.isActive}
          onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
        />
        <Label htmlFor="isActive">Groupe actif</Label>
      </div>

      <div className="flex justify-end gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push(`/support-groups/${group.id}`)}
        >
          Annuler
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Enregistrer
        </Button>
      </div>
    </form>
  );
}
