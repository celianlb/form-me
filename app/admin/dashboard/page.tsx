"use client";

import Button from "@/components/UI/Button";
import {
  Activity,
  BookOpen,
  Plus,
  UserCircle,
  UserPlus,
  Users,
} from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface DashboardStats {
  totalUsers: number;
  totalGroups: number;
  totalTrainings: number;
  recentActivities: Array<{
    id: string;
    type: string;
    message: string;
    date: string;
  }>;
}

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalGroups: 0,
    totalTrainings: 0,
    recentActivities: [],
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (status === "loading") return;

    if (!session) {
      router.push("/auth/signin");
      return;
    }

    if (session.user?.role !== "ADMIN") {
      router.push("/auth/signin");
      return;
    }

    fetchDashboardStats();
  }, [session, status, router]);

  const fetchDashboardStats = async () => {
    try {
      const response = await fetch("/api/admin/dashboard-stats");
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error("Erreur lors du chargement des statistiques:", error);
    } finally {
      setIsLoading(false);
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

  const adminCards = [
    {
      title: "Utilisateurs",
      description: "Gérer les comptes utilisateurs",
      icon: Users,
      count: stats.totalUsers,
      bgColor: "from-blue-50 to-blue-100/50",
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600",
      route: "/admin/users",
    },
    {
      title: "Groupes de Support",
      description: "Gérer les groupes et invitations",
      icon: UserCircle,
      count: stats.totalGroups,
      bgColor: "from-emerald-50 to-emerald-100/50",
      iconBg: "bg-emerald-100",
      iconColor: "text-emerald-600",
      route: "/admin/support-groups",
    },
    {
      title: "Formations",
      description: "Gérer le contenu des formations",
      icon: BookOpen,
      count: stats.totalTrainings,
      bgColor: "from-purple-50 to-purple-100/50",
      iconBg: "bg-purple-100",
      iconColor: "text-purple-600",
      route: "/admin/trainings",
    },
  ];

  return (
    <div className="mt-32 px-[48px] md:px-[120px]">
      {/* Header */}
      <div className="">
        <div>
          <div className="flex flex-col md:flex-row justify-between gap-4 items-start md:items-center py-6">
            <div>
              <h1 className="text-3xl font-satoshi font-bold text-darkBlue">
                Dashboard Administrateur
              </h1>
              <p className="text-gray-600">
                Bienvenue, {session.user?.name || session.user?.email}
              </p>
            </div>
            <div className="flex space-x-4">
              <Button
                onClick={() => router.push("/dashboard")}
                variant="outline"
              >
                Dashboard Utilisateur
              </Button>
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
        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {adminCards.map((card, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl shadow-sm border border-primary/20 overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => router.push(card.route)}
            >
              <div className={`relative p-6 bg-gradient-to-br ${card.bgColor}`}>
                <Image
                  src="/formation/dot-pattern.svg"
                  width={80}
                  height={80}
                  alt=""
                  className="absolute top-0 right-0 opacity-30"
                />
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 ${card.iconBg} rounded-xl`}>
                    <card.icon className={`w-6 h-6 ${card.iconColor}`} />
                  </div>
                  {card.count !== null && (
                    <div className="text-2xl font-satoshi font-bold text-darkBlue">
                      {card.count}
                    </div>
                  )}
                </div>
                <h3 className="text-lg font-satoshi font-semibold text-darkBlue mb-1">
                  {card.title}
                </h3>
                <p className="text-sm text-gray-600">{card.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Main Content Area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Activities */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-sm border border-primary/20 overflow-hidden">
              <div className="relative p-8 bg-gradient-to-r from-white to-primary/5 border-b border-b-grayBlue/20">
                <Image
                  src="/formation/dot-pattern.svg"
                  width={150}
                  height={150}
                  alt=""
                  className="absolute top-0 right-0"
                />
                <h2 className="text-2xl font-satoshi font-bold text-darkBlue mb-2 flex items-center">
                  <Activity className="w-6 h-6 mr-3 text-primary" />
                  Activités Récentes
                </h2>
                <p className="text-gray-600">
                  Dernières actions sur la plateforme
                </p>
              </div>

              <div className="p-6">
                {stats.recentActivities.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="text-4xl mb-4">🔄</div>
                    <p className="text-gray-500">Aucune activité récente</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {stats.recentActivities.map((activity) => (
                      <div
                        key={activity.id}
                        className="flex items-start space-x-3 p-4 rounded-lg bg-gray-50/50 border border-gray-100"
                      >
                        <div className="flex-shrink-0 w-2 h-2 bg-primary rounded-full mt-2"></div>
                        <div className="flex-1">
                          <p className="text-sm text-darkBlue">
                            {activity.message}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            {new Date(activity.date).toLocaleDateString(
                              "fr-FR",
                              {
                                day: "numeric",
                                month: "short",
                                hour: "2-digit",
                                minute: "2-digit",
                              }
                            )}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-primary/20 p-6">
              <h3 className="text-lg font-satoshi font-semibold text-darkBlue mb-4">
                Actions
              </h3>
              <div className="space-y-3">
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => router.push("/admin/support-groups/create")}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Créer un groupe
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => router.push("/admin/users/invite")}
                >
                  <UserPlus className="w-4 h-4 mr-2" />
                  Inviter utilisateur
                </Button>
              </div>
            </div>

            {/* Session Info */}
            <div className="bg-white rounded-2xl shadow-sm border border-primary/20 p-6">
              <h3 className="text-lg font-satoshi font-semibold text-darkBlue mb-4">
                Informations de session
              </h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <div>
                    <p className="text-sm font-medium text-darkBlue">Status</p>
                    <p className="text-xs text-gray-600">Connecté</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <div>
                    <p className="text-sm font-medium text-darkBlue">Rôle</p>
                    <p className="text-xs text-gray-600">
                      {session.user?.role}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                  <div>
                    <p className="text-sm font-medium text-darkBlue">Email</p>
                    <p className="text-xs text-gray-600 truncate">
                      {session.user?.email}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
