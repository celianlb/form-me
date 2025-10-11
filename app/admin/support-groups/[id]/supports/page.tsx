"use client";

import { useSession } from "next-auth/react";
import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { GroupDetail, SupportFormData } from "./components/types";
import { useSupportsManagement } from "./components/useSupportsManagement";
import LoadingState from "./components/LoadingState";
import ErrorState from "./components/ErrorState";
import PageHeader from "./components/PageHeader";
import SupportForm from "./components/SupportForm";
import SupportsListSection from "./components/SupportsListSection";

export default function GroupSupportsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const params = useParams();
  const [group, setGroup] = useState<GroupDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchGroupDetail = useCallback(async () => {
    try {
      const response = await fetch(`/api/admin/support-groups/${params.id}`);
      if (response.ok) {
        const data = await response.json();
        setGroup(data);
      } else {
        setError("Groupe non trouvé");
      }
    } catch (error) {
      console.error("Erreur lors du chargement:", error);
      setError("Erreur lors du chargement");
    } finally {
      setIsLoading(false);
    }
  }, [params.id]);

  const {
    showCreateForm,
    setShowCreateForm,
    editingSupport,
    resetForm,
    handleCreateSupport,
    handleEditSupport,
    handleUpdateSupport,
    handleDeleteSupport,
  } = useSupportsManagement({
    groupId: params.id as string,
    onRefresh: fetchGroupDetail,
  });

  useEffect(() => {
    if (status === "loading") return;

    if (!session?.user || session.user.role !== "ADMIN") {
      router.push("/auth/signin");
      return;
    }

    fetchGroupDetail();
  }, [session, status, router, params.id, fetchGroupDetail]);

  const handleFormSubmit = async (formData: SupportFormData) => {
    if (editingSupport) {
      await handleUpdateSupport(formData, editingSupport.id);
    } else {
      await handleCreateSupport(formData, group?.training?.id || 0);
    }
  };

  const handleBackToGroups = () => {
    router.push("/admin/support-groups");
  };

  const handleBackToGroup = () => {
    router.push(`/admin/support-groups/${params.id}`);
  };

  const handleToggleForm = () => {
    setShowCreateForm(!showCreateForm);
  };

  // Loading state
  if (status === "loading" || isLoading) {
    return <LoadingState />;
  }

  // Auth check
  if (!session?.user || session.user.role !== "ADMIN") {
    return null;
  }

  // Error state
  if (error || !group) {
    return <ErrorState error={error} onBack={handleBackToGroups} />;
  }

  return (
    <div className="mt-32 px-[48px] md:px-[120px]">
      {/* Header */}
      <div className="">
        <div>
          <PageHeader
            groupName={group.name}
            companyName={group.companyName}
            trainingTitle={group.training.title}
            onBack={handleBackToGroup}
            onAddSupport={handleToggleForm}
          />
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto py-8">
        {/* Formulaire de création/édition */}
        {showCreateForm && (
          <SupportForm
            editingSupport={editingSupport}
            onSubmit={handleFormSubmit}
            onCancel={resetForm}
          />
        )}

        {/* Liste des supports */}
        <SupportsListSection
          supports={group.training.supports}
          showCreateForm={showCreateForm}
          onEdit={handleEditSupport}
          onDelete={handleDeleteSupport}
          onAddClick={() => setShowCreateForm(true)}
        />
      </div>
    </div>
  );
}
