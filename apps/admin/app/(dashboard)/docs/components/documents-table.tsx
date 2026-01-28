"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { FileText, ClipboardList, Download, User, Calendar, Hash } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface Document {
  id: string;
  kind: "CONVENTION" | "EMARGEMENT";
  pdfUrl: string;
  batchId: string | null;
  createdAt: Date;
  createdBy: {
    id: number;
    firstName: string | null;
    lastName: string | null;
    email: string;
  };
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

interface DocumentsTableProps {
  documents: Document[];
  pagination: Pagination;
}

const kindConfig = {
  CONVENTION: {
    label: "Convention",
    icon: FileText,
    variant: "default" as const,
  },
  EMARGEMENT: {
    label: "Emargement",
    icon: ClipboardList,
    variant: "secondary" as const,
  },
};

export function DocumentsTable({ documents, pagination }: DocumentsTableProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(newPage));
    router.push(`/docs?${params.toString()}`);
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (documents.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <FileText className="h-12 w-12 text-muted-foreground" />
        <h3 className="mt-4 text-lg font-semibold">Aucun document</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          Commencez par generer votre premier document.
        </p>
        <Button asChild className="mt-4">
          <Link href="/docs/new">Generer un document</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Type</TableHead>
              <TableHead>ID</TableHead>
              <TableHead>Batch ID</TableHead>
              <TableHead>Cree le</TableHead>
              <TableHead>Cree par</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {documents.map((doc) => {
              const kind = kindConfig[doc.kind];
              const KindIcon = kind.icon;
              return (
                <TableRow key={doc.id}>
                  <TableCell>
                    <Badge variant={kind.variant} className="gap-1">
                      <KindIcon className="h-3 w-3" />
                      {kind.label}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 font-mono text-xs text-muted-foreground">
                      <Hash className="h-3 w-3" />
                      {doc.id.slice(0, 8)}...
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="font-mono text-xs text-muted-foreground">
                      {doc.batchId ? `${doc.batchId.slice(0, 8)}...` : "-"}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 text-sm">
                      <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                      {formatDate(doc.createdAt)}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 text-sm">
                      <User className="h-3.5 w-3.5 text-muted-foreground" />
                      {doc.createdBy.firstName && doc.createdBy.lastName
                        ? `${doc.createdBy.firstName} ${doc.createdBy.lastName}`
                        : doc.createdBy.email}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="outline" size="sm" asChild>
                      <a href={doc.pdfUrl} target="_blank" rel="noopener noreferrer">
                        <Download className="mr-2 h-4 w-4" />
                        Telecharger
                      </a>
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Affichage de {(pagination.page - 1) * pagination.limit + 1} a{" "}
            {Math.min(pagination.page * pagination.limit, pagination.total)} sur{" "}
            {pagination.total} documents
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(pagination.page - 1)}
              disabled={pagination.page <= 1}
            >
              Precedent
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(pagination.page + 1)}
              disabled={pagination.page >= pagination.totalPages}
            >
              Suivant
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
