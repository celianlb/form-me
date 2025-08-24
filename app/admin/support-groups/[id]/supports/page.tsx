"use client";

import Button from "@/components/UI/Button";
import FileUpload from "@/components/UI/FileUpload";
import { 
  FileText, 
  Plus, 
  Download, 
  Edit2, 
  Trash2, 
  FolderOpen,
  Save,
  X,
  Presentation,
  Video,
  Link as LinkIcon,
  File
} from "lucide-react";
import { useSession } from "next-auth/react";
import Image from "next/image";
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
  const [uploadMethod, setUploadMethod] = useState<"upload" | "url">("upload");

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
    setUploadMethod("upload");
    setShowCreateForm(false);
    setEditingSupport(null);
  };

  const handleFileUploaded = (fileData: {
    url: string;
    size: number;
    type: string;
    originalName: string;
  }) => {
    setFormData(prev => ({
      ...prev,
      title: prev.title || fileData.originalName,
      fileUrl: fileData.url,
      fileSize: fileData.size.toString(),
      type: fileData.type
    }));
  };

  const handleCreateSupport = async (e: React.FormEvent) => {
    e.preventDefault();

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

    console.log("Group data:", group); // Debug
    console.log("Training ID:", group?.training?.id); // Debug
    
    if (!group?.training?.id) {
      alert("Formation non trouvée");
      return;
    }

    try {
      const payload = {
        ...formData,
        trainingId: group.training.id,
        fileSize: formData.fileSize ? parseInt(formData.fileSize) : undefined,
      };

      console.log("Payload envoyé:", payload); // Debug

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
    // Si le fichier est hébergé sur Cloudinary, on peut utiliser l'upload, sinon URL
    setUploadMethod(support.fileUrl.includes('cloudinary.com') ? "upload" : "url");
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
      case "doc":
      case "docx":
        return FileText;
      case "ppt":
      case "pptx":
        return Presentation;
      case "xls":
      case "xlsx":
        return FileText;
      case "video":
        return Video;
      case "link":
        return LinkIcon;
      default:
        return File;
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
    <div className="mt-32 px-[48px] md:px-[120px]">
      {/* Header */}
      <div className="">
        <div>
          <div className="flex flex-col md:flex-row justify-between gap-4 items-start md:items-center py-6">
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
                variant="primary"
              >
                <Plus className="w-4 h-4 mr-2" />
                Ajouter un support
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto py-8">
        {/* Formulaire de création/édition */}
        {showCreateForm && (
          <div className="bg-white rounded-2xl shadow-sm border border-primary/20 overflow-hidden mb-8">
            {/* Header du formulaire */}
            <div className="relative p-8 bg-gradient-to-r from-white to-primary/5 border-b border-b-grayBlue/20">
              <Image
                src="/formation/dot-pattern.svg"
                width={150}
                height={150}
                alt=""
                className="absolute top-0 right-0"
              />
              <h3 className="text-2xl font-satoshi font-bold text-darkBlue mb-2">
                {editingSupport
                  ? "Modifier le support"
                  : "Ajouter un nouveau support"}
              </h3>
              <p className="text-gray-600">
                {editingSupport 
                  ? "Modifiez les informations du support"
                  : "Ajoutez un nouveau support pour cette formation"
                }
              </p>
            </div>

            <div className="p-8">
              <form
                onSubmit={
                  editingSupport ? handleUpdateSupport : handleCreateSupport
                }
                className="space-y-8"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label
                      htmlFor="title"
                      className="block text-sm font-satoshi font-medium text-darkBlue mb-2"
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
                      className="w-full px-4 py-3 border border-grayBlue/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent font-satoshi"
                      placeholder="Ex: Guide de formation Excel"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="type"
                      className="block text-sm font-satoshi font-medium text-darkBlue mb-2"
                    >
                      Type *
                    </label>
                    <select
                      id="type"
                      name="type"
                      value={formData.type}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-grayBlue/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent font-satoshi bg-white"
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

                {/* Méthode d'ajout du fichier */}
                <div>
                  <label className="block text-sm font-satoshi font-medium text-darkBlue mb-4">
                    Méthode d&apos;ajout du fichier *
                  </label>
                  <div className="flex space-x-4 mb-6">
                    <button
                      type="button"
                      onClick={() => setUploadMethod("upload")}
                      className={`flex-1 px-4 py-3 rounded-xl border-2 text-sm font-satoshi font-medium transition-colors ${
                        uploadMethod === "upload"
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-gray-200 text-gray-700 hover:border-gray-300"
                      }`}
                    >
                      📤 Upload fichier
                    </button>
                    <button
                      type="button"
                      onClick={() => setUploadMethod("url")}
                      className={`flex-1 px-4 py-3 rounded-xl border-2 text-sm font-satoshi font-medium transition-colors ${
                        uploadMethod === "url"
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-gray-200 text-gray-700 hover:border-gray-300"
                      }`}
                    >
                      🔗 URL externe
                    </button>
                  </div>

                  {uploadMethod === "upload" ? (
                    <div>
                      <label className="block text-sm font-satoshi font-medium text-darkBlue mb-3">
                        Fichier à uploader *
                      </label>
                      <FileUpload onFileUploaded={handleFileUploaded} />
                    </div>
                  ) : (
                    <div>
                      <label
                        htmlFor="fileUrl"
                        className="block text-sm font-satoshi font-medium text-darkBlue mb-2"
                      >
                        URL du fichier *
                      </label>
                      <input
                        type="url"
                        id="fileUrl"
                        name="fileUrl"
                        value={formData.fileUrl}
                        onChange={handleInputChange}
                        required={uploadMethod === "url"}
                        className="w-full px-4 py-3 border border-grayBlue/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent font-satoshi"
                        placeholder="https://example.com/fichier.pdf"
                      />
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label
                      htmlFor="description"
                      className="block text-sm font-satoshi font-medium text-darkBlue mb-2"
                    >
                      Description
                    </label>
                    <textarea
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      rows={4}
                      className="w-full px-4 py-3 border border-grayBlue/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent font-satoshi resize-none"
                      placeholder="Description du support..."
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="fileSize"
                      className="block text-sm font-satoshi font-medium text-darkBlue mb-2"
                    >
                      Taille du fichier (en bytes)
                    </label>
                    <input
                      type="number"
                      id="fileSize"
                      name="fileSize"
                      value={formData.fileSize}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-grayBlue/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent font-satoshi"
                      placeholder="Ex: 2048000"
                    />
                  </div>
                </div>

                <div className="flex justify-end space-x-4 pt-6 border-t">
                  <Button type="button" onClick={resetForm} variant="outline">
                    <X className="w-4 h-4 mr-2" />
                    Annuler
                  </Button>
                  <Button type="submit" variant="primary">
                    <Save className="w-4 h-4 mr-2" />
                    {editingSupport ? "Enregistrer les modifications" : "Créer le support"}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Liste des supports */}
        <div className="bg-white rounded-2xl shadow-sm border border-primary/20">
          <div className="p-6 border-b border-grayBlue/20">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-satoshi font-semibold text-darkBlue flex items-center">
                <FolderOpen className="w-5 h-5 mr-2 text-primary" />
                Supports disponibles ({group.training.supports.length})
              </h3>
              {group.training.supports.length > 0 && !showCreateForm && (
                <Button
                  onClick={() => setShowCreateForm(true)}
                  variant="secondary"
                  className="text-sm"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Ajouter
                </Button>
              )}
            </div>
          </div>
          <div className="p-6">
            {group.training.supports.length === 0 ? (
              <div className="text-center py-12">
                <FolderOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h4 className="text-lg font-satoshi font-medium text-darkBlue mb-2">
                  Aucun support disponible
                </h4>
                <p className="text-gray-500 mb-6">
                  Commencez par ajouter le premier support pour cette formation
                </p>
                <Button
                  onClick={() => setShowCreateForm(true)}
                  variant="primary"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Ajouter le premier support
                </Button>
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                {group.training.supports.map((support) => {
                  const IconComponent = getFileTypeIcon(support.type);
                  return (
                    <div
                      key={support.id}
                      className="group border border-gray-100 rounded-xl p-6 hover:border-primary/30 hover:shadow-lg transition-all duration-200"
                    >
                      <div className="flex items-start space-x-4 mb-4">
                        <div className="p-3 bg-primary/10 rounded-full">
                          <IconComponent className="w-6 h-6 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-satoshi font-semibold text-darkBlue truncate mb-1">
                            {support.title}
                          </h4>
                          <div className="text-xs font-satoshi text-grayBlue bg-gray-50 px-2 py-1 rounded-md inline-block">
                            {support.type.toUpperCase()}
                            {support.fileSize &&
                              ` • ${formatFileSize(Number(support.fileSize))}`}
                          </div>
                        </div>
                      </div>

                      {support.description && (
                        <p className="text-sm font-satoshi text-grayBlue mb-4 leading-relaxed">
                          {support.description}
                        </p>
                      )}

                      <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                        <a
                          href={support.fileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center text-sm font-satoshi font-medium text-primary hover:text-primary/80 transition-colors"
                        >
                          <Download className="w-4 h-4 mr-1" />
                          {support.type === "link" ? "Ouvrir" : "Télécharger"}
                        </a>

                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleEditSupport(support)}
                            className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Modifier"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteSupport(support.id)}
                            className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Supprimer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
