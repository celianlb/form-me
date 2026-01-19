import { Edit2, Trash2, UserCheck, UserX } from "lucide-react";
import type { User } from "./types";

interface UserActionsProps {
  user: User;
  currentUserId: string;
  onToggleActive: (userId: number, isActive: boolean) => void;
  onEdit: (user: User) => void;
  onDelete: (userId: number, userEmail: string) => void;
}

export function UserActions({
  user,
  currentUserId,
  onToggleActive,
  onEdit,
  onDelete,
}: UserActionsProps) {
  return (
    <div className="flex items-center space-x-2">
      <button
        onClick={() => onToggleActive(user.id, !user.isActive)}
        className={`p-2 rounded-lg transition-colors ${
          user.isActive
            ? "text-red-600 hover:bg-red-50"
            : "text-green-600 hover:bg-green-50"
        }`}
        title={user.isActive ? "Désactiver" : "Activer"}
      >
        {user.isActive ? (
          <UserX className="w-4 h-4" />
        ) : (
          <UserCheck className="w-4 h-4" />
        )}
      </button>

      <button
        onClick={() => onEdit(user)}
        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
        title="Modifier"
      >
        <Edit2 className="w-4 h-4" />
      </button>

      {user.id !== parseInt(currentUserId) && (
        <button
          onClick={() => onDelete(user.id, user.email)}
          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          title="Supprimer"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}
