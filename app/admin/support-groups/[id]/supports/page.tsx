"use client";

import Button from "@/components/UI/Button";
import { useSession } from "next-auth/react";
import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

interface Support {
  id: number;
  title: string;
  description?: string;
  type: string;
  fileUrl: string;
  fileSize?: number;
  isActive: boolean;
  createdAt: string;
}

interface GroupDetail {
  id: number;
  name: string;
  companyName: string;
  training: {
    id: number;
    title: string;
    supports: Support[];
  };
}

export default function GroupSupportsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const params = useParams();
  const [group, setGroup] = useState<GroupDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingSupport, setEditingSupport] = useState<Support | null>(null);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    type: "pdf",
    fileUrl: "",
    fileSize: "",
  });

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

  useEffect(() => {
    if (status === "loading") return;

    if (!session?.user || session.user.role !== "ADMIN") {
      router.push("/auth/signin");
      return;
    }

    fetchGroupDetail();
  }, [session, status, router, params.id, fetchGroupDetail]);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      type: "pdf",
      fileUrl: "",
      fileSize: "",
    });
    setShowCreateForm(false);
    setEditingSupport(null);
  };

  const handleCreateSupport = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const payload = {
        ...formData,
        trainingId: group?.training.id,
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
        fetchGroupDetail(); // Recharger les données
      } else {
        const result = await response.json();
        alert(result.error || "Erreur lors de la création");
      }
    } catch (error) {
      console.error("Erreur:", error);
      alert("Erreur lors de la création");
    }
  };

  const handleEditSupport = (support: Support) => {
    setEditingSupport(support);
    setFormData({
      title: support.title,
      description: support.description || "",
      type: support.type,
      fileUrl: support.fileUrl,
      fileSize: support.fileSize?.toString() || "",
    });
    setShowCreateForm(true);
  };

  const handleUpdateSupport = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!editingSupport) return;

    try {
      const payload = {
        ...formData,
        fileSize: formData.fileSize ? parseInt(formData.fileSize) : undefined,
      };

      const response = await fetch(`/api/admin/supports/${editingSupport.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        alert("Support modifié avec succès !");
        resetForm();
        fetchGroupDetail(); // Recharger les données
      } else {
        const result = await response.json();
        alert(result.error || "Erreur lors de la modification");
      }
    } catch (error) {
      console.error("Erreur:", error);
      alert("Erreur lors de la modification");
    }
  };

  const handleDeleteSupport = async (supportId: number) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer ce support ?")) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/supports/${supportId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        alert("Support supprimé avec succès !");
        fetchGroupDetail(); // Recharger les données
      } else {
        alert("Erreur lors de la suppression");
      }
    } catch (error) {
      console.error("Erreur:", error);
      alert("Erreur lors de la suppression");
    }
  };

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return "";
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round((bytes / Math.pow(1024, i)) * 100) / 100 + " " + sizes[i];
  };

  const getFileTypeIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case "pdf":
        return "📄";
      case "ppt":
      case "pptx":
        return "📊";
      case "doc":
      case "docx":
        return "📝";
      case "xls":
      case "xlsx":
        return "📈";
      case "video":
        return "🎥";
      case "link":
        return "🔗";
      default:
        return "📁";
    }
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
    <div className="mt-32 bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-satoshi font-bold text-darkBlue">
                Supports - {group.name}
              </h1>
              <p className="text-gray-600">
                {group.companyName} • {group.training.title}
              </p>
            </div>
            <div className="flex space-x-3">
              <Button
                onClick={() =>
                  router.push(`/admin/support-groups/${params.id}`)
                }
                variant="outline"
              >
                ← Retour au groupe
              </Button>
              <Button
                onClick={() => setShowCreateForm(!showCreateForm)}
                variant="secondary"
              >
                + Ajouter un support
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Formulaire de création/édition */}
        {showCreateForm && (
          <div className="bg-white rounded-xl shadow-sm border p-6 mb-8">
            <h3 className="text-lg font-satoshi font-semibold text-darkBlue mb-4">
              {editingSupport
                ? "Modifier le support"
                : "Ajouter un nouveau support"}
            </h3>

            <form
              onSubmit={
                editingSupport ? handleUpdateSupport : handleCreateSupport
              }
              className="space-y-4"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="title"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Titre *
                  </label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div>
                  <label
                    htmlFor="type"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Type *
                  </label>
                  <select
                    id="type"
                    name="type"
                    value={formData.type}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="pdf">PDF</option>
                    <option value="ppt">PowerPoint</option>
                    <option value="pptx">PowerPoint (PPTX)</option>
                    <option value="doc">Word</option>
                    <option value="docx">Word (DOCX)</option>
                    <option value="xls">Excel</option>
                    <option value="xlsx">Excel (XLSX)</option>
                    <option value="video">Vidéo</option>
                    <option value="link">Lien</option>
                    <option value="other">Autre</option>
                  </select>
                </div>
              </div>

              <div>
                <label
                  htmlFor="fileUrl"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  URL du fichier *
                </label>
                <input
                  type="url"
                  id="fileUrl"
                  name="fileUrl"
                  value={formData.fileUrl}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="https://example.com/fichier.pdf"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="description"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Description
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div>
                  <label
                    htmlFor="fileSize"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Taille du fichier (en bytes)
                  </label>
                  <input
                    type="number"
                    id="fileSize"
                    name="fileSize"
                    value={formData.fileSize}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <Button type="button" onClick={resetForm} variant="primary">
                  Annuler
                </Button>
                <Button type="submit" variant="secondary">
                  {editingSupport ? "Modifier" : "Créer"}
                </Button>
              </div>
            </form>
          </div>
        )}

        {/* Liste des supports */}
        <div className="bg-white rounded-xl shadow-sm border">
          <div className="p-6 border-b">
            <h3 className="text-lg font-satoshi font-semibold text-darkBlue">
              Supports disponibles ({group.training.supports.length})
            </h3>
          </div>
          <div className="p-6">
            {group.training.supports.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-6xl mb-4">📁</div>
                <p className="text-gray-500">Aucun support disponible</p>
                <Button
                  onClick={() => setShowCreateForm(true)}
                  variant="secondary"
                  className="mt-4"
                >
                  Ajouter le premier support
                </Button>
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {group.training.supports.map((support) => (
                  <div
                    key={support.id}
                    className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start space-x-3 mb-3">
                      <span className="text-2xl flex-shrink-0">
                        {getFileTypeIcon(support.type)}
                      </span>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-darkBlue truncate">
                          {support.title}
                        </h4>
                        {support.description && (
                          <p className="text-sm text-gray-600 mt-1">
                            {support.description}
                          </p>
                        )}
                        <div className="text-xs text-gray-500 mt-2">
                          {support.type.toUpperCase()}
                          {support.fileSize &&
                            ` • ${formatFileSize(Number(support.fileSize))}`}
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-between items-center">
                      <a
                        href={support.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-primary hover:underline"
                      >
                        {support.type === "link" ? "Ouvrir" : "Télécharger"}
                      </a>

                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEditSupport(support)}
                          className="text-xs text-blue-600 hover:underline"
                        >
                          Modifier
                        </button>
                        <button
                          onClick={() => handleDeleteSupport(support.id)}
                          className="text-xs text-red-600 hover:underline"
                        >
                          Supprimer
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
