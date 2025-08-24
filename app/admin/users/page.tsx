"use client";

import Button from "@/components/UI/Button";
import {
  Search,
  Filter,
  Edit2,
  Trash2,
  UserCheck,
  UserX,
  Crown,
  User,
  Users as UsersIcon,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
} from "lucide-react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

interface User {
  id: number;
  email: string;
  firstName?: string;
  lastName?: string;
  role: string;
  isActive: boolean;
  mustChangePassword: boolean;
  createdAt: string;
  lastLoginAt?: string;
  _count: {
    supportGroupMemberships: number;
  };
}

interface UsersResponse {
  users: User[];
  pagination: {
    page: number;
    limit: number;
    totalCount: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

export default function AdminUsersPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [pagination, setPagination] = useState<UsersResponse['pagination'] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [, setError] = useState("");
  
  // Filtres et recherche
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRole, setSelectedRole] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  
  // États pour les modales et actions
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

  const getRoleBadge = (role: string) => {
    const styles = {
      ADMIN: "bg-red-100 text-red-800 border-red-200",
      LEARNER: "bg-blue-100 text-blue-800 border-blue-200",
    };
    return styles[role as keyof typeof styles] || "bg-gray-100 text-gray-800 border-gray-200";
  };

  const getRoleIcon = (role: string) => {
    return role === "ADMIN" ? Crown : User;
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

  if (status === "loading" || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p>Chargement...</p>
        </div>
      </div>
    );
  }

  if (!session?.user || session.user.role !== "ADMIN") {
    return null;
  }

  return (
    <div className="mt-32 px-[48px] md:px-[120px]">
      {/* Header */}
      <div className="">
        <div>
          <div className="flex flex-col md:flex-row justify-between gap-4 items-start md:items-center py-6">
            <div>
              <h1 className="text-3xl font-satoshi font-bold text-darkBlue">
                Gestion des Utilisateurs
              </h1>
              <p className="text-gray-600">
                {pagination ? `${pagination.totalCount} utilisateurs` : ""}
              </p>
            </div>
            <div className="flex space-x-3">
              <Button
                onClick={() => router.push("/admin/dashboard")}
                variant="outline"
              >
                ← Retour au dashboard
              </Button>
              <Button
                onClick={() => fetchUsers(currentPage)}
                variant="secondary"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Actualiser
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto py-8">
        {/* Recherche et filtres */}
        <div className="bg-white rounded-2xl shadow-sm border border-primary/20 overflow-hidden mb-8">
          <div className="relative p-8 bg-gradient-to-r from-white to-primary/5 border-b border-b-grayBlue/20">
            <Image
              src="/formation/dot-pattern.svg"
              width={150}
              height={150}
              alt=""
              className="absolute top-0 right-0"
            />
            <h2 className="text-2xl font-satoshi font-bold text-darkBlue mb-2">
              Recherche et Filtres
            </h2>
            <p className="text-gray-600">
              Trouvez rapidement l&apos;utilisateur que vous cherchez
            </p>
          </div>

          <div className="p-8">
            <form onSubmit={handleSearch} className="space-y-6">
              {/* Barre de recherche */}
              <div className="flex gap-4">
                <div className="flex-1">
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Rechercher par email, prénom ou nom..."
                    className="w-full px-4 py-3 border border-grayBlue/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent font-satoshi"
                  />
                </div>
                <Button type="submit" variant="primary">
                  <Search className="w-4 h-4 mr-2" />
                  Rechercher
                </Button>
              </div>

              {/* Filtres par rôle */}
              <div>
                <label className="block text-sm font-satoshi font-medium text-darkBlue mb-3">
                  Filtrer par rôle
                </label>
                <div className="flex flex-wrap gap-3">
                  {[
                    { value: "all", label: "Tous", count: pagination?.totalCount },
                    { value: "ADMIN", label: "Administrateurs" },
                    { value: "LEARNER", label: "Apprenants" },
                  ].map((filter) => (
                    <button
                      key={filter.value}
                      type="button"
                      onClick={() => handleRoleFilter(filter.value)}
                      className={`px-4 py-2 rounded-xl border-2 text-sm font-satoshi font-medium transition-colors ${
                        selectedRole === filter.value
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-gray-200 text-gray-700 hover:border-gray-300"
                      }`}
                    >
                      <Filter className="w-4 h-4 inline mr-2" />
                      {filter.label}
                      {filter.count && ` (${filter.count})`}
                    </button>
                  ))}
                </div>
              </div>
            </form>
          </div>
        </div>

        {/* Liste des utilisateurs */}
        <div className="bg-white rounded-2xl shadow-sm border border-primary/20">
          <div className="p-6 border-b border-grayBlue/20">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-satoshi font-semibold text-darkBlue flex items-center">
                <UsersIcon className="w-5 h-5 mr-2 text-primary" />
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
                      <UsersIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                      <h4 className="text-lg font-satoshi font-medium text-darkBlue mb-2">
                        Aucun utilisateur trouvé
                      </h4>
                      <p className="text-gray-500">
                        Aucun utilisateur ne correspond à vos critères de recherche
                      </p>
                    </td>
                  </tr>
                ) : (
                  users.map((user) => {
                    const RoleIcon = getRoleIcon(user.role);
                    return (
                      <tr
                        key={user.id}
                        className="border-b border-gray-100 hover:bg-gray-50/50 transition-colors"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                              <User className="w-5 h-5 text-primary" />
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
                          <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-satoshi font-medium border ${getRoleBadge(user.role)}`}>
                            <RoleIcon className="w-3 h-3 mr-1" />
                            {user.role === "ADMIN" ? "Admin" : "Apprenant"}
                          </div>
                        </td>

                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-2">
                            <div className={`w-2 h-2 rounded-full ${user.isActive ? "bg-green-500" : "bg-red-500"}`}></div>
                            <span className={`text-sm font-satoshi ${user.isActive ? "text-green-700" : "text-red-700"}`}>
                              {user.isActive ? "Actif" : "Inactif"}
                            </span>
                          </div>
                        </td>

                        <td className="px-6 py-4">
                          <span className="text-sm font-satoshi text-darkBlue">
                            {user._count.supportGroupMemberships} groupe{user._count.supportGroupMemberships > 1 ? "s" : ""}
                          </span>
                        </td>

                        <td className="px-6 py-4">
                          <span className="text-sm font-satoshi text-gray-600">
                            {formatDate(user.lastLoginAt)}
                          </span>
                        </td>

                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => handleUpdateUser(user.id, { isActive: !user.isActive })}
                              className={`p-2 rounded-lg transition-colors ${
                                user.isActive
                                  ? "text-red-600 hover:bg-red-50"
                                  : "text-green-600 hover:bg-green-50"
                              }`}
                              title={user.isActive ? "Désactiver" : "Activer"}
                            >
                              {user.isActive ? <UserX className="w-4 h-4" /> : <UserCheck className="w-4 h-4" />}
                            </button>
                            
                            <button
                              onClick={() => {
                                setEditingUser(user);
                                setShowEditModal(true);
                              }}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              title="Modifier"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>

                            {user.id !== parseInt(session.user.id) && (
                              <button
                                onClick={() => handleDeleteUser(user.id, user.email)}
                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                title="Supprimer"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {pagination && pagination.totalPages > 1 && (
            <div className="p-6 border-t border-gray-100">
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-600">
                  Page {pagination.page} sur {pagination.totalPages} 
                  ({pagination.totalCount} utilisateurs au total)
                </p>
                <div className="flex items-center space-x-2">
                  <Button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={!pagination.hasPreviousPage}
                    variant="outline"
                    className="text-sm"
                  >
                    <ChevronLeft className="w-4 h-4 mr-1" />
                    Précédent
                  </Button>
                  <Button
                    onClick={() => setCurrentPage(Math.min(pagination.totalPages, currentPage + 1))}
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

        {/* Modal d'édition */}
        {showEditModal && editingUser && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl shadow-xl max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-xl font-satoshi font-bold text-darkBlue">
                  Modifier l&apos;utilisateur
                </h3>
                <p className="text-gray-600 text-sm">{editingUser.email}</p>
              </div>
              
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const formData = new FormData(e.target as HTMLFormElement);
                  const updates = {
                    firstName: formData.get('firstName')?.toString() || '',
                    lastName: formData.get('lastName')?.toString() || '',
                    role: formData.get('role')?.toString(),
                    mustChangePassword: formData.get('mustChangePassword') === 'on',
                  };
                  
                  handleUpdateUser(editingUser.id, updates);
                  setShowEditModal(false);
                  setEditingUser(null);
                }}
                className="p-6 space-y-4"
              >
                <div>
                  <label className="block text-sm font-satoshi font-medium text-darkBlue mb-2">
                    Prénom
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    defaultValue={editingUser.firstName || ''}
                    className="w-full px-4 py-3 border border-grayBlue/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent font-satoshi"
                    placeholder="Prénom"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-satoshi font-medium text-darkBlue mb-2">
                    Nom
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    defaultValue={editingUser.lastName || ''}
                    className="w-full px-4 py-3 border border-grayBlue/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent font-satoshi"
                    placeholder="Nom"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-satoshi font-medium text-darkBlue mb-2">
                    Rôle
                  </label>
                  <select
                    name="role"
                    defaultValue={editingUser.role}
                    className="w-full px-4 py-3 border border-grayBlue/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent font-satoshi"
                  >
                    <option value="LEARNER">Apprenant</option>
                    <option value="ADMIN">Administrateur</option>
                  </select>
                </div>
                
                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    name="mustChangePassword"
                    id="mustChangePassword"
                    defaultChecked={editingUser.mustChangePassword}
                    className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                  />
                  <label htmlFor="mustChangePassword" className="text-sm font-satoshi text-darkBlue">
                    Doit changer de mot de passe à la prochaine connexion
                  </label>
                </div>
                
                <div className="flex justify-end space-x-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setShowEditModal(false);
                      setEditingUser(null);
                    }}
                  >
                    Annuler
                  </Button>
                  <Button type="submit" variant="primary">
                    Enregistrer
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}