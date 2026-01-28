"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Check, Loader2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { type QuoteStatus, statusConfig } from "./quote-status-badge";

interface QuoteStatusSelectProps {
  quoteId: number;
  currentStatus: QuoteStatus;
  onStatusChange?: (newStatus: QuoteStatus) => void;
}

export function QuoteStatusSelect({
  quoteId,
  currentStatus,
  onStatusChange,
}: QuoteStatusSelectProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [status, setStatus] = useState<QuoteStatus>(currentStatus);
  const [error, setError] = useState<string | null>(null);

  const handleStatusChange = async (newStatus: string) => {
    setError(null);
    const previousStatus = status;
    setStatus(newStatus as QuoteStatus);

    try {
      const response = await fetch(`/api/quotes/${quoteId}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        throw new Error("Erreur lors de la mise a jour du statut");
      }

      startTransition(() => {
        router.refresh();
      });

      if (onStatusChange) {
        onStatusChange(newStatus as QuoteStatus);
      }
    } catch (err) {
      setStatus(previousStatus);
      setError("Erreur lors de la mise a jour");
      console.error("Erreur:", err);
    }
  };

  const statuses: QuoteStatus[] = ["received", "contacted", "processed", "converted", "archived"];

  return (
    <div className="space-y-2">
      <Select value={status} onValueChange={handleStatusChange} disabled={isPending}>
        <SelectTrigger className={cn("w-[180px]", isPending && "opacity-50")}>
          {isPending ? (
            <div className="flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Mise a jour...</span>
            </div>
          ) : (
            <SelectValue>
              <div className="flex items-center gap-2">
                <span
                  className={cn(
                    "h-2 w-2 rounded-full",
                    status === "received" && "bg-amber-500",
                    status === "contacted" && "bg-blue-500",
                    status === "processed" && "bg-purple-500",
                    status === "converted" && "bg-green-500",
                    status === "archived" && "bg-gray-500"
                  )}
                />
                {statusConfig[status].label}
              </div>
            </SelectValue>
          )}
        </SelectTrigger>
        <SelectContent>
          {statuses.map((s) => (
            <SelectItem key={s} value={s}>
              <div className="flex items-center gap-2">
                <span
                  className={cn(
                    "h-2 w-2 rounded-full",
                    s === "received" && "bg-amber-500",
                    s === "contacted" && "bg-blue-500",
                    s === "processed" && "bg-purple-500",
                    s === "converted" && "bg-green-500",
                    s === "archived" && "bg-gray-500"
                  )}
                />
                {statusConfig[s].label}
                {s === status && <Check className="ml-auto h-4 w-4" />}
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}
