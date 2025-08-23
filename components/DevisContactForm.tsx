"use client";

import Button from "@/components/UI/Button";
import { CategoryWithCount } from "@/types/category";
import { FormationCardData } from "@/types/formation";
import { useEffect, useState } from "react";

interface DevisContactFormProps {
  categories: CategoryWithCount[];
}

interface FormationOption {
  id: number;
  title: string;
  slug: string;
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
    modalite: "", // sur-site ou elearning
    apprenants: 4,
    ville: "",
    codePostal: "",
    message: "",
  });

  const [formations, setFormations] = useState<FormationOption[]>([]);
  const [isLoadingFormations, setIsLoadingFormations] = useState(false);
  const [selectedFormation, setSelectedFormation] =
    useState<FormationCardData | null>(null);

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
        setSelectedFormation(null);
        setFormData((prev) => ({ ...prev, formationId: "", modalite: "" }));
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
            data.formations.map((f: FormationCardData) => ({
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

  // Charger les détails de la formation sélectionnée
  useEffect(() => {
    const loadFormationDetails = async () => {
      if (!formData.formationId) {
        setSelectedFormation(null);
        setFormData((prev) => ({ ...prev, modalite: "" }));
        return;
      }

      try {
        const selectedFormationOption = formations.find(
          (f) => f.id.toString() === formData.formationId
        );
        if (!selectedFormationOption) return;

        const response = await fetch(
          `/api/formations/${selectedFormationOption.slug}`
        );
        const data = await response.json();

        if (response.ok) {
          setSelectedFormation(data.formation);
        }
      } catch (error) {
        console.error(
          "Erreur lors du chargement des détails de la formation:",
          error
        );
      }
    };

    loadFormationDetails();
  }, [formData.formationId, formations]);

  const getAvailableModalites = () => {
    if (!selectedFormation) return [];

    const options = [];
    if (
      selectedFormation.location === "center" ||
      selectedFormation.location === "both"
    ) {
      options.push({ value: "sur-site", label: "Sur site" });
    }
    if (
      selectedFormation.location === "elearning" ||
      selectedFormation.location === "both"
    ) {
      options.push({ value: "elearning", label: "E-learning" });
    }
    return options;
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
          ...formData,
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
          modalite: "",
          apprenants: 4,
          ville: "",
          codePostal: "",
          message: "",
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

  const modaliteOptions = getAvailableModalites();

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

        <div className="flex flex-col md:flex-row gap-4">
          {/* Modalité */}
          {modaliteOptions.length > 1 && (
            <div className="w-full">
              <label
                htmlFor="modalite"
                className="block text-sm font-satoshi font-medium text-darkBlue mb-2"
              >
                Modalité *
              </label>
              <select
                id="modalite"
                name="modalite"
                value={formData.modalite}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border border-grayBlue/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent font-satoshi bg-white"
              >
                <option value="">Choisir une modalité</option>
                {modaliteOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          )}

          {modaliteOptions.length === 1 && (
            <div className="w-full">
              <label className="block text-sm font-satoshi font-medium text-darkBlue mb-2">
                Modalité
              </label>
              <div className="w-full px-4 py-3 border border-grayBlue/30 rounded-xl bg-gray-50 font-satoshi text-darkBlue/70">
                {modaliteOptions[0].label}
              </div>
            </div>
          )}

          {/* Nombre d'apprenants */}
          <div className="w-full">
            <label
              htmlFor="apprenants"
              className="block text-sm font-satoshi font-medium text-darkBlue mb-2"
            >
              Apprenants * (4-10)
            </label>
            <input
              type="number"
              id="apprenants"
              name="apprenants"
              min="4"
              max="10"
              value={formData.apprenants}
              onChange={handleInputChange}
              required
              className="bg-white w-full px-4 py-3 border border-grayBlue/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent font-satoshi"
            />
          </div>
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
