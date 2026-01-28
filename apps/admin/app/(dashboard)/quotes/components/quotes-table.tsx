"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import {
  Mail,
  Phone,
  Users,
  Calendar,
  MessageSquare,
  MoreHorizontal,
  Eye,
  Archive,
  ExternalLink,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { QuoteStatusBadge, type QuoteStatus } from "./quote-status-badge";

interface Quote {
  id: number;
  firstName: string;
  lastName: string | null;
  email: string;
  phone: string | null;
  profile: "INDIVIDUAL" | "PROFESSIONAL";
  numberLearners: number;
  status: string;
  createdAt: string;
  training: {
    id: number;
    title: string;
    slug: string;
  } | null;
  session: {
    id: number;
    title: string;
    startDate: string;
    location: string | null;
  } | null;
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

interface QuotesTableProps {
  quotes: Quote[];
  pagination: Pagination;
}

export function QuotesTable({ quotes, pagination }: QuotesTableProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(newPage));
    router.push(`/quotes?${params.toString()}`);
  };

  const handleArchive = async (id: number) => {
    try {
      const response = await fetch(`/api/quotes/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        router.refresh();
      }
    } catch (error) {
      console.error("Erreur lors de l'archivage:", error);
    }
  };

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), "d MMM yyyy", { locale: fr });
  };

  const formatDateTime = (dateString: string) => {
    return format(new Date(dateString), "d MMM yyyy 'a' HH:mm", { locale: fr });
  };

  if (quotes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <MessageSquare className="h-12 w-12 text-muted-foreground" />
        <h3 className="mt-4 text-lg font-semibold">Aucun devis trouve</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          Les demandes de devis apparaitront ici.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Contact</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Formation</TableHead>
              <TableHead>Session</TableHead>
              <TableHead className="text-center">Apprenants</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {quotes.map((quote) => (
              <TableRow key={quote.id}>
                <TableCell>
                  <Link
                    href={`/quotes/${quote.id}`}
                    className="font-medium hover:underline"
                  >
                    {quote.firstName} {quote.lastName || ""}
                  </Link>
                  <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                    {quote.phone && (
                      <span className="flex items-center gap-1">
                        <Phone className="h-3 w-3" />
                        {quote.phone}
                      </span>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <a
                    href={`mailto:${quote.email}`}
                    className="flex items-center gap-1 text-sm hover:underline"
                  >
                    <Mail className="h-3.5 w-3.5 text-muted-foreground" />
                    {quote.email}
                  </a>
                </TableCell>
                <TableCell>
                  {quote.training ? (
                    <span className="text-sm">{quote.training.title}</span>
                  ) : (
                    <span className="text-sm text-muted-foreground">-</span>
                  )}
                </TableCell>
                <TableCell>
                  {quote.session ? (
                    <div className="text-sm">
                      <div>{quote.session.title}</div>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        {formatDate(quote.session.startDate)}
                      </div>
                    </div>
                  ) : (
                    <span className="text-sm text-muted-foreground">-</span>
                  )}
                </TableCell>
                <TableCell className="text-center">
                  <div className="flex items-center justify-center gap-1">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span>{quote.numberLearners}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <QuoteStatusBadge status={quote.status as QuoteStatus} />
                </TableCell>
                <TableCell>
                  <span className="text-sm text-muted-foreground">
                    {formatDate(quote.createdAt)}
                  </span>
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Actions</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem asChild>
                        <Link href={`/quotes/${quote.id}`}>
                          <Eye className="mr-2 h-4 w-4" />
                          Voir le detail
                        </Link>
                      </DropdownMenuItem>
                      {quote.training && (
                        <DropdownMenuItem asChild>
                          <Link href={`/trainings/${quote.training.id}`}>
                            <ExternalLink className="mr-2 h-4 w-4" />
                            Voir la formation
                          </Link>
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => handleArchive(quote.id)}
                        className="text-red-600 focus:text-red-600"
                      >
                        <Archive className="mr-2 h-4 w-4" />
                        Archiver
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Affichage de {(pagination.page - 1) * pagination.limit + 1} a{" "}
            {Math.min(pagination.page * pagination.limit, pagination.total)} sur{" "}
            {pagination.total} devis
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
