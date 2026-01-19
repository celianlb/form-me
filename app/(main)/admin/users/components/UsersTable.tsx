import { Users as UsersIconLucide, ChevronLeft, ChevronRight } from "lucide-react";
import Button from "@/components/UI/Button";
import { UserTableRow } from "./UserTableRow";
import type { User, Pagination } from "./types";

interface UsersTableProps {
  users: User[];
  pagination: Pagination | null;
  currentUserId: string;
  currentPage: number;
  onPageChange: (page: number) => void;
  onToggleActive: (userId: number, isActive: boolean) => void;
  onEdit: (user: User) => void;
  onDelete: (userId: number, userEmail: string) => void;
}

export function UsersTable({
  users,
  pagination,
  currentUserId,
  currentPage,
  onPageChange,
  onToggleActive,
  onEdit,
  onDelete,
}: UsersTableProps) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-primary/20">
      <div className="p-6 border-b border-grayBlue/20">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-satoshi font-semibold text-darkBlue flex items-center">
            <UsersIconLucide className="w-5 h-5 mr-2 text-primary" />
            Utilisateurs
            {pagination && (
              <span className="ml-2 text-sm text-gray-500">
                ({pagination.totalCount} au total)
              </span>
            )}
          </h3>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50/50">
            <tr>
              <th className="text-left px-6 py-4 text-sm font-satoshi font-semibold text-darkBlue">
                Utilisateur
              </th>
              <th className="text-left px-6 py-4 text-sm font-satoshi font-semibold text-darkBlue">
                Rôle
              </th>
              <th className="text-left px-6 py-4 text-sm font-satoshi font-semibold text-darkBlue">
                Statut
              </th>
              <th className="text-left px-6 py-4 text-sm font-satoshi font-semibold text-darkBlue">
                Groupes
              </th>
              <th className="text-left px-6 py-4 text-sm font-satoshi font-semibold text-darkBlue">
                Dernière connexion
              </th>
              <th className="text-left px-6 py-4 text-sm font-satoshi font-semibold text-darkBlue">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-12">
                  <UsersIconLucide className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h4 className="text-lg font-satoshi font-medium text-darkBlue mb-2">
                    Aucun utilisateur trouvé
                  </h4>
                  <p className="text-gray-500">
                    Aucun utilisateur ne correspond à vos critères de recherche
                  </p>
                </td>
              </tr>
            ) : (
              users.map((user) => (
                <UserTableRow
                  key={user.id}
                  user={user}
                  currentUserId={currentUserId}
                  onToggleActive={onToggleActive}
                  onEdit={onEdit}
                  onDelete={onDelete}
                />
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <div className="p-6 border-t border-gray-100">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600">
              Page {pagination.page} sur {pagination.totalPages} (
              {pagination.totalCount} utilisateurs au total)
            </p>
            <div className="flex items-center space-x-2">
              <Button
                onClick={() => onPageChange(Math.max(1, currentPage - 1))}
                disabled={!pagination.hasPreviousPage}
                variant="outline"
                className="text-sm"
              >
                <ChevronLeft className="w-4 h-4 mr-1" />
                Précédent
              </Button>
              <Button
                onClick={() =>
                  onPageChange(Math.min(pagination.totalPages, currentPage + 1))
                }
                disabled={!pagination.hasNextPage}
                variant="outline"
                className="text-sm"
              >
                Suivant
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
