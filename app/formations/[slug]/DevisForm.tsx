"use client";

import Button from "@/components/UI/Button";
import { FormationWithDetails } from "@/types/formationDetails";
import { useState } from "react";

interface DevisFormProps {
  formation: FormationWithDetails;
}

export default function DevisForm({ formation }: DevisFormProps) {
  const [formData, setFormData] = useState({
    nom: "",
    prenom: "",
    email: "",
    telephone: "",
    profil: "entreprise", // entreprise ou particulier
    modalite: "", // sur-site ou elearning
    apprenants: 4,
    ville: "",
    codePostal: "",
    message: "",
  });

  const getAvailableModalites = () => {
    const options = [];
    if (formation.availableInCenter) {
      options.push({ value: "sur-site", label: "Sur site" });
    }
    if (formation.availableElearning) {
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Données du formulaire:", formData);
    // Ici vous pourrez ajouter la logique d'envoi du formulaire
  };

  const modaliteOptions = getAvailableModalites();

  return (
    <div className="bg-white rounded-3xl   p-8 shadow-[0_0_30px_rgba(18,94,255,0.1)] border border-primary/20">
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
        <div className="flex flex-col md:flex-row gap-4">
          {/* Profil */}
          <div className="w-full">
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
              className="w-full px-4 py-3 border border-grayBlue/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent font-satoshi"
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
            placeholder="Ex: Plus de 10 apprenants, besoins particuliers..."
            className="w-full px-4 py-3 border border-grayBlue/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent font-satoshi resize-none"
          />
        </div>

        {/* Bouton de soumission */}
        <Button type="submit" variant="secondary" className="w-fit">
          Demander un devis
        </Button>
      </form>
    </div>
  );
}
