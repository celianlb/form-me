"use client";

import Button from "@/components/UI/Button";
import { CategoryWithCount } from "@/types/category";
import { useEffect, useState } from "react";

interface DevisContactFormProps {
  categories: CategoryWithCount[];
}

interface FormationOption {
  id: number;
  title: string;
  slug: string;
}

interface SessionOption {
  id: number;
  title: string;
  startDate: string;
  endDate: string | null;
  mode: string;
  location: string | null;
  availableSpots: number | null;
  isFull: boolean;
}

export default function DevisContactForm({
  categories,
}: DevisContactFormProps) {
  const [formData, setFormData] = useState({
    nom: "",
    prenom: "",
    email: "",
    telephone: "",
    profil: "entreprise", // entreprise ou particulier
    categorieId: "",
    formationId: "",
    sessionId: "",
    apprenants: "1",
    ville: "",
    codePostal: "",
    message: "",
    consentementMarketing: false,
    consentementPolitique: false,
  });

  const [formations, setFormations] = useState<FormationOption[]>([]);
  const [isLoadingFormations, setIsLoadingFormations] = useState(false);
  const [sessions, setSessions] = useState<SessionOption[]>([]);
  const [isLoadingSessions, setIsLoadingSessions] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{
    type: "success" | "error" | null;
    message: string;
  }>({ type: null, message: "" });

  // Charger les formations quand une catégorie est sélectionnée
  useEffect(() => {
    const loadFormations = async () => {
      if (!formData.categorieId) {
        setFormations([]);
        setFormData((prev) => ({ ...prev, formationId: "", sessionId: "" }));
        setSessions([]);
        return;
      }

      setIsLoadingFormations(true);
      try {
        const selectedCategory = categories.find(
          (cat) => cat.id.toString() === formData.categorieId
        );
        if (!selectedCategory) return;

        const response = await fetch(
          `/api/formations?category=${selectedCategory.slug}`
        );
        const data = await response.json();

        if (response.ok) {
          setFormations(
            data.formations.map((f: FormationOption) => ({
              id: f.id,
              title: f.title,
              slug: f.slug,
            }))
          );
        }
      } catch (error) {
        console.error("Erreur lors du chargement des formations:", error);
      } finally {
        setIsLoadingFormations(false);
      }
    };

    loadFormations();
  }, [formData.categorieId, categories]);

  // Charger les sessions quand une formation est sélectionnée
  useEffect(() => {
    const loadSessions = async () => {
      if (!formData.formationId) {
        setSessions([]);
        setFormData((prev) => ({ ...prev, sessionId: "" }));
        return;
      }

      setIsLoadingSessions(true);
      try {
        const response = await fetch(
          `/api/sessions/public?trainingId=${formData.formationId}`
        );
        const data = await response.json();

        if (response.ok && Array.isArray(data)) {
          setSessions(data);
        }
      } catch (error) {
        console.error("Erreur lors du chargement des sessions:", error);
      } finally {
        setIsLoadingSessions(false);
      }
    };

    loadSessions();
  }, [formData.formationId]);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value, type } = e.target;
    const checked = type === 'checkbox' ? (e.target as HTMLInputElement).checked : undefined;
    
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus({ type: null, message: "" });

    try {
      const selectedCategoryName = categories.find(
        (cat) => cat.id.toString() === formData.categorieId
      )?.name;
      const selectedFormationTitle = formations.find(
        (f) => f.id.toString() === formData.formationId
      )?.title;

      const response = await fetch("/api/send-devis", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nom: formData.nom,
          prenom: formData.prenom,
          email: formData.email,
          telephone: formData.telephone,
          profil: formData.profil,
          ville: formData.ville,
          codePostal: formData.codePostal,
          message: formData.message,
          apprenants: parseInt(formData.apprenants) || 1,
          formationId: formData.formationId ? parseInt(formData.formationId) : undefined,
          sessionId: formData.sessionId ? parseInt(formData.sessionId) : undefined,
          formationTitle: selectedFormationTitle || "Formation non spécifiée",
          categoryName: selectedCategoryName || "Catégorie non spécifiée",
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
          categorieId: "",
          formationId: "",
          sessionId: "",
          apprenants: "1",
          ville: "",
          codePostal: "",
          message: "",
          consentementMarketing: false,
          consentementPolitique: false,
        });
        setSessions([]);
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
    <div className=" rounded-3xl ">
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
              className="bg-white w-full px-4 py-3 border border-grayBlue/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent font-satoshi"
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
              className="bg-white w-full px-4 py-3 border border-grayBlue/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent font-satoshi"
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
              className="bg-white w-full px-4 py-3 border border-grayBlue/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent font-satoshi"
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
              className=" bg-white w-full px-4 py-3 border border-grayBlue/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent font-satoshi"
            />
          </div>
        </div>

        {/* Profil */}
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
            className=" w-full px-4 py-3 border border-grayBlue/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent font-satoshi bg-white"
          >
            <option value="entreprise">Entreprise</option>
            <option value="particulier">Particulier</option>
          </select>
        </div>

        {/* Catégorie */}
        <div>
          <label
            htmlFor="categorieId"
            className="block text-sm font-satoshi font-medium text-darkBlue mb-2"
          >
            Catégorie de formation *
          </label>
          <select
            id="categorieId"
            name="categorieId"
            value={formData.categorieId}
            onChange={handleInputChange}
            required
            className="w-full px-4 py-3 border border-grayBlue/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent font-satoshi bg-white"
          >
            <option value="">Choisir une catégorie</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id.toString()}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        {/* Formation */}
        {formData.categorieId && (
          <div>
            <label
              htmlFor="formationId"
              className="block text-sm font-satoshi font-medium text-darkBlue mb-2"
            >
              Formation *
            </label>
            <select
              id="formationId"
              name="formationId"
              value={formData.formationId}
              onChange={handleInputChange}
              required
              disabled={isLoadingFormations}
              className="w-full px-4 py-3 border border-grayBlue/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent font-satoshi bg-white disabled:bg-gray-50"
            >
              <option value="">
                {isLoadingFormations
                  ? "Chargement..."
                  : "Choisir une formation"}
              </option>
              {formations.map((formation) => (
                <option key={formation.id} value={formation.id.toString()}>
                  {formation.title}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Session - affiché si des sessions sont disponibles */}
        {formData.formationId && (
          <div>
            <label
              htmlFor="sessionId"
              className="block text-sm font-satoshi font-medium text-darkBlue mb-2"
            >
              Session de formation {sessions.length > 0 ? "(optionnel)" : ""}
            </label>
            {isLoadingSessions ? (
              <div className="w-full px-4 py-3 border border-grayBlue/30 rounded-xl bg-gray-50 text-grayBlue font-satoshi">
                Chargement des sessions...
              </div>
            ) : sessions.length > 0 ? (
              <select
                id="sessionId"
                name="sessionId"
                value={formData.sessionId}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-grayBlue/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent font-satoshi bg-white"
              >
                <option value="">Choisir une session (optionnel)</option>
                {sessions.map((session) => {
                  const startDate = new Date(session.startDate).toLocaleDateString("fr-FR", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  });
                  const modeLabel = session.mode === "PARTNER_CENTER" ? "Présentiel" : "E-learning";
                  const spotsLabel = session.availableSpots !== null
                    ? ` - ${session.availableSpots} place${session.availableSpots > 1 ? "s" : ""} disponible${session.availableSpots > 1 ? "s" : ""}`
                    : "";

                  return (
                    <option
                      key={session.id}
                      value={session.id.toString()}
                      disabled={session.isFull}
                    >
                      {session.title} - {startDate} ({modeLabel}){spotsLabel}
                      {session.isFull ? " - Complet" : ""}
                    </option>
                  );
                })}
              </select>
            ) : (
              <div className="w-full px-4 py-3 border border-grayBlue/30 rounded-xl bg-gray-50 text-grayBlue font-satoshi text-sm">
                Aucune session programmée pour cette formation. Nous vous contacterons pour planifier une date.
              </div>
            )}
          </div>
        )}

        {/* Nombre d'apprenants */}
        <div>
          <label
            htmlFor="apprenants"
            className="block text-sm font-satoshi font-medium text-darkBlue mb-2"
          >
            Nombre d&apos;apprenants *
          </label>
          <input
            type="number"
            id="apprenants"
            name="apprenants"
            min="1"
            max="100"
            value={formData.apprenants}
            onChange={handleInputChange}
            required
            className="bg-white w-full px-4 py-3 border border-grayBlue/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent font-satoshi"
          />
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
              className=" bg-white w-full px-4 py-3 border border-grayBlue/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent font-satoshi"
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
              className="bg-white w-full px-4 py-3 border border-grayBlue/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent font-satoshi"
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
            placeholder="Ex: Plus de 10 apprenants, besoins particuliers..."
            className="bg-white w-full px-4 py-3 border border-grayBlue/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent font-satoshi resize-none"
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
              * <span className="text-grayBlue/70">(Obligatoire pour traiter votre demande)</span>
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
              J&apos;accepte de recevoir des informations sur les formations et actualités de Form.Me par e-mail
              <span className="text-grayBlue/70 block mt-1">
                (Facultatif - Vous pouvez vous désabonner à tout moment)
              </span>
            </label>
          </div>
        </div>

        {/* Messages de statut */}
        {submitStatus.type && (
          <div
            className={`p-4 rounded-xl items-center mb-4 ${
              submitStatus.type === "success"
                ? "bg-primary/10 text-darkBlue border border-primary/30"
                : "bg-red-50 text-red-800 border border-red-200"
            }`}
          >
            <div className="flex items-center space-x-3">
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
