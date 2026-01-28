"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import {
  Calendar,
  Users,
  MapPin,
  MessageSquare,
  Monitor,
  Building,
  RefreshCw,
} from "lucide-react";
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
import { SessionActions } from "./session-actions";

interface Session {
  id: number;
  title: string;
  description: string | null;
  startDate: Date | string;
  endDate: Date | string | null;
  maxLearners: number | null;
  registeredCount: number;
  mode: "PARTNER_CENTER" | "E_LEARNING";
  location: string | null;
  status: "SCHEDULED" | "ONGOING" | "COMPLETED" | "CANCELLED";
  recurrencePattern: string | null;
  parentSessionId: number | null;
  training: {
    id: number;
    title: string;
    slug: string;
    category: {
      name: string;
    };
  };
  createdBy: {
    id: number;
    email: string;
    firstName: string | null;
    lastName: string | null;
  };
  _count: {
    quotes: number;
    childSessions: number;
  };
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

interface SessionsTableProps {
  sessions: Session[];
  pagination: Pagination;
}

const statusConfig = {
  SCHEDULED: { label: "Planifiee", variant: "secondary" as const },
  ONGOING: { label: "En cours", variant: "default" as const },
  COMPLETED: { label: "Terminee", variant: "outline" as const },
  CANCELLED: { label: "Annulee", variant: "destructive" as const },
};

const modeConfig = {
  PARTNER_CENTER: { label: "En centre", icon: Building },
  E_LEARNING: { label: "E-learning", icon: Monitor },
};

export function SessionsTable({ sessions, pagination }: SessionsTableProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(newPage));
    router.push(`/sessions?${params.toString()}`);
  };

  const formatDate = (date: Date | string) => {
    const d = typeof date === "string" ? new Date(date) : date;
    return format(d, "d MMM yyyy", { locale: fr });
  };

  const formatTime = (date: Date | string) => {
    const d = typeof date === "string" ? new Date(date) : date;
    return format(d, "HH:mm", { locale: fr });
  };

  if (sessions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <Calendar className="h-12 w-12 text-muted-foreground" />
        <h3 className="mt-4 text-lg font-semibold">Aucune session trouvee</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          Commencez par creer une nouvelle session de formation.
        </p>
        <Button asChild className="mt-4">
          <Link href="/sessions/new">Creer une session</Link>
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
              <TableHead>Formation</TableHead>
              <TableHead>Titre</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Lieu</TableHead>
              <TableHead>Mode</TableHead>
              <TableHead className="text-center">Capacite</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead className="text-center">Devis</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sessions.map((session) => {
              const status = statusConfig[session.status];
              const mode = modeConfig[session.mode];
              const ModeIcon = mode.icon;

              return (
                <TableRow key={session.id}>
                  <TableCell>
                    <div>
                      <Link
                        href={`/trainings/${session.training.id}`}
                        className="font-medium hover:underline"
                      >
                        {session.training.title}
                      </Link>
                      <p className="text-xs text-muted-foreground">
                        {session.training.category.name}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Link
                      href={`/sessions/${session.id}`}
                      className="font-medium hover:underline"
                    >
                      {session.title}
                    </Link>
                    {session.recurrencePattern && (
                      <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
                        <RefreshCw className="h-3 w-3" />
                        {session._count.childSessions > 0
                          ? `${session._count.childSessions} sessions recurrentes`
                          : "Session recurrente"}
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 text-sm">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <span>{formatDate(session.startDate)}</span>
                        <span className="text-muted-foreground ml-1">
                          {formatTime(session.startDate)}
                        </span>
                      </div>
                    </div>
                    {session.endDate && (
                      <p className="text-xs text-muted-foreground mt-1">
                        Jusqu&apos;au {formatDate(session.endDate)}
                      </p>
                    )}
                  </TableCell>
                  <TableCell>
                    {session.location ? (
                      <div className="flex items-center gap-1 text-sm">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span className="max-w-[150px] truncate">{session.location}</span>
                      </div>
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 text-sm">
                      <ModeIcon className="h-4 w-4 text-muted-foreground" />
                      <span>{mode.label}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex items-center justify-center gap-1">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span>
                        {session.registeredCount}
                        {session.maxLearners && `/${session.maxLearners}`}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={status.variant}>{status.label}</Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex items-center justify-center gap-1">
                      <MessageSquare className="h-4 w-4 text-muted-foreground" />
                      <span>{session._count.quotes}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <SessionActions session={session} />
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
            {pagination.total} sessions
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
