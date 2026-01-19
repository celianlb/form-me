import { useCallback, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import type { User, UsersResponse, Pagination } from "./types";

export function useUsersManagement() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [users, setUsers] = useState<User[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  // Filters and search
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRole, setSelectedRole] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);

  // Edit modal state
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);

  const fetchUsers = useCallback(async (page = 1, search = searchTerm, role = selectedRole) => {
    try {
      setIsLoading(true);
      const params = new URLSearchParams({
        page: page.toString(),
        limit: "20",
        ...(search && { search }),
        ...(role !== "all" && { role }),
      });

      const response = await fetch(`/api/admin/users?${params}`);
      if (response.ok) {
        const data: UsersResponse = await response.json();
        setUsers(data.users);
        setPagination(data.pagination);
      } else {
        setError("Erreur lors du chargement des utilisateurs");
      }
    } catch (error) {
      console.error("Erreur:", error);
      setError("Erreur lors du chargement des utilisateurs");
    } finally {
      setIsLoading(false);
    }
  }, [searchTerm, selectedRole]);

  useEffect(() => {
    if (status === "loading") return;

    if (!session?.user || session.user.role !== "ADMIN") {
      router.push("/auth/signin");
      return;
    }

    fetchUsers(currentPage);
  }, [session, status, router, currentPage, fetchUsers]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchUsers(1, searchTerm, selectedRole);
  };

  const handleRoleFilter = (role: string) => {
    setSelectedRole(role);
    setCurrentPage(1);
    fetchUsers(1, searchTerm, role);
  };

  const handleUpdateUser = async (userId: number, updates: Partial<User>) => {
    try {
      const response = await fetch("/api/admin/users", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, updates }),
      });

      if (response.ok) {
        await fetchUsers(currentPage);
        alert("Utilisateur mis à jour avec succès");
      } else {
        const result = await response.json();
        alert(result.error || "Erreur lors de la mise à jour");
      }
    } catch (error) {
      console.error("Erreur:", error);
      alert("Erreur lors de la mise à jour");
    }
  };

  const handleDeleteUser = async (userId: number, userEmail: string) => {
    if (!confirm(`Êtes-vous sûr de vouloir supprimer l'utilisateur ${userEmail} ?`)) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/users?userId=${userId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        await fetchUsers(currentPage);
        alert("Utilisateur supprimé avec succès");
      } else {
        const result = await response.json();
        alert(result.error || "Erreur lors de la suppression");
      }
    } catch (error) {
      console.error("Erreur:", error);
      alert("Erreur lors de la suppression");
    }
  };

  const openEditModal = (user: User) => {
    setEditingUser(user);
    setShowEditModal(true);
  };

  const closeEditModal = () => {
    setShowEditModal(false);
    setEditingUser(null);
  };

  return {
    // State
    users,
    pagination,
    isLoading,
    error,
    searchTerm,
    selectedRole,
    currentPage,
    editingUser,
    showEditModal,
    session,
    status,

    // Actions
    setSearchTerm,
    setCurrentPage,
    handleSearch,
    handleRoleFilter,
    handleUpdateUser,
    handleDeleteUser,
    openEditModal,
    closeEditModal,
    fetchUsers,
  };
}
