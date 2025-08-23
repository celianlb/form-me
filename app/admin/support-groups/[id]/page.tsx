"use client";

import Button from "@/components/UI/Button";
import {
  BarChart,
  ClipboardList,
  Edit,
  File,
  FileText,
  FolderOpen,
  Link,
  Mail,
  Trash2,
  Users,
  Video,
  Zap,
} from "lucide-react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

interface GroupDetail {
  id: number;
  name: string;
  companyName: string;
  trainingDate: string;
  isActive: boolean;
  createdAt: string;
  training: {
    title: string;
    supports: Array<{
      id: number;
      title: string;
      description?: string;
      type: string;
      fileUrl: string;
      fileSize?: number;
    }>;
  };
  members: Array<{
    id: number;
    status: string;
    invitedAt: string;
    acceptedAt?: string;
    user: {
      id: number;
      email: string;
      firstName?: string;
      lastName?: string;
      lastLoginAt?: string;
    };
  }>;
}

export default function GroupDetailPage() {
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
      console.error("Erreur lors du chargement du groupe:", error);
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

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return "";
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round((bytes / Math.pow(1024, i)) * 100) / 100 + " " + sizes[i];
  };

  const getFileTypeIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case "pdf":
        return <FileText className="w-6 h-6 text-red-500" />;
      case "ppt":
      case "pptx":
        return <BarChart className="w-6 h-6 text-orange-500" />;
      case "doc":
      case "docx":
        return <FileText className="w-6 h-6 text-blue-500" />;
      case "xls":
      case "xlsx":
        return <BarChart className="w-6 h-6 text-green-500" />;
      case "video":
        return <Video className="w-6 h-6 text-purple-500" />;
      case "link":
        return <Link className="w-6 h-6 text-blue-400" />;
      default:
        return <File className="w-6 h-6 text-gray-500" />;
    }
  };

  const handleDeleteGroup = async () => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer ce groupe ?")) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/support-groups/${params.id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        alert("Groupe supprimé avec succès");
        router.push("/admin/support-groups");
      } else {
        alert("Erreur lors de la suppression");
      }
    } catch (error) {
      console.error("Erreur:", error);
      alert("Erreur lors de la suppression");
    }
  };

  const resendInvitations = async () => {
    try {
      const pendingMembers =
        group?.members.filter((m) => m.status === "INVITED") || [];

      if (pendingMembers.length === 0) {
        alert("Aucune invitation en attente à renvoyer");
        return;
      }

      const response = await fetch("/api/admin/send-invitations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          groupId: group?.id,
          members: pendingMembers.map((m) => ({ userId: m.user.id })),
        }),
      });

      if (response.ok) {
        alert("Invitations renvoyées avec succès");
      } else {
        alert("Erreur lors de l'envoi des invitations");
      }
    } catch (error) {
      console.error("Erreur:", error);
      alert("Erreur lors de l'envoi des invitations");
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
                {group.name}
              </h1>
              <p className="text-gray-600">
                {group.companyName} • {group.training.title}
              </p>
            </div>
            <div className="flex space-x-3">
              <Button
                onClick={() => router.push("/admin/support-groups")}
                variant="outline"
              >
                ← Retour
              </Button>
              <Button
                onClick={() =>
                  router.push(`/admin/support-groups/${group.id}/edit`)
                }
                variant="primary"
              >
                <Edit className="w-4 h-4 mr-1" />
                Modifier
              </Button>
              <Button
                onClick={handleDeleteGroup}
                variant="outline"
                className="text-red-600 hover:bg-red-50 border-red-200"
              >
                <Trash2 className="w-4 h-4 mr-1" />
                Supprimer
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto py-8">
        {/* En-tête du groupe */}
        <div className="bg-white rounded-2xl shadow-sm border border-primary/20 overflow-hidden mb-8">
          <div className="relative p-8 bg-gradient-to-r from-white to-primary/5 border-b border-b-grayBlue/20">
            <Image
              src="/formation/dot-pattern.svg"
              width={150}
              height={150}
              alt=""
              className="absolute top-0 right-0"
            />
            <div className="flex flex-col lg:flex-row justify-between gap-6 items-start">
              <div className="flex-1">
                <h2 className="text-2xl font-satoshi font-bold text-darkBlue mb-2">
                  Détails du Groupe
                </h2>
                <div className="flex flex-col md:flex-row gap-2 text-sm">
                  <p className="bg-primary text-white px-3 py-1 rounded-full inline-block w-fit">
                    <strong>Entreprise :</strong> {group.companyName}
                  </p>
                  <p className="bg-primary/5 text-primary px-3 py-1 rounded-full inline-block w-fit">
                    <strong>Formation :</strong> {group.training.title}
                  </p>
                  <p className="bg-platinium/60 text-darkBlue px-3 py-1 rounded-full inline-block w-fit">
                    <strong>Date :</strong>{" "}
                    {new Date(group.trainingDate).toLocaleDateString("fr-FR")}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span
                  className={`px-4 py-2 rounded-full text-sm font-medium ${
                    group.isActive
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {group.isActive ? "✅ Actif" : "❌ Inactif"}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Sidebar - Informations et actions */}
          <div className="lg:col-span-1 space-y-6">
            {/* Informations du groupe */}
            <div className="bg-white rounded-2xl shadow-sm border border-primary/20 p-6">
              <h3 className="text-lg font-satoshi font-semibold text-darkBlue mb-4 flex items-center">
                <ClipboardList className="w-5 h-5 mr-2 text-primary" />
                Informations
              </h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div
                    className={`w-3 h-3 rounded-full ${
                      group.isActive ? "bg-green-500" : "bg-red-500"
                    }`}
                  ></div>
                  <div>
                    <p className="text-sm font-medium text-darkBlue">Statut</p>
                    <p className="text-xs text-gray-600">
                      {group.isActive ? "Groupe actif" : "Groupe inactif"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <div>
                    <p className="text-sm font-medium text-darkBlue">
                      Formation
                    </p>
                    <p className="text-xs text-gray-600">
                      {group.training.title}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                  <div>
                    <p className="text-sm font-medium text-darkBlue">Date</p>
                    <p className="text-xs text-gray-600">
                      {new Date(group.trainingDate).toLocaleDateString("fr-FR")}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
                  <div>
                    <p className="text-sm font-medium text-darkBlue">Créé le</p>
                    <p className="text-xs text-gray-600">
                      {new Date(group.createdAt).toLocaleDateString("fr-FR")}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions rapides */}
            <div className="bg-white rounded-2xl shadow-sm border border-primary/20 p-6">
              <h3 className="text-lg font-satoshi font-semibold text-darkBlue mb-4 flex items-center">
                <Zap className="w-5 h-5 mr-2 text-primary" />
                Actions Rapides
              </h3>
              <div className="space-y-3">
                <Button
                  onClick={resendInvitations}
                  variant="outline"
                  className="w-full justify-start"
                >
                  <Mail className="w-4 h-4 mr-2" />
                  Renvoyer les invitations
                </Button>
                <Button
                  onClick={() =>
                    router.push(`/admin/support-groups/${group.id}/supports`)
                  }
                  variant="outline"
                  className="w-full justify-start"
                >
                  <FolderOpen className="w-4 h-4 mr-2" />
                  Gérer les supports
                </Button>
                <Button
                  onClick={() =>
                    router.push(`/admin/support-groups/${group.id}/members`)
                  }
                  variant="outline"
                  className="w-full justify-start"
                >
                  <Users className="w-4 h-4 mr-2" />
                  Gérer les membres
                </Button>
              </div>
            </div>
          </div>

          {/* Contenu principal */}
          <div className="lg:col-span-2 space-y-6">
            {/* Membres */}
            <div className="bg-white rounded-2xl shadow-sm border border-primary/20 overflow-hidden">
              <div className="relative p-8 bg-gradient-to-r from-white to-emerald-50/50 border-b border-b-grayBlue/20">
                <Image
                  src="/formation/dot-pattern.svg"
                  width={120}
                  height={120}
                  alt=""
                  className="absolute top-0 right-0 opacity-30"
                />
                <h3 className="text-xl font-satoshi font-bold text-darkBlue mb-2 flex items-center">
                  <Users className="w-6 h-6 mr-2 text-emerald-600" />
                  Membres ({group.members.length})
                </h3>
                <p className="text-gray-600">
                  Participants inscrits à cette formation
                </p>
              </div>
              <div className="p-6">
                {group.members.length === 0 ? (
                  <div className="text-center py-8">
                    <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">Aucun membre dans ce groupe</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {group.members.map((member) => (
                      <div
                        key={member.id}
                        className="flex items-center justify-between p-4 bg-gray-50/50 rounded-lg border border-gray-100"
                      >
                        <div className="flex items-center space-x-4">
                          <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                            <span className="text-sm font-medium text-primary">
                              {member.user.firstName
                                ? member.user.firstName[0].toUpperCase()
                                : member.user.email[0].toUpperCase()}
                            </span>
                          </div>
                          <div className="flex-1">
                            <h4 className="font-satoshi font-medium text-darkBlue">
                              {member.user.firstName && member.user.lastName
                                ? `${member.user.firstName} ${member.user.lastName}`
                                : member.user.email}
                            </h4>
                            <p className="text-sm text-gray-600">
                              {member.user.email}
                            </p>
                            {member.user.lastLoginAt && (
                              <p className="text-xs text-gray-500">
                                Dernière connexion:{" "}
                                {new Date(
                                  member.user.lastLoginAt
                                ).toLocaleDateString("fr-FR")}
                              </p>
                            )}
                            <p className="text-xs text-gray-500">
                              Invité le{" "}
                              {new Date(member.invitedAt).toLocaleDateString(
                                "fr-FR"
                              )}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium ${
                              member.status === "ACTIVE"
                                ? "bg-green-100 text-green-800"
                                : member.status === "INVITED"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {member.status === "ACTIVE"
                              ? "Actif"
                              : member.status === "INVITED"
                              ? "Invité"
                              : "Retiré"}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Supports */}
            <div className="bg-white rounded-2xl shadow-sm border border-primary/20 overflow-hidden">
              <div className="relative p-8 bg-gradient-to-r from-white to-purple-50/50 border-b border-b-grayBlue/20">
                <Image
                  src="/formation/dot-pattern.svg"
                  width={120}
                  height={120}
                  alt=""
                  className="absolute top-0 right-0 opacity-30"
                />
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-satoshi font-bold text-darkBlue mb-2 flex items-center">
                      <FolderOpen className="w-6 h-6 mr-2 text-purple-600" />
                      Supports de formation ({group.training.supports.length})
                    </h3>
                    <p className="text-gray-600">
                      Ressources disponibles pour cette formation
                    </p>
                  </div>
                  <Button
                    onClick={() =>
                      router.push(`/admin/support-groups/${group.id}/supports`)
                    }
                    variant="outline"
                    className="text-sm"
                  >
                    Gérer
                  </Button>
                </div>
              </div>
              <div className="p-6">
                {group.training.supports.length === 0 ? (
                  <div className="text-center py-8">
                    <FolderOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">Aucun support disponible</p>
                  </div>
                ) : (
                  <div className="grid gap-4 md:grid-cols-2">
                    {group.training.supports.map((support) => (
                      <div
                        key={support.id}
                        className="border border-gray-100 rounded-lg p-4 hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-start space-x-3">
                          <div className="flex-shrink-0">
                            {getFileTypeIcon(support.type)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-satoshi font-medium text-darkBlue truncate">
                              {support.title}
                            </h4>
                            {support.description && (
                              <p className="text-sm text-gray-600 mt-1">
                                {support.description}
                              </p>
                            )}
                            <div className="flex items-center justify-between mt-3">
                              <span className="text-xs text-gray-500 uppercase tracking-wide">
                                {support.type}
                                {support.fileSize &&
                                  ` • ${formatFileSize(
                                    Number(support.fileSize)
                                  )}`}
                              </span>
                              <a
                                href={support.fileUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm bg-primary text-white px-3 py-1 rounded-lg hover:bg-primary/80 transition-colors"
                              >
                                {support.type === "link"
                                  ? "Ouvrir"
                                  : "Télécharger"}
                              </a>
                            </div>
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
      </div>
    </div>
  );
}
