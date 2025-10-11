"use client";

import Button from "@/components/UI/Button";
import { RefreshCw } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  UsersTable,
  UserFilters,
  UserForm,
  useUsersManagement,
} from "./components";

export default function AdminUsersPage() {
  const router = useRouter();
  const {
    users,
    pagination,
    isLoading,
    searchTerm,
    selectedRole,
    currentPage,
    editingUser,
    showEditModal,
    session,
    status,
    setSearchTerm,
    setCurrentPage,
    handleSearch,
    handleRoleFilter,
    handleUpdateUser,
    handleDeleteUser,
    openEditModal,
    closeEditModal,
    fetchUsers,
  } = useUsersManagement();

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
        {/* Search and filters */}
        <UserFilters
          searchTerm={searchTerm}
          selectedRole={selectedRole}
          pagination={pagination}
          onSearchChange={setSearchTerm}
          onSearchSubmit={handleSearch}
          onRoleFilter={handleRoleFilter}
        />

        {/* Users list */}
        <UsersTable
          users={users}
          pagination={pagination}
          currentUserId={session.user.id}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
          onToggleActive={(userId, isActive) => handleUpdateUser(userId, { isActive })}
          onEdit={openEditModal}
          onDelete={handleDeleteUser}
        />

        {/* Edit modal */}
        {showEditModal && editingUser && (
          <UserForm
            user={editingUser}
            isOpen={showEditModal}
            onClose={closeEditModal}
            onSubmit={handleUpdateUser}
          />
        )}
      </div>
    </div>
  );
}
