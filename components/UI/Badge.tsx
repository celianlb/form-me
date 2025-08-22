import { cn } from "@/utils/cn";
import React from "react";

interface BadgeProps {
  children: React.ReactNode;
  className?: string;
}

export default function Badge({ children, className }: BadgeProps) {
  const baseClasses =
    "bg-platinium/50 border-2 border-primary/70 text-grayBlue rounded-full px-4 py-2 inline-flex items-center justify-center font-sora font-bold";
  const shadowClasses = "shadow-[0_0_14px_rgba(75,89,119,0.5)]"; // Remplace par la couleur platinium exacte si tu l'as

  const combinedClasses = cn(baseClasses, shadowClasses, className);

  return <span className={combinedClasses}>{children}</span>;
}
