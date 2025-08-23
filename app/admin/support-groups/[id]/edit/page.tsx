"use client";

import Button from "@/components/UI/Button";
import { useSession } from "next-auth/react";
import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

interface Training {
  id: number;
  title: string;
}

interface GroupDetail {
  id: number;
  name: string;
  companyName: string;
  trainingDate: string;
  trainingId: number;
  isActive: boolean;
}

export default function EditSupportGroup() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const params = useParams();
  const [trainings, setTrainings] = useState<Training[]>([]);
  const [group, setGroup] = useState<GroupDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    companyName: "",
    trainingDate: "",
    trainingId: "",
    isActive: true,
  });

  const fetchData = useCallback(async () => {
    try {
      // Charger les formations et les détails du groupe en parallèle
      const [trainingsResponse, groupResponse] = await Promise.all([
        fetch("/api/admin/trainings"),
        fetch(`/api/admin/support-groups/${params.id}`),
      ]);

      if (trainingsResponse.ok) {
        const trainingsData = await trainingsResponse.json();
        setTrainings(trainingsData);
      }

      if (groupResponse.ok) {
        const groupData = await groupResponse.json();
        setGroup(groupData);
        setFormData({
          name: groupData.name,
          companyName: groupData.companyName,
          trainingDate: groupData.trainingDate.split("T")[0], // Format YYYY-MM-DD
          trainingId: groupData.trainingId.toString(),
          isActive: groupData.isActive,
        });
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

    fetchData();
  }, [session, status, router, params.id, fetchData]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      const response = await fetch(`/api/admin/support-groups/${params.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok) {
        alert("Groupe modifié avec succès !");
        router.push(`/admin/support-groups/${params.id}`);
      } else {
        setError(result.error || "Erreur lors de la modification du groupe");
      }
    } catch (error) {
      console.error("Erreur:", error);
      setError("Erreur lors de la modification du groupe");
    } finally {
      setIsSubmitting(false);
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

  if (error && !group) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">❌</div>
          <h3 className="text-xl font-satoshi font-semibold text-darkBlue mb-2">
            {error}
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
                Modifier le groupe
              </h1>
              <p className="text-gray-600">
                Modification des informations du groupe
              </p>
            </div>
            <Button
              onClick={() => router.push(`/admin/support-groups/${params.id}`)}
              variant="outline"
            >
              ← Retour au groupe
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow-sm border p-8">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
              <p className="text-red-800">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Nom du groupe */}
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-satoshi font-medium text-darkBlue mb-2"
              >
                Nom du groupe *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border border-grayBlue/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent font-satoshi"
                placeholder="Ex: Formation Excel - Groupe A"
              />
            </div>

            {/* Nom de l'entreprise */}
            <div>
              <label
                htmlFor="companyName"
                className="block text-sm font-satoshi font-medium text-darkBlue mb-2"
              >
                Nom de l&apos;entreprise *
              </label>
              <input
                type="text"
                id="companyName"
                name="companyName"
                value={formData.companyName}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border border-grayBlue/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent font-satoshi"
                placeholder="Ex: ACME Corp"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Date de formation */}
              <div>
                <label
                  htmlFor="trainingDate"
                  className="block text-sm font-satoshi font-medium text-darkBlue mb-2"
                >
                  Date de la formation *
                </label>
                <input
                  type="date"
                  id="trainingDate"
                  name="trainingDate"
                  value={formData.trainingDate}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-grayBlue/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent font-satoshi"
                />
              </div>

              {/* Formation */}
              <div>
                <label
                  htmlFor="trainingId"
                  className="block text-sm font-satoshi font-medium text-darkBlue mb-2"
                >
                  Formation *
                </label>
                <select
                  id="trainingId"
                  name="trainingId"
                  value={formData.trainingId}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-grayBlue/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent font-satoshi bg-white"
                >
                  <option value="">Sélectionner une formation</option>
                  {trainings.map((training) => (
                    <option key={training.id} value={training.id}>
                      {training.title}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Statut actif/inactif */}
            <div>
              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  name="isActive"
                  checked={formData.isActive}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                />
                <span className="text-sm font-satoshi font-medium text-darkBlue">
                  Groupe actif
                </span>
              </label>
              <p className="text-sm text-gray-600 mt-1">
                Les groupes inactifs ne sont plus accessibles aux utilisateurs
              </p>
            </div>

            {/* Boutons */}
            <div className="flex justify-end space-x-4 pt-6">
              <Button
                type="button"
                onClick={() =>
                  router.push(`/admin/support-groups/${params.id}`)
                }
                variant="outline"
              >
                Annuler
              </Button>
              <Button type="submit" variant="secondary" disabled={isSubmitting}>
                {isSubmitting ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Modification...</span>
                  </div>
                ) : (
                  "Modifier le groupe"
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
