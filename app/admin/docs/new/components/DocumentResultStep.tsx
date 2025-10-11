/**
 * Component: Document Result Step (Step 4)
 */
"use client";

import Button from "@/components/UI/Button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/UI/card";
import { Download } from "lucide-react";
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
    <Card>
      <CardHeader>
        <CardTitle>Documents générés</CardTitle>
        <CardDescription>Téléchargez vos PDFs</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {conventionResult && (
          <ConventionResultDisplay result={conventionResult} />
        )}

        {emargementResult && (
          <EmargementResultDisplay result={emargementResult} />
        )}

        <div className="flex justify-between pt-4">
          <Button variant="outline" onClick={onViewAll}>
            Voir tous les documents
          </Button>

          <Button onClick={onGenerateNew}>Générer un nouveau document</Button>
        </div>
      </CardContent>
    </Card>
  );
}

function ConventionResultDisplay({ result }: { result: ConventionResult }) {
  return (
    <div className="border rounded-lg p-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="font-semibold">Convention de formation</p>
          <p className="text-sm text-muted-foreground">
            Document ID: {result.documentId}
          </p>
        </div>
        <Button>
          <a href={result.pdfUrl} target="_blank" rel="noopener noreferrer">
            <Download className="w-4 h-4 mr-2" />
            Télécharger
          </a>
        </Button>
      </div>
    </div>
  );
}

function EmargementResultDisplay({ result }: { result: EmargementResult }) {
  return (
    <div className="space-y-2">
      <p className="text-sm text-muted-foreground mb-2">
        Batch ID: {result.batchId}
      </p>
      {result.documents.map((doc) => (
        <div key={doc.documentId} className="border rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold">{doc.label}</p>
              <p className="text-sm text-muted-foreground">
                Document ID: {doc.documentId}
              </p>
            </div>
            <Button>
              <a href={doc.pdfUrl} target="_blank" rel="noopener noreferrer">
                <Download className="w-4 h-4 mr-2" />
                Télécharger
              </a>
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}
