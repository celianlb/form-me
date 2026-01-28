"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Users, Crown, User as UserIcon } from "lucide-react";
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
import { UserActions } from "./user-actions";

interface User {
  id: number;
  email: string;
  firstName: string | null;
  lastName: string | null;
  role: "ADMIN" | "LEARNER" | "CLIENT";
  isActive: boolean;
  mustChangePassword: boolean;
  createdAt: Date;
  lastLoginAt: Date | null;
  _count: {
    supportGroupMemberships: number;
  };
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

interface UsersTableProps {
  users: User[];
  pagination: Pagination;
}

const roleConfig = {
  ADMIN: { label: "Admin", variant: "destructive" as const, icon: Crown },
  LEARNER: { label: "Apprenant", variant: "default" as const, icon: UserIcon },
  CLIENT: { label: "Client", variant: "secondary" as const, icon: UserIcon },
};

export function UsersTable({ users, pagination }: UsersTableProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(newPage));
    router.push(`/users?${params.toString()}`);
  };

  const formatDate = (date: Date | null) => {
    if (!date) return "Jamais";
    return new Date(date).toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (users.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <Users className="h-12 w-12 text-muted-foreground" />
        <h3 className="mt-4 text-lg font-semibold">Aucun utilisateur trouve</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          Aucun utilisateur ne correspond a vos criteres de recherche.
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
              <TableHead>Utilisateur</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead>Groupes</TableHead>
              <TableHead>Derniere connexion</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => {
              const role = roleConfig[user.role];
              const RoleIcon = role.icon;
              return (
                <TableRow key={user.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                        <UserIcon className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="font-medium">
                          {user.firstName && user.lastName
                            ? `${user.firstName} ${user.lastName}`
                            : user.email}
                        </p>
                        <p className="text-sm text-muted-foreground">{user.email}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={role.variant} className="gap-1">
                      <RoleIcon className="h-3 w-3" />
                      {role.label}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div
                        className={`h-2 w-2 rounded-full ${
                          user.isActive ? "bg-green-500" : "bg-red-500"
                        }`}
                      />
                      <span className={user.isActive ? "text-green-700" : "text-red-700"}>
                        {user.isActive ? "Actif" : "Inactif"}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm">
                      {user._count.supportGroupMemberships} groupe
                      {user._count.supportGroupMemberships > 1 ? "s" : ""}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-muted-foreground">
                      {formatDate(user.lastLoginAt)}
                    </span>
                  </TableCell>
                  <TableCell>
                    <UserActions user={user} />
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
            {pagination.total} utilisateurs
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
