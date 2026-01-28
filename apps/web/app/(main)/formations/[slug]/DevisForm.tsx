"use client";

import Button from "@/components/UI/Button";
import { FormationWithDetails } from "@/types/formationDetails";
import { useState, useEffect } from "react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface Session {
  id: number;
  title: string;
  startDate: string;
  endDate: string | null;
  mode: "PARTNER_CENTER" | "E_LEARNING";
  location: string | null;
  availableSpots: number | null;
  isFull: boolean;
}

interface DevisFormProps {
  formation: FormationWithDetails;
}

export default function DevisForm({ formation }: DevisFormProps) {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loadingSessions, setLoadingSessions] = useState(true);

  const [formData, setFormData] = useState({
    nom: "",
    prenom: "",
    email: "",
    telephone: "",
    profil: "entreprise", // entreprise ou particulier
    ville: "",
    codePostal: "",
    sessionId: "",
    apprenants: "1",
    message: "",
    consentementMarketing: false,
    consentementPolitique: false,
  });

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const response = await fetch(`/api/sessions/public?trainingId=${formation.id}`);
        if (response.ok) {
          const data = await response.json();
          setSessions(data);
        }
      } catch (error) {
        console.error("Error fetching sessions:", error);
      } finally {
        setLoadingSessions(false);
      }
    };
    fetchSessions();
  }, [formation.id]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{
    type: "success" | "error" | null;
    message: string;
  }>({ type: null, message: "" });

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value, type } = e.target;
    const checked =
      type === "checkbox"
        ? (e.target as HTMLInputElement).checked
        : undefined;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus({ type: null, message: "" });

    try {
      const response = await fetch("/api/send-devis", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          formationId: formation.id,
          sessionId: formData.sessionId ? parseInt(formData.sessionId) : undefined,
          apprenants: parseInt(formData.apprenants) || 1,
          formationTitle: formation.title,
          categoryName: formation.category?.name,
        }),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setSubmitStatus({
          type: "success",
          message:
            "Votre demande de devis a été envoyée avec succès ! Nous vous recontacterons rapidement.",
        });
        // Réinitialiser le formulaire
        setFormData({
          nom: "",
          prenom: "",
          email: "",
          telephone: "",
          profil: "entreprise",
          ville: "",
          codePostal: "",
          sessionId: "",
          apprenants: "1",
          message: "",
          consentementMarketing: false,
          consentementPolitique: false,
        });
      } else {
        setSubmitStatus({
          type: "error",
          message:
            result.error ||
            "Une erreur est survenue lors de l'envoi de votre demande.",
        });
      }
    } catch (error) {
      console.error("Erreur lors de l'envoi:", error);
      setSubmitStatus({
        type: "error",
        message: "Une erreur réseau est survenue. Veuillez réessayer.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl p-8 shadow-[0_0_30px_rgba(18,94,255,0.1)] border border-primary/20">
      <h3 className="text-2xl font-satoshi font-semibold text-darkBlue mb-6">
        Demander un devis
      </h3>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Nom et Prénom */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="nom"
              className="block text-sm font-satoshi font-medium text-darkBlue mb-2"
            >
              Nom *
            </label>
            <input
              type="text"
              id="nom"
              name="nom"
              value={formData.nom}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-3 border border-grayBlue/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent font-satoshi"
            />
          </div>
          <div>
            <label
              htmlFor="prenom"
              className="block text-sm font-satoshi font-medium text-darkBlue mb-2"
            >
              Prénom *
            </label>
            <input
              type="text"
              id="prenom"
              name="prenom"
              value={formData.prenom}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-3 border border-grayBlue/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent font-satoshi"
            />
          </div>
        </div>

        {/* Email et Téléphone */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-satoshi font-medium text-darkBlue mb-2"
            >
              E-mail *
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-3 border border-grayBlue/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent font-satoshi"
            />
          </div>
          <div>
            <label
              htmlFor="telephone"
              className="block text-sm font-satoshi font-medium text-darkBlue mb-2"
            >
              Téléphone *
            </label>
            <input
              type="tel"
              id="telephone"
              name="telephone"
              value={formData.telephone}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-3 border border-grayBlue/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent font-satoshi"
            />
          </div>
        </div>

        {/* Profil et Apprenants */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="profil"
              className="block text-sm font-satoshi font-medium text-darkBlue mb-2"
            >
              Profil *
            </label>
            <select
              id="profil"
              name="profil"
              value={formData.profil}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-3 border border-grayBlue/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent font-satoshi bg-white"
            >
              <option value="entreprise">Entreprise</option>
              <option value="particulier">Particulier</option>
            </select>
          </div>
          <div>
            <label
              htmlFor="apprenants"
              className="block text-sm font-satoshi font-medium text-darkBlue mb-2"
            >
              Nombre de participants *
            </label>
            <input
              type="number"
              id="apprenants"
              name="apprenants"
              min="1"
              value={formData.apprenants}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-3 border border-grayBlue/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent font-satoshi"
            />
          </div>
        </div>

        {/* Session de formation */}
        <div>
          <label
            htmlFor="sessionId"
            className="block text-sm font-satoshi font-medium text-darkBlue mb-2"
          >
            Session souhaitée
          </label>
          {loadingSessions ? (
            <div className="w-full px-4 py-3 border border-grayBlue/30 rounded-xl bg-gray-50 text-grayBlue">
              Chargement des sessions...
            </div>
          ) : sessions.length === 0 ? (
            <div className="w-full px-4 py-3 border border-grayBlue/30 rounded-xl bg-gray-50 text-grayBlue">
              Aucune session programmée - Contactez-nous pour planifier une date
            </div>
          ) : (
            <select
              id="sessionId"
              name="sessionId"
              value={formData.sessionId}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-grayBlue/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent font-satoshi bg-white"
            >
              <option value="">Sélectionner une session</option>
              {sessions.map((session) => {
                const dateStr = format(new Date(session.startDate), "d MMMM yyyy", { locale: fr });
                const modeStr = session.mode === "E_LEARNING" ? "E-learning" : "Présentiel";
                const spotsStr = session.availableSpots !== null
                  ? ` - ${session.availableSpots} place${session.availableSpots > 1 ? "s" : ""}`
                  : "";
                return (
                  <option
                    key={session.id}
                    value={session.id}
                    disabled={session.isFull}
                  >
                    {dateStr} ({modeStr}){spotsStr}{session.isFull ? " - Complet" : ""}
                  </option>
                );
              })}
            </select>
          )}
        </div>

        {/* Adresse */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="ville"
              className="block text-sm font-satoshi font-medium text-darkBlue mb-2"
            >
              Ville *
            </label>
            <input
              type="text"
              id="ville"
              name="ville"
              value={formData.ville}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-3 border border-grayBlue/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent font-satoshi"
            />
          </div>
          <div>
            <label
              htmlFor="codePostal"
              className="block text-sm font-satoshi font-medium text-darkBlue mb-2"
            >
              Code postal *
            </label>
            <input
              type="text"
              id="codePostal"
              name="codePostal"
              value={formData.codePostal}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-3 border border-grayBlue/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent font-satoshi"
            />
          </div>
        </div>

        {/* Message */}
        <div>
          <label
            htmlFor="message"
            className="block text-sm font-satoshi font-medium text-darkBlue mb-2"
          >
            Message (facultatif)
          </label>
          <textarea
            id="message"
            name="message"
            rows={4}
            value={formData.message}
            onChange={handleInputChange}
            placeholder="Précisez vos besoins, le nombre de participants, les dates souhaitées..."
            className="w-full px-4 py-3 border border-grayBlue/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent font-satoshi resize-none"
          />
        </div>

        {/* Checkboxes de consentement */}
        <div className="space-y-4 pt-4 border-t border-grayBlue/20">
          <div className="flex items-start space-x-3">
            <input
              type="checkbox"
              id="consentementPolitique"
              name="consentementPolitique"
              checked={formData.consentementPolitique}
              onChange={handleInputChange}
              required
              className="mt-1 w-4 h-4 text-primary bg-white border-grayBlue/30 rounded focus:ring-primary focus:ring-2 focus:ring-offset-0"
            />
            <label
              htmlFor="consentementPolitique"
              className="text-sm font-satoshi text-darkBlue leading-relaxed"
            >
              J&apos;ai lu et j&apos;accepte la{" "}
              <a
                href="/politiques-de-confidentialite"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline font-medium"
              >
                politique de confidentialité
              </a>{" "}
              *{" "}
              <span className="text-grayBlue/70">
                (Obligatoire pour traiter votre demande)
              </span>
            </label>
          </div>

          <div className="flex items-start space-x-3">
            <input
              type="checkbox"
              id="consentementMarketing"
              name="consentementMarketing"
              checked={formData.consentementMarketing}
              onChange={handleInputChange}
              className="mt-1 w-4 h-4 text-primary bg-white border-grayBlue/30 rounded focus:ring-primary focus:ring-2 focus:ring-offset-0"
            />
            <label
              htmlFor="consentementMarketing"
              className="text-sm font-satoshi text-darkBlue leading-relaxed"
            >
              J&apos;accepte de recevoir des informations sur les formations et
              actualités de Form.Me par e-mail
              <span className="text-grayBlue/70 block mt-1">
                (Facultatif - Vous pouvez vous désabonner à tout moment)
              </span>
            </label>
          </div>
        </div>

        {/* Messages de statut */}
        {submitStatus.type && (
          <div
            className={`p-4 rounded-xl mb-4 ${
              submitStatus.type === "success"
                ? "bg-green-50 text-green-800 border border-green-200"
                : "bg-red-50 text-red-800 border border-red-200"
            }`}
          >
            <div className="flex items-start space-x-3">
              <span className="text-lg">
                {submitStatus.type === "success" ? "✅" : "❌"}
              </span>
              <p className="font-satoshi text-sm">{submitStatus.message}</p>
            </div>
          </div>
        )}

        {/* Bouton de soumission */}
        <Button
          type="submit"
          variant="secondary"
          className="w-fit"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Envoi en cours...</span>
            </div>
          ) : (
            "Demander un devis"
          )}
        </Button>
      </form>
    </div>
  );
}
