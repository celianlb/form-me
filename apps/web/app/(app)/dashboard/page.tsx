"use client";

import Button from "@/components/UI/Button";
import Heading from "@/components/UI/Heading";
import {
  LogOut,
  LayoutDashboard,
  BookOpen,
  Building2,
  Users,
  Calendar,
  Download,
  ExternalLink,
  FileText,
} from "lucide-react";
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
        return <FileText className="w-5 h-5 text-red-500" />;
      case "ppt":
      case "pptx":
        return <FileText className="w-5 h-5 text-orange-500" />;
      case "doc":
      case "docx":
        return <FileText className="w-5 h-5 text-blue-500" />;
      case "xls":
      case "xlsx":
        return <FileText className="w-5 h-5 text-green-500" />;
      case "video":
        return <FileText className="w-5 h-5 text-purple-500" />;
      case "link":
        return <ExternalLink className="w-5 h-5 text-primary" />;
      default:
        return <FileText className="w-5 h-5 text-grayBlue" />;
    }
  };

  if (status === "loading" || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="font-satoshi text-grayBlue">Chargement...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="pt-32 pb-16 px-4 md:px-10 lg:px-[120px]">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between gap-6 items-start lg:items-center mb-10">
        <div>
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-gray-100 rounded-full px-3 py-1.5 mb-4">
            <BookOpen className="w-4 h-4 text-primary" />
            <span className="text-xs font-satoshi font-semibold text-darkBlue">
              Espace apprenant
            </span>
          </div>

          <Heading level={1} className="mb-2">
            Mes Formations
          </Heading>
          <p className="font-satoshi text-grayBlue">
            Bienvenue, {session.user?.name || session.user?.email}
          </p>
        </div>

        <div className="flex gap-3">
          {session.user?.role === "ADMIN" && (
            <Button
              variant="secondary"
              onClick={() => router.push("/admin/dashboard")}
              showIcon={false}
            >
              <LayoutDashboard className="w-4 h-4 mr-2" />
              Dashboard Admin
            </Button>
          )}
          <Button
            variant="outline"
            showIcon={false}
            onClick={async () => {
              try {
                const result = await signOut({ redirect: false });
                window.location.href = result?.url || "/";
              } catch (error) {
                console.error("Erreur lors de la déconnexion:", error);
                window.location.href = "/";
              }
            }}
          >
            <LogOut className="w-4 h-4 mr-2" />
            Déconnexion
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="space-y-6">
        {groups.length === 0 ? (
          <div className="bg-gray-100 rounded-4xl p-12 text-center">
            <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center mx-auto mb-6">
              <BookOpen className="w-10 h-10 text-grayBlue" />
            </div>
            <h3 className="font-sora font-bold text-xl text-darkBlue mb-3">
              Aucune formation disponible
            </h3>
            <p className="font-satoshi text-grayBlue max-w-md mx-auto">
              Vous n&apos;avez pas encore accès à des supports de formation.
              Contactez votre administrateur si vous pensez qu&apos;il
              s&apos;agit d&apos;une erreur.
            </p>
          </div>
        ) : (
          groups.map((group) => (
            <div
              key={group.id}
              className="bg-darkBlue rounded-4xl overflow-hidden relative"
            >
              {/* Background effects */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-3xl" />
              <div className="absolute -bottom-20 -left-20 w-48 h-48 bg-primary/10 rounded-full blur-2xl" />
              <Image
                src="/bento/dot-pattern-bento.svg"
                width={300}
                height={300}
                alt=""
                className="absolute bottom-0 right-0 opacity-10"
              />

              {/* Header du groupe */}
              <div className="relative z-10 p-6 md:p-8 border-b border-white/10">
                <h2 className="font-sora font-bold text-2xl text-white mb-4">
                  {group.training.title}
                </h2>

                <div className="flex flex-wrap gap-2">
                  <span className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-3 py-1.5">
                    <Building2 className="w-3.5 h-3.5 text-white" />
                    <span className="text-xs font-satoshi text-white">
                      {group.companyName}
                    </span>
                  </span>
                  <span className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-3 py-1.5">
                    <Users className="w-3.5 h-3.5 text-white" />
                    <span className="text-xs font-satoshi text-white">
                      {group.name}
                    </span>
                  </span>
                  <span className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-3 py-1.5">
                    <Calendar className="w-3.5 h-3.5 text-white" />
                    <span className="text-xs font-satoshi text-white">
                      {new Date(group.trainingDate).toLocaleDateString("fr-FR")}
                    </span>
                  </span>
                </div>
              </div>

              {/* Supports */}
              <div className="relative z-10 p-6 md:p-8">
                <h3 className="font-sora font-semibold text-lg text-white mb-4">
                  Supports de formation ({group.training.supports.length})
                </h3>

                {group.training.supports.length === 0 ? (
                  <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 text-center">
                    <p className="font-satoshi text-white/60">
                      Aucun support disponible pour le moment
                    </p>
                  </div>
                ) : (
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {group.training.supports.map((support) => (
                      <div
                        key={support.id}
                        className="bg-white rounded-2xl p-5 hover:shadow-lg transition-shadow group"
                      >
                        <div className="flex items-start gap-4">
                          <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center shrink-0">
                            {getFileTypeIcon(support.type)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-satoshi font-semibold text-darkBlue truncate mb-1">
                              {support.title}
                            </h4>
                            {support.description && (
                              <p className="font-satoshi text-sm text-grayBlue line-clamp-2">
                                {support.description}
                              </p>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                          <span className="inline-flex items-center gap-1 text-xs font-satoshi text-grayBlue bg-gray-100 px-2 py-1 rounded-full">
                            {support.type.toUpperCase()}
                            {support.fileSize && (
                              <span className="text-gray-400">
                                {" "}
                                • {formatFileSize(Number(support.fileSize))}
                              </span>
                            )}
                          </span>
                          <a
                            href={support.fileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 text-sm font-satoshi font-semibold text-primary hover:text-primary/80 transition-colors"
                          >
                            {support.type === "link" ? (
                              <>
                                Ouvrir
                                <ExternalLink className="w-4 h-4" />
                              </>
                            ) : (
                              <>
                                Télécharger
                                <Download className="w-4 h-4" />
                              </>
                            )}
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
