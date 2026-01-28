"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useTransition } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
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

interface SessionFiltersProps {
  trainings: Training[];
}

export function SessionFilters({ trainings }: SessionFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const trainingId = searchParams.get("trainingId") || "all";
  const status = searchParams.get("status") || "all";
  const upcoming = searchParams.get("upcoming") === "true";

  const createQueryString = useCallback(
    (params: Record<string, string | null>) => {
      const newSearchParams = new URLSearchParams(searchParams.toString());

      Object.entries(params).forEach(([key, value]) => {
        if (value === null || value === "all" || value === "" || value === "false") {
          newSearchParams.delete(key);
        } else {
          newSearchParams.set(key, value);
        }
      });

      // Reset to page 1 when filters change
      newSearchParams.delete("page");

      return newSearchParams.toString();
    },
    [searchParams]
  );

  const handleTrainingChange = (value: string) => {
    startTransition(() => {
      router.push(`/sessions?${createQueryString({ trainingId: value })}`);
    });
  };

  const handleStatusChange = (value: string) => {
    startTransition(() => {
      router.push(`/sessions?${createQueryString({ status: value })}`);
    });
  };

  const handleUpcomingChange = (checked: boolean) => {
    startTransition(() => {
      router.push(`/sessions?${createQueryString({ upcoming: checked ? "true" : null })}`);
    });
  };

  const handleClearFilters = () => {
    startTransition(() => {
      router.push("/sessions");
    });
  };

  const hasFilters = trainingId !== "all" || status !== "all" || upcoming;

  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center">
      <div className="flex flex-wrap gap-2 flex-1">
        <Select value={trainingId} onValueChange={handleTrainingChange} disabled={isPending}>
          <SelectTrigger className="w-[250px]">
            <SelectValue placeholder="Formation" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Toutes les formations</SelectItem>
            {trainings.map((training) => (
              <SelectItem key={training.id} value={String(training.id)}>
                {training.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={status} onValueChange={handleStatusChange} disabled={isPending}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Statut" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les statuts</SelectItem>
            <SelectItem value="SCHEDULED">Planifiee</SelectItem>
            <SelectItem value="ONGOING">En cours</SelectItem>
            <SelectItem value="COMPLETED">Terminee</SelectItem>
            <SelectItem value="CANCELLED">Annulee</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center space-x-2">
          <Switch
            id="upcoming"
            checked={upcoming}
            onCheckedChange={handleUpcomingChange}
            disabled={isPending}
          />
          <Label htmlFor="upcoming" className="text-sm">
            A venir uniquement
          </Label>
        </div>

        {hasFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClearFilters}
            disabled={isPending}
          >
            <X className="mr-2 h-4 w-4" />
            Effacer
          </Button>
        )}
      </div>
    </div>
  );
}
