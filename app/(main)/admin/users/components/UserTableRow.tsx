import { Crown, User as UserIcon } from "lucide-react";
import { UserActions } from "./UserActions";
import type { User } from "./types";

interface UserTableRowProps {
  user: User;
  currentUserId: string;
  onToggleActive: (userId: number, isActive: boolean) => void;
  onEdit: (user: User) => void;
  onDelete: (userId: number, userEmail: string) => void;
}

export function UserTableRow({
  user,
  currentUserId,
  onToggleActive,
  onEdit,
  onDelete,
}: UserTableRowProps) {
  const getRoleBadge = (role: string) => {
    const styles = {
      ADMIN: "bg-red-100 text-red-800 border-red-200",
      LEARNER: "bg-blue-100 text-blue-800 border-blue-200",
    };
    return styles[role as keyof typeof styles] || "bg-gray-100 text-gray-800 border-gray-200";
  };

  const getRoleIcon = (role: string) => {
    return role === "ADMIN" ? Crown : UserIcon;
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "Jamais";
    return new Date(dateString).toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const RoleIcon = getRoleIcon(user.role);

  return (
    <tr className="border-b border-gray-100 hover:bg-gray-50/50 transition-colors">
      <td className="px-6 py-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
            <UserIcon className="w-5 h-5 text-primary" />
          </div>
          <div>
            <p className="font-satoshi font-medium text-darkBlue">
              {user.firstName && user.lastName
                ? `${user.firstName} ${user.lastName}`
                : user.email}
            </p>
            <p className="text-sm text-gray-500">{user.email}</p>
          </div>
        </div>
      </td>

      <td className="px-6 py-4">
        <div
          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-satoshi font-medium border ${getRoleBadge(
            user.role
          )}`}
        >
          <RoleIcon className="w-3 h-3 mr-1" />
          {user.role === "ADMIN" ? "Admin" : "Apprenant"}
        </div>
      </td>

      <td className="px-6 py-4">
        <div className="flex items-center space-x-2">
          <div
            className={`w-2 h-2 rounded-full ${
              user.isActive ? "bg-green-500" : "bg-red-500"
            }`}
          ></div>
          <span
            className={`text-sm font-satoshi ${
              user.isActive ? "text-green-700" : "text-red-700"
            }`}
          >
            {user.isActive ? "Actif" : "Inactif"}
          </span>
        </div>
      </td>

      <td className="px-6 py-4">
        <span className="text-sm font-satoshi text-darkBlue">
          {user._count.supportGroupMemberships} groupe
          {user._count.supportGroupMemberships > 1 ? "s" : ""}
        </span>
      </td>

      <td className="px-6 py-4">
        <span className="text-sm font-satoshi text-gray-600">
          {formatDate(user.lastLoginAt)}
        </span>
      </td>

      <td className="px-6 py-4">
        <UserActions
          user={user}
          currentUserId={currentUserId}
          onToggleActive={onToggleActive}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      </td>
    </tr>
  );
}
