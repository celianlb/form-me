"use client";

import Button from "@/components/UI/Button";
import {
  GroupForm,
  GroupHeader,
  GroupInfo,
  GroupStats,
  useGroupManagement,
} from "./components";

export default function GroupDetailPage() {
  const {
    session,
    status,
    router,
    group,
    isLoading,
    error,
    handleDeleteGroup,
    resendInvitations,
  } = useGroupManagement();

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

  if (error || !group) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">❌</div>
          <h3 className="text-xl font-satoshi font-semibold text-darkBlue mb-2">
            {error || "Groupe non trouvé"}
          </h3>
          <Button
            onClick={() => router.push("/admin/support-groups")}
            variant="secondary"
          >
            Retour aux groupes
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-32 px-[48px] md:px-[120px]">
      {/* Header */}
      <GroupHeader
        group={group}
        onBack={() => router.push("/admin/support-groups")}
        onEdit={() => router.push(`/admin/support-groups/${group.id}/edit`)}
        onDelete={handleDeleteGroup}
      />

      {/* Content */}
      <div className="max-w-7xl mx-auto py-8">
        {/* Group Stats */}
        <GroupStats group={group} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Sidebar - Informations et actions */}
          <div className="lg:col-span-1">
            <GroupInfo
              group={group}
              onResendInvitations={resendInvitations}
              onManageSupports={() =>
                router.push(`/admin/support-groups/${group.id}/supports`)
              }
              onManageMembers={() =>
                router.push(`/admin/support-groups/${group.id}/members`)
              }
            />
          </div>

          {/* Main Content - Members & Supports */}
          <GroupForm
            group={group}
            onManageSupports={() =>
              router.push(`/admin/support-groups/${group.id}/supports`)
            }
          />
        </div>
      </div>
    </div>
  );
}
