"use client";

import Button from "@/components/UI/Button";
import { ClipboardList, Lightbulb, Sparkles, Users } from "lucide-react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface Training {
  id: number;
  title: string;
}

export default function CreateSupportGroup() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [trainings, setTrainings] = useState<Training[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    companyName: "",
    trainingDate: "",
    trainingId: "",
    participantEmails: "",
  });

  useEffect(() => {
    if (status === "loading") return;

    if (!session?.user || session.user.role !== "ADMIN") {
      router.push("/auth/signin");
      return;
    }

    fetchTrainings();
  }, [session, status, router]);

  const fetchTrainings = async () => {
    try {
      const response = await fetch("/api/admin/trainings");
      if (response.ok) {
        const data = await response.json();
        setTrainings(data);
      }
    } catch (error) {
      console.error("Erreur lors du chargement des formations:", error);
    }
  };

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Validation des emails
    const emailList = formData.participantEmails
      .split("\n")
      .map((email) => email.trim())
      .filter((email) => email.length > 0);

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const invalidEmails = emailList.filter((email) => !emailRegex.test(email));

    if (invalidEmails.length > 0) {
      alert(`Emails invalides: ${invalidEmails.join(", ")}`);
      setIsLoading(false);
      return;
    }

    if (emailList.length === 0) {
      alert("Veuillez saisir au moins un email de participant");
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/admin/support-groups", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          participantEmails: emailList,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        // Envoyer les invitations
        if (result.invitationsToSend?.length > 0) {
          await fetch("/api/admin/send-invitations", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              groupId: result.group.id,
              members: result.invitationsToSend,
            }),
          });
        }

        alert("Groupe créé avec succès ! Les invitations ont été envoyées.");
        router.push("/admin/support-groups");
      } else {
        alert(result.error || "Erreur lors de la création du groupe");
      }
    } catch (error) {
      console.error("Erreur:", error);
      alert("Erreur lors de la création du groupe");
    } finally {
      setIsLoading(false);
    }
  };

  if (status === "loading") {
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
                Créer un groupe de support
              </h1>
              <p className="text-gray-600">
                Créez un nouveau groupe pour une session de formation
              </p>
            </div>
            <Button
              onClick={() => router.push("/admin/support-groups")}
              variant="outline"
            >
              ← Retour aux groupes
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto py-8">
        <div className="bg-white rounded-2xl shadow-sm border border-primary/20 overflow-hidden">
          {/* Header du formulaire */}
          <div className="relative p-8 bg-gradient-to-r from-white to-primary/5 border-b border-b-grayBlue/20">
            <Image
              src="/formation/dot-pattern.svg"
              width={150}
              height={150}
              alt=""
              className="absolute top-0 right-0"
            />
            <h2 className="text-2xl font-satoshi font-bold text-darkBlue mb-2">
              Nouveau Groupe de Formation
            </h2>
            <p className="text-gray-600">
              Remplissez les informations ci-dessous pour créer un groupe de
              support
            </p>
          </div>

          <div className="p-8">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Section Informations générales */}
              <div className="space-y-6">
                <h3 className="text-lg font-satoshi font-semibold text-darkBlue flex items-center">
                  <ClipboardList className="w-5 h-5 mr-2 text-primary" />
                  Informations générales
                </h3>

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
              </div>

              {/* Section Participants */}
              <div className="space-y-6">
                <h3 className="text-lg font-satoshi font-semibold text-darkBlue flex items-center">
                  <Users className="w-5 h-5 mr-2 text-primary" />
                  Participants
                </h3>

                <div>
                  <label
                    htmlFor="participantEmails"
                    className="block text-sm font-satoshi font-medium text-darkBlue mb-2"
                  >
                    Emails des participants *
                  </label>
                  <textarea
                    id="participantEmails"
                    name="participantEmails"
                    value={formData.participantEmails}
                    onChange={handleInputChange}
                    required
                    rows={8}
                    className="w-full px-4 py-3 border border-grayBlue/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent font-satoshi resize-none"
                    placeholder="Saisissez un email par ligne:&#10;participant1@entreprise.com&#10;participant2@entreprise.com&#10;participant3@entreprise.com"
                  />
                  <div className="mt-3 p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="flex items-start space-x-2">
                      <Lightbulb className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-sm text-blue-700 font-medium">
                          Conseils :
                        </p>
                        <ul className="text-sm text-blue-600 mt-1 space-y-1">
                          <li>• Saisissez un email par ligne</li>
                          <li>
                            • Les utilisateurs sans compte recevront une
                            invitation
                          </li>
                          <li>
                            • Les utilisateurs existants seront ajoutés
                            automatiquement
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Boutons */}
              <div className="flex justify-end space-x-4 pt-6 border-t">
                <Button
                  type="button"
                  onClick={() => router.push("/admin/support-groups")}
                  variant="outline"
                >
                  Annuler
                </Button>
                <Button type="submit" variant="primary" disabled={isLoading}>
                  {isLoading ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Création...</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <Sparkles className="w-4 h-4" />
                      <span>Créer le groupe</span>
                    </div>
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
