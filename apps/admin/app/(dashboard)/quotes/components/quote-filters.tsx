"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useState, useTransition } from "react";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
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
}

interface QuoteFiltersProps {
  trainings: Training[];
}

export function QuoteFilters({ trainings }: QuoteFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const [search, setSearch] = useState(searchParams.get("search") || "");
  const status = searchParams.get("status") || "all";
  const trainingId = searchParams.get("trainingId") || "all";

  const createQueryString = useCallback(
    (params: Record<string, string | null>) => {
      const newSearchParams = new URLSearchParams(searchParams.toString());

      Object.entries(params).forEach(([key, value]) => {
        if (value === null || value === "all" || value === "") {
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

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    startTransition(() => {
      router.push(`/quotes?${createQueryString({ search })}`);
    });
  };

  const handleStatusChange = (value: string) => {
    startTransition(() => {
      router.push(`/quotes?${createQueryString({ status: value })}`);
    });
  };

  const handleTrainingChange = (value: string) => {
    startTransition(() => {
      router.push(`/quotes?${createQueryString({ trainingId: value })}`);
    });
  };

  const handleClearFilters = () => {
    setSearch("");
    startTransition(() => {
      router.push("/quotes");
    });
  };

  const hasFilters = search || status !== "all" || trainingId !== "all";

  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center">
      <form onSubmit={handleSearchSubmit} className="flex-1">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Rechercher par nom, email, ville..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
            disabled={isPending}
          />
        </div>
      </form>

      <div className="flex flex-wrap gap-2">
        <Select value={status} onValueChange={handleStatusChange} disabled={isPending}>
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Statut" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les statuts</SelectItem>
            <SelectItem value="received">Recu</SelectItem>
            <SelectItem value="contacted">Contacte</SelectItem>
            <SelectItem value="processed">Traite</SelectItem>
            <SelectItem value="converted">Converti</SelectItem>
            <SelectItem value="archived">Archive</SelectItem>
          </SelectContent>
        </Select>

        <Select value={trainingId} onValueChange={handleTrainingChange} disabled={isPending}>
          <SelectTrigger className="w-[200px]">
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
