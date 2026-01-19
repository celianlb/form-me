"use client";

import Button from "@/components/UI/Button";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Users, Eye, Edit, Trash2, Settings, Search } from "lucide-react";

interface SupportGroup {
  id: number;
  name: string;
  companyName: string;
  trainingDate: string;
  isActive: boolean;
  training: {
    title: string;
  };
  members: Array<{
    id: number;
    user: {
      email: string;
      firstName?: string;
      lastName?: string;
    };
    status: string;
  }>;
}

export default function SupportGroupsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [groups, setGroups] = useState<SupportGroup[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  useEffect(() => {
    if (status === "loading") return;

    if (!session?.user || session.user.role !== "ADMIN") {
      router.push("/auth/signin");
      return;
    }

    fetchGroups();
  }, [session, status, router]);

  const fetchGroups = async () => {
    try {
      const response = await fetch("/api/admin/support-groups");
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

  const handleDeleteGroup = async (groupId: number) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer ce groupe ?")) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/support-groups/${groupId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setGroups(groups.filter((g) => g.id !== groupId));
      } else {
        alert("Erreur lors de la suppression");
      }
    } catch (error) {
      console.error("Erreur:", error);
      alert("Erreur lors de la suppression");
    }
  };

  const filteredGroups = groups.filter((group) => {
    const matchesSearch = 
      group.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      group.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      group.training.title.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = 
      filterStatus === "all" ||
      (filterStatus === "active" && group.isActive) ||
      (filterStatus === "inactive" && !group.isActive);
    
    return matchesSearch && matchesFilter;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return "bg-green-100 text-green-800";
      case "INVITED":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return "Actif";
      case "INVITED":
        return "Invité";
      default:
        return "Retiré";
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

  return (
    <div className="mt-32 px-[48px] md:px-[120px]">
      {/* Header */}
      <div className="">
        <div>
          <div className="flex flex-col md:flex-row justify-between gap-4 items-start md:items-center py-6">
            <div>
              <h1 className="text-3xl font-satoshi font-bold text-darkBlue">
                Groupes de Support
              </h1>
              <p className="text-gray-600">
                Gérez les groupes de formation et leurs participants
              </p>
            </div>
            <div className="flex space-x-4">
              <Button
                onClick={() => router.push("/admin/dashboard")}
                variant="outline"
              >
                ← Dashboard
              </Button>
              <Button
                onClick={() => router.push("/admin/support-groups/create")}
                variant="primary"
              >
                + Nouveau groupe
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="max-w-7xl mx-auto mb-6">
        <div className="bg-white rounded-2xl shadow-sm border border-primary/20 p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Rechercher un groupe, entreprise ou formation..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
            <div className="flex gap-2">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="all">Tous les statuts</option>
                <option value="active">Actifs</option>
                <option value="inactive">Inactifs</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto py-4">
        {filteredGroups.length === 0 ? (
          <div className="text-center py-12">
            <div className="bg-white rounded-2xl shadow-sm border border-primary/20 p-12">
              {groups.length === 0 ? (
                <>
                  <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-satoshi font-semibold text-darkBlue mb-2">
                    Aucun groupe de support
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Commencez par créer votre premier groupe de support pour une formation.
                  </p>
                  <Button
                    onClick={() => router.push("/admin/support-groups/create")}
                    variant="primary"
                  >
                    Créer un groupe
                  </Button>
                </>
              ) : (
                <>
                  <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-satoshi font-semibold text-darkBlue mb-2">
                    Aucun résultat trouvé
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Essayez de modifier vos critères de recherche.
                  </p>
                </>
              )}
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredGroups.map((group) => (
              <div
                key={group.id}
                className="bg-white rounded-2xl shadow-sm border border-primary/20 overflow-hidden"
              >
                {/* En-tête du groupe */}
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
                      <h3 className="text-2xl font-satoshi font-bold text-darkBlue mb-2">
                        {group.name}
                      </h3>
                      <div className="flex flex-col md:flex-row gap-2 text-sm">
                        <p className="bg-primary text-white px-3 py-1 rounded-full inline-block w-fit">
                          <strong>Entreprise :</strong> {group.companyName}
                        </p>
                        <p className="bg-primary/5 text-primary px-3 py-1 rounded-full inline-block w-fit">
                          <strong>Formation :</strong> {group.training.title}
                        </p>
                        <p className="bg-platinium/60 text-darkBlue px-3 py-1 rounded-full inline-block w-fit">
                          <strong>Date :</strong> {new Date(group.trainingDate).toLocaleDateString("fr-FR")}
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

                {/* Contenu du groupe */}
                <div className="p-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Participants */}
                    <div>
                      <h4 className="text-lg font-satoshi font-semibold text-darkBlue mb-4 flex items-center">
                        <Users className="w-5 h-5 mr-2 text-primary" />
                        Participants ({group.members.length})
                      </h4>
                      <div className="space-y-3">
                        {group.members.slice(0, 5).map((member) => (
                          <div
                            key={member.id}
                            className="flex items-center justify-between p-3 bg-gray-50/50 rounded-lg border border-gray-100"
                          >
                            <div className="flex items-center space-x-3">
                              <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                                <span className="text-xs font-medium text-primary">
                                  {member.user.firstName
                                    ? member.user.firstName[0].toUpperCase()
                                    : member.user.email[0].toUpperCase()}
                                </span>
                              </div>
                              <span className="text-sm font-medium text-darkBlue">
                                {member.user.firstName && member.user.lastName
                                  ? `${member.user.firstName} ${member.user.lastName}`
                                  : member.user.email}
                              </span>
                            </div>
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(member.status)}`}>
                              {getStatusText(member.status)}
                            </span>
                          </div>
                        ))}
                        {group.members.length > 5 && (
                          <p className="text-sm text-gray-500 text-center py-2">
                            +{group.members.length - 5} autres participants...
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Actions rapides */}
                    <div>
                      <h4 className="text-lg font-satoshi font-semibold text-darkBlue mb-4 flex items-center">
                        <Settings className="w-5 h-5 mr-2 text-primary" />
                        Actions
                      </h4>
                      <div className="space-y-3">
                        <Button
                          onClick={() => router.push(`/admin/support-groups/${group.id}`)}
                          variant="outline"
                          className="w-full justify-start"
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          Voir les détails
                        </Button>
                        <Button
                          onClick={() => router.push(`/admin/support-groups/${group.id}/edit`)}
                          variant="outline"
                          className="w-full justify-start"
                        >
                          <Edit className="w-4 h-4 mr-2" />
                          Modifier le groupe
                        </Button>
                        <Button
                          onClick={() => router.push(`/admin/support-groups/${group.id}/members`)}
                          variant="outline"
                          className="w-full justify-start"
                        >
                          <Users className="w-4 h-4 mr-2" />
                          Gérer les participants
                        </Button>
                        <Button
                          onClick={() => handleDeleteGroup(group.id)}
                          variant="outline"
                          className="w-full justify-start text-red-600 hover:bg-red-50 border-red-200"
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Supprimer le groupe
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
