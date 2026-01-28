"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useTransition } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function DocumentFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const kind = searchParams.get("kind") || "all";

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

      newSearchParams.delete("page");

      return newSearchParams.toString();
    },
    [searchParams]
  );

  const handleKindChange = (value: string) => {
    startTransition(() => {
      router.push(`/docs?${createQueryString({ kind: value })}`);
    });
  };

  const handleClearFilters = () => {
    startTransition(() => {
      router.push("/docs");
    });
  };

  const hasFilters = kind !== "all";

  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center">
      <div className="flex flex-wrap gap-2">
        <Select value={kind} onValueChange={handleKindChange} disabled={isPending}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Type de document" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les types</SelectItem>
            <SelectItem value="CONVENTION">Conventions</SelectItem>
            <SelectItem value="EMARGEMENT">Emargements</SelectItem>
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
