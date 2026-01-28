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

export function UserFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const [search, setSearch] = useState(searchParams.get("search") || "");
  const role = searchParams.get("role") || "all";

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
      router.push(`/users?${createQueryString({ search })}`);
    });
  };

  const handleRoleChange = (value: string) => {
    startTransition(() => {
      router.push(`/users?${createQueryString({ role: value })}`);
    });
  };

  const handleClearFilters = () => {
    setSearch("");
    startTransition(() => {
      router.push("/users");
    });
  };

  const hasFilters = search || role !== "all";

  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center">
      <form onSubmit={handleSearchSubmit} className="flex-1">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Rechercher par email, prenom ou nom..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
            disabled={isPending}
          />
        </div>
      </form>

      <div className="flex flex-wrap gap-2">
        <Select value={role} onValueChange={handleRoleChange} disabled={isPending}>
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les roles</SelectItem>
            <SelectItem value="ADMIN">Administrateur</SelectItem>
            <SelectItem value="LEARNER">Apprenant</SelectItem>
            <SelectItem value="CLIENT">Client</SelectItem>
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
