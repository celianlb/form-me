"use client";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export type QuoteStatus = "received" | "contacted" | "processed" | "converted" | "archived";

interface QuoteStatusBadgeProps {
  status: QuoteStatus;
  className?: string;
}

const statusConfig: Record<QuoteStatus, { label: string; className: string }> = {
  received: {
    label: "Recu",
    className: "bg-amber-100 text-amber-800 border-amber-200 hover:bg-amber-100",
  },
  contacted: {
    label: "Contacte",
    className: "bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-100",
  },
  processed: {
    label: "Traite",
    className: "bg-purple-100 text-purple-800 border-purple-200 hover:bg-purple-100",
  },
  converted: {
    label: "Converti",
    className: "bg-green-100 text-green-800 border-green-200 hover:bg-green-100",
  },
  archived: {
    label: "Archive",
    className: "bg-gray-100 text-gray-800 border-gray-200 hover:bg-gray-100",
  },
};

export function QuoteStatusBadge({ status, className }: QuoteStatusBadgeProps) {
  const config = statusConfig[status] || statusConfig.received;

  return (
    <Badge variant="outline" className={cn(config.className, className)}>
      {config.label}
    </Badge>
  );
}

export { statusConfig };
