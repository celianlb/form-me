"use client";

import Button from "@/components/UI/Button";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface SupportGroup {
  id: number;
  name: string;
  companyName: string;
  trainingDate: string;
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
}

export default function UserDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [groups, setGroups] = useState<SupportGroup[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (status === "loading") return;

    if (!session) {
      router.push("/auth/signin");
      return;
    }

    if (session.user?.role !== "LEARNER" && session.user?.role !== "ADMIN") {
      router.push("/auth/signin");
      return;
    }

    fetchUserGroups();
  }, [session, status, router]);

  const fetchUserGroups = async () => {
    try {
      const response = await fetch("/api/user/support-groups");
      if (response.ok) {
        const data = await response.json();
        setGroups(data);
      }
    } catch (error) {
      console.error("Erreur lors du chargement des groupes:", error);
    } finally {
      setIsLoading(false);
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

  if (!session) {
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
                Mes Formations
              </h1>
              <p className="text-gray-600">
                Bienvenue, {session.user?.name || session.user?.email}
              </p>
            </div>
            <div className="flex space-x-4">
              {session.user?.role === "ADMIN" && (
                <Button
                  onClick={() => router.push("/admin/dashboard")}
                  variant="outline"
                >
                  Dashboard Admin
                </Button>
              )}
              <Button
                onClick={async () => {
                  try {
                    const result = await signOut({ redirect: false });
                    window.location.href = result?.url || "/";
                  } catch (error) {
                    console.error("Erreur lors de la déconnexion:", error);
                    window.location.href = "/";
                  }
                }}
                variant="outline"
              >
                Se déconnecter
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto py-8">
        {groups.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📚</div>
            <h3 className="text-xl font-satoshi font-semibold text-darkBlue mb-2">
              Aucune formation disponible
            </h3>
            <p className="text-gray-600 mb-6">
              Vous n&apos;avez pas encore accès à des supports de formation.
              <br />
              Contactez votre administrateur si vous pensez qu&apos;il
              s&apos;agit d&apos;une erreur.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {groups.map((group) => (
              <div
                key={group.id}
                className="bg-white rounded-2xl shadow-sm border border-primary/20 overflow-hidden"
              >
                {/* En-tête du groupe */}
                <div className="relative p-8 bg-gradient-to-r from-wihte to-primary/5 border-b border-b-grayBlue/20">
                  <Image
                    src={"/formation/dot-pattern.svg"}
                    width={150}
                    height={150}
                    alt=""
                    className="absolute top-0 right-0"
                  />
                  <div className="flex flex-col gap-6 justify-between items-start">
                    <h2 className="text-2xl font-satoshi font-bold text-darkBlue mb-2">
                      {group.training.title}
                    </h2>
                    <div className="flex flex-col md:flex-row gap-2 text-sm text-gray-600">
                      <p className="bg-primary w-fit text-white px-3 py-1 rounded-full inline-block">
                        <strong>Entreprise :</strong> {group.companyName}
                      </p>
                      <p className="bg-primary/5 w-fit text-primary px-3 py-1 rounded-full inline-block">
                        <strong>Groupe :</strong> {group.name}
                      </p>
                      <p className="bg-platinium/60 w-fit text-darkBlue px-3 py-1 rounded-full inline-block">
                        <strong>Date de formation :</strong>{" "}
                        {new Date(group.trainingDate).toLocaleDateString(
                          "fr-FR"
                        )}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Supports */}
                <div className="p-6">
                  <h3 className="text-lg font-satoshi font-semibold text-darkBlue mb-4">
                    Supports de formation ({group.training.supports.length})
                  </h3>

                  {group.training.supports.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <p>Aucun support disponible pour le moment</p>
                    </div>
                  ) : (
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                      {group.training.supports.map((support) => (
                        <div
                          key={support.id}
                          className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                        >
                          <div className="flex items-start space-x-3">
                            <span className="text-2xl flex-shrink-0">
                              {getFileTypeIcon(support.type)}
                            </span>
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
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
