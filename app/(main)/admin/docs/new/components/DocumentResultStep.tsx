/**
 * Component: Document Result Step (Step 4)
 * Design modernisé avec la DA Form Me
 */
"use client";

import Button from "@/components/UI/Button";
import { Download, CheckCircle2, FileText, Files } from "lucide-react";
import type { ConventionResult, EmargementResult } from "./types";

interface DocumentResultStepProps {
  conventionResult: ConventionResult | null;
  emargementResult: EmargementResult | null;
  onViewAll: () => void;
  onGenerateNew: () => void;
}

export function DocumentResultStep({
  conventionResult,
  emargementResult,
  onViewAll,
  onGenerateNew,
}: DocumentResultStepProps) {
  return (
    <div className="bg-white rounded-3xl border border-grayBlue/20 p-8 shadow-[0_0_20px_rgba(75,89,119,0.1)]">
      {/* Success Header */}
      <div className="mb-8 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
          <CheckCircle2 className="w-8 h-8 text-primary" />
        </div>
        <h2 className="text-2xl md:text-3xl font-sora font-bold text-darkBlue mb-3">
          Documents générés avec succès !
        </h2>
        <p className="text-grayBlue font-satoshi">
          Vos PDF sont prêts à être téléchargés
        </p>
      </div>

      {/* Documents List */}
      <div className="space-y-4 mb-8">
        {conventionResult && (
          <ConventionResultDisplay result={conventionResult} />
        )}

        {emargementResult && (
          <EmargementResultDisplay result={emargementResult} />
        )}
      </div>

      {/* Navigation */}
      <div className="flex flex-col md:flex-row gap-4 justify-between pt-6 border-t border-platinium">
        <Button variant="secondary" onClick={onViewAll} className="md:w-auto w-full">
          Voir tous les documents
        </Button>

        <Button onClick={onGenerateNew} className="md:w-auto w-full">
          Générer un nouveau document
        </Button>
      </div>
    </div>
  );
}

function ConventionResultDisplay({ result }: { result: ConventionResult }) {
  return (
    <div className="bg-gradient-to-br from-platinium/20 to-white rounded-2xl p-6 border border-primary/20 hover:border-primary/40 transition-all duration-300 hover:shadow-[0_0_14px_rgba(20,94,255,0.15)]">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-start gap-4 flex-1">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
            <FileText className="w-6 h-6 text-primary" />
          </div>
          <div className="flex-1">
            <p className="font-sora font-bold text-darkBlue mb-1">
              Convention de formation
            </p>
            <p className="text-sm text-grayBlue font-satoshi">
              Document ID: <span className="font-mono text-xs">{result.documentId}</span>
            </p>
          </div>
        </div>
        <a
          href={result.pdfUrl}
          target="_blank"
          rel="noopener noreferrer"
        >
          <Button variant="primary" className="flex items-center gap-2">
            <Download className="w-4 h-4" />
            Télécharger
          </Button>
        </a>
      </div>
    </div>
  );
}

function EmargementResultDisplay({ result }: { result: EmargementResult }) {
  return (
    <div className="space-y-3">
      {/* Batch Header */}
      <div className="flex items-center gap-2 mb-2">
        <Files className="w-5 h-5 text-primary" />
        <p className="text-sm font-satoshi text-grayBlue">
          Batch ID: <span className="font-mono text-xs">{result.batchId}</span>
        </p>
      </div>

      {/* Documents */}
      {result.documents.map((doc, index) => (
        <div
          key={doc.documentId}
          className="bg-gradient-to-br from-platinium/20 to-white rounded-2xl p-6 border border-primary/20 hover:border-primary/40 transition-all duration-300 hover:shadow-[0_0_14px_rgba(20,94,255,0.15)]"
        >
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-start gap-4 flex-1">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <span className="font-sora font-bold text-primary text-sm">
                  {index + 1}
                </span>
              </div>
              <div className="flex-1">
                <p className="font-sora font-bold text-darkBlue mb-1">
                  {doc.label}
                </p>
                <p className="text-sm text-grayBlue font-satoshi">
                  Document ID: <span className="font-mono text-xs">{doc.documentId}</span>
                </p>
              </div>
            </div>
            <a
              href={doc.pdfUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button variant="primary" className="flex items-center gap-2">
                <Download className="w-4 h-4" />
                Télécharger
              </Button>
            </a>
          </div>
        </div>
      ))}
    </div>
  );
}
