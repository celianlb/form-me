"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Clock, Users, FileText, MessageSquare } from "lucide-react";
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
import { TrainingActions } from "./training-actions";

interface Training {
  id: number;
  title: string;
  slug: string;
  imageUrl: string | null;
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  durationHours: number | null;
  durationDays: number | null;
  category: {
    id: number;
    name: string;
    slug: string;
  };
  _count: {
    modules: number;
    objectives: number;
    sessions?: number;
    quotes?: number;
  };
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

interface TrainingsTableProps {
  trainings: Training[];
  pagination: Pagination;
}

const statusConfig = {
  DRAFT: { label: "Brouillon", variant: "secondary" as const },
  PUBLISHED: { label: "Publie", variant: "default" as const },
  ARCHIVED: { label: "Archive", variant: "outline" as const },
};

export function TrainingsTable({ trainings, pagination }: TrainingsTableProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(newPage));
    router.push(`/trainings?${params.toString()}`);
  };

  const formatDuration = (hours: number | null, days: number | null) => {
    if (days && days > 0) {
      return `${days} jour${days > 1 ? "s" : ""}`;
    }
    if (hours && hours > 0) {
      return `${hours}h`;
    }
    return "-";
  };

  if (trainings.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <FileText className="h-12 w-12 text-muted-foreground" />
        <h3 className="mt-4 text-lg font-semibold">Aucune formation trouvee</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          Commencez par creer une nouvelle formation.
        </p>
        <Button asChild className="mt-4">
          <Link href="/trainings/new">Creer une formation</Link>
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
              <TableHead className="w-[60px]">Image</TableHead>
              <TableHead>Titre</TableHead>
              <TableHead>Categorie</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead>Duree</TableHead>
              <TableHead className="text-center">Sessions</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {trainings.map((training) => {
              const status = statusConfig[training.status];
              return (
                <TableRow key={training.id}>
                  <TableCell>
                    <div className="relative h-10 w-10 overflow-hidden rounded-md bg-muted">
                      {training.imageUrl ? (
                        <Image
                          src={training.imageUrl}
                          alt={training.title}
                          fill
                          className="object-cover"
                          sizes="40px"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center">
                          <FileText className="h-5 w-5 text-muted-foreground" />
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Link
                      href={`/trainings/${training.id}`}
                      className="font-medium hover:underline"
                    >
                      {training.title}
                    </Link>
                    <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <FileText className="h-3 w-3" />
                        {training._count.modules} modules
                      </span>
                      {training._count.quotes !== undefined && training._count.quotes > 0 && (
                        <span className="flex items-center gap-1">
                          <MessageSquare className="h-3 w-3" />
                          {training._count.quotes} devis
                        </span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{training.category.name}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={status.variant}>{status.label}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 text-sm">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      {formatDuration(training.durationHours, training.durationDays)}
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex items-center justify-center gap-1">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span>{training._count.sessions ?? 0}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <TrainingActions training={training} />
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
            {pagination.total} formations
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
            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                let pageNum: number;
                if (pagination.totalPages <= 5) {
                  pageNum = i + 1;
                } else if (pagination.page <= 3) {
                  pageNum = i + 1;
                } else if (pagination.page >= pagination.totalPages - 2) {
                  pageNum = pagination.totalPages - 4 + i;
                } else {
                  pageNum = pagination.page - 2 + i;
                }

                return (
                  <Button
                    key={pageNum}
                    variant={pageNum === pagination.page ? "default" : "outline"}
                    size="sm"
                    onClick={() => handlePageChange(pageNum)}
                    className="w-8"
                  >
                    {pageNum}
                  </Button>
                );
              })}
            </div>
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
