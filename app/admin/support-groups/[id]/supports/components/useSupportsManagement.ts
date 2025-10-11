"use client";

import { useState, useCallback } from "react";
import { Support, GroupDetail, SupportFormData } from "./types";

interface UseSupportsManagementProps {
  groupId: string;
  onRefresh: () => void;
}

export function useSupportsManagement({
  groupId,
  onRefresh,
}: UseSupportsManagementProps) {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingSupport, setEditingSupport] = useState<Support | null>(null);

  const resetForm = useCallback(() => {
    setShowCreateForm(false);
    setEditingSupport(null);
  }, []);

  const handleCreateSupport = useCallback(
    async (formData: SupportFormData, trainingId: number) => {
      // Validation côté client
      if (!formData.title.trim()) {
        alert("Le titre est requis");
        return;
      }

      if (!formData.type) {
        alert("Le type de fichier est requis");
        return;
      }

      if (!formData.fileUrl.trim()) {
        alert("Veuillez d'abord uploader un fichier ou saisir une URL");
        return;
      }

      if (!trainingId) {
        alert("Formation non trouvée");
        return;
      }

      try {
        const payload = {
          ...formData,
          trainingId,
          fileSize: formData.fileSize ? parseInt(formData.fileSize) : undefined,
        };

        const response = await fetch("/api/admin/supports", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });

        if (response.ok) {
          alert("Support créé avec succès !");
          resetForm();
          onRefresh();
        } else {
          const result = await response.json();
          alert(result.error || "Erreur lors de la création");
        }
      } catch (error) {
        console.error("Erreur:", error);
        alert("Erreur lors de la création");
      }
    },
    [resetForm, onRefresh]
  );

  const handleEditSupport = useCallback((support: Support) => {
    setEditingSupport(support);
    setShowCreateForm(true);
  }, []);

  const handleUpdateSupport = useCallback(
    async (formData: SupportFormData, supportId: number) => {
      try {
        const payload = {
          ...formData,
          fileSize: formData.fileSize ? parseInt(formData.fileSize) : undefined,
        };

        const response = await fetch(`/api/admin/supports/${supportId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });

        if (response.ok) {
          alert("Support modifié avec succès !");
          resetForm();
          onRefresh();
        } else {
          const result = await response.json();
          alert(result.error || "Erreur lors de la modification");
        }
      } catch (error) {
        console.error("Erreur:", error);
        alert("Erreur lors de la modification");
      }
    },
    [resetForm, onRefresh]
  );

  const handleDeleteSupport = useCallback(
    async (supportId: number) => {
      if (!confirm("Êtes-vous sûr de vouloir supprimer ce support ?")) {
        return;
      }

      try {
        const response = await fetch(`/api/admin/supports/${supportId}`, {
          method: "DELETE",
        });

        if (response.ok) {
          alert("Support supprimé avec succès !");
          onRefresh();
        } else {
          alert("Erreur lors de la suppression");
        }
      } catch (error) {
        console.error("Erreur:", error);
        alert("Erreur lors de la suppression");
      }
    },
    [onRefresh]
  );

  return {
    showCreateForm,
    setShowCreateForm,
    editingSupport,
    resetForm,
    handleCreateSupport,
    handleEditSupport,
    handleUpdateSupport,
    handleDeleteSupport,
  };
}
