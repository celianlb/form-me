/**
 * Composant DateInput modernisé avec la DA Form Me
 * Input de date avec icône et meilleure UX
 */
"use client";

import { Calendar } from "lucide-react";
import { forwardRef } from "react";
import { cn } from "@/lib/utils";

interface DateInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
}

export const DateInput = forwardRef<HTMLInputElement, DateInputProps>(
  ({ className, error, ...props }, ref) => {
    return (
      <div className="relative">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
          <Calendar className="w-4 h-4 text-grayBlue/60" />
        </div>
        <input
          type={props.type || "date"}
          className={cn(
            "flex h-11 w-full rounded-xl border-2 bg-white pl-10 pr-3 py-2 text-sm font-satoshi",
            "placeholder:text-grayBlue/40",
            "focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary",
            "disabled:cursor-not-allowed disabled:opacity-50",
            "transition-all duration-200",
            error
              ? "border-destructive focus:border-destructive focus:ring-destructive/20"
              : "border-platinium hover:border-primary/30",
            className
          )}
          ref={ref}
          {...props}
        />
      </div>
    );
  }
);

DateInput.displayName = "DateInput";
