"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Users, Building2, Calendar, BookOpen } from "lucide-react";
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
import { SupportGroupActions } from "./support-group-actions";

interface Member {
  id: number;
  status: string;
  user: {
    id: number;
    email: string;
    firstName: string | null;
    lastName: string | null;
  };
}

interface SupportGroup {
  id: number;
  name: string;
  companyName: string;
  trainingDate: Date;
  isActive: boolean;
  training: {
    id: number;
    title: string;
    slug: string;
  };
  members: Member[];
  _count: {
    members: number;
  };
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

interface SupportGroupsTableProps {
  groups: SupportGroup[];
  pagination: Pagination;
}

export function SupportGroupsTable({ groups, pagination }: SupportGroupsTableProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(newPage));
    router.push(`/support-groups?${params.toString()}`);
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  if (groups.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <Users className="h-12 w-12 text-muted-foreground" />
        <h3 className="mt-4 text-lg font-semibold">Aucun groupe trouve</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          Commencez par creer un nouveau groupe de support.
        </p>
        <Button asChild className="mt-4">
          <Link href="/support-groups/new">Creer un groupe</Link>
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
              <TableHead>Groupe</TableHead>
              <TableHead>Entreprise</TableHead>
              <TableHead>Formation</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-center">Participants</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {groups.map((group) => (
              <TableRow key={group.id}>
                <TableCell>
                  <Link
                    href={`/support-groups/${group.id}`}
                    className="font-medium hover:underline"
                  >
                    {group.name}
                  </Link>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-muted-foreground" />
                    <span>{group.companyName}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className="gap-1">
                    <BookOpen className="h-3 w-3" />
                    {group.training.title}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{formatDate(group.trainingDate)}</span>
                  </div>
                </TableCell>
                <TableCell className="text-center">
                  <div className="flex items-center justify-center gap-1">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span>{group._count.members}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant={group.isActive ? "default" : "secondary"}>
                    {group.isActive ? "Actif" : "Inactif"}
                  </Badge>
                </TableCell>
                <TableCell>
                  <SupportGroupActions group={group} />
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
            {pagination.total} groupes
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
