"use client";

import Link from "next/link";
import { CheckCircle2, XCircle, Download, RefreshCw, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { GenerationResult } from "../page";

interface ResultStepProps {
  result: GenerationResult | null;
  onReset: () => void;
}

export function ResultStep({ result, onReset }: ResultStepProps) {
  if (!result) {
    return null;
  }

  if (result.success && result.pdfUrl) {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
              <CheckCircle2 className="h-8 w-8 text-green-600" />
            </div>
          </div>
          <h2 className="text-xl font-semibold text-green-700">Document genere avec succes</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Votre document est pret a etre telecharge.
          </p>
        </div>

        <div className="flex flex-col items-center gap-4">
          <Button size="lg" asChild>
            <a href={result.pdfUrl} target="_blank" rel="noopener noreferrer">
              <Download className="mr-2 h-5 w-5" />
              Telecharger le PDF
            </a>
          </Button>

          <div className="flex gap-4">
            <Button variant="outline" onClick={onReset}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Generer un autre document
            </Button>
            <Button variant="outline" asChild>
              <Link href="/docs">
                <FileText className="mr-2 h-4 w-4" />
                Voir tous les documents
              </Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="flex justify-center mb-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
            <XCircle className="h-8 w-8 text-red-600" />
          </div>
        </div>
        <h2 className="text-xl font-semibold text-red-700">Erreur lors de la generation</h2>
        <p className="text-sm text-muted-foreground mt-1">
          {result.error || "Une erreur est survenue lors de la generation du document."}
        </p>
      </div>

      <div className="flex justify-center gap-4">
        <Button onClick={onReset}>
          <RefreshCw className="mr-2 h-4 w-4" />
          Reessayer
        </Button>
        <Button variant="outline" asChild>
          <Link href="/docs">
            <FileText className="mr-2 h-4 w-4" />
            Retour aux documents
          </Link>
        </Button>
      </div>
    </div>
  );
}
