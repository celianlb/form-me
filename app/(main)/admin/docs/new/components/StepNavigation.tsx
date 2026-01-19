/**
 * Component: Step Navigation Buttons
 */
"use client";

import Button from "@/components/UI/Button";
import { Loader2 } from "lucide-react";

interface StepNavigationProps {
  onPrevious?: () => void;
  onNext?: () => void;
  showPrevious?: boolean;
  showNext?: boolean;
  disablePrevious?: boolean;
  disableNext?: boolean;
  nextLabel?: string;
  previousLabel?: string;
  isLoading?: boolean;
}

export function StepNavigation({
  onPrevious,
  onNext,
  showPrevious = true,
  showNext = true,
  disablePrevious = false,
  disableNext = false,
  nextLabel = "Suivant",
  previousLabel = "Retour",
  isLoading = false,
}: StepNavigationProps) {
  return (
    <div className="flex justify-between">
      {showPrevious && onPrevious && (
        <Button
          variant="outline"
          onClick={onPrevious}
          disabled={disablePrevious || isLoading}
        >
          {previousLabel}
        </Button>
      )}

      {showNext && onNext && (
        <Button onClick={onNext} disabled={disableNext || isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Chargement...
            </>
          ) : (
            nextLabel
          )}
        </Button>
      )}
    </div>
  );
}
