"use client";

import Button from "@/components/UI/Button";
import { FormationWithDetails } from "@/types/formationDetails";
import { Mail, Phone, User } from "lucide-react";
import { useState } from "react";

interface ApplicationFormProps {
  formation: FormationWithDetails;
}

export default function ApplicationForm({ formation }: ApplicationFormProps) {
  const [formData, setFormData] = useState({
    prenom: "",
    nom: "",
    email: "",
    telephone: "",
    disponibilite: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "success" | "error"
  >("idle");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus("idle");

    try {
      const response = await fetch("/api/send-application", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          formationTitle: formation.title,
          formationSlug: formation.slug,
        }),
      });

      if (response.ok) {
        setSubmitStatus("success");
        setFormData({
          prenom: "",
          nom: "",
          email: "",
          telephone: "",
          disponibilite: "",
        });
      } else {
        setSubmitStatus("error");
      }
    } catch (error) {
      console.error("Erreur lors de l'envoi de la candidature:", error);
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl p-8 shadow-[0_0px_20px_rgba(18,94,255,0.1)] border border-primary/20">
      <div className="mb-6">
        <h3 className="font-satoshi font-bold text-2xl text-darkBlue mb-2">
          Candidater à cette formation
        </h3>
        <p className="text-grayBlue font-satoshi text-sm">
          Remplissez ce formulaire et nous reviendrons vers vous rapidement.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Prénom & Nom */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block font-satoshi font-medium text-darkBlue mb-2 text-sm">
              Prénom *
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                name="prenom"
                value={formData.prenom}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:border-primary focus:outline-none font-satoshi text-sm"
                placeholder="Votre prénom"
                required
              />
            </div>
          </div>
          <div>
            <label className="block font-satoshi font-medium text-darkBlue mb-2 text-sm">
              Nom *
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                name="nom"
                value={formData.nom}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:border-primary focus:outline-none font-satoshi text-sm"
                placeholder="Votre nom"
                required
              />
            </div>
          </div>
        </div>

        {/* Email & Téléphone */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block font-satoshi font-medium text-darkBlue mb-2 text-sm">
              Email *
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:border-primary focus:outline-none font-satoshi text-sm"
                placeholder="votre.email@example.com"
                required
              />
            </div>
          </div>
          <div>
            <label className="block font-satoshi font-medium text-darkBlue mb-2 text-sm">
              Téléphone *
            </label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="tel"
                name="telephone"
                value={formData.telephone}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:border-primary focus:outline-none font-satoshi text-sm"
                placeholder="06 12 34 56 78"
                required
              />
            </div>
          </div>
        </div>

        {/* Disponibilité */}
        <div>
          <label className="block font-satoshi font-medium text-darkBlue mb-2 text-sm">
            Disponibilité *
          </label>
          <textarea
            name="disponibilite"
            value={formData.disponibilite}
            onChange={handleChange}
            rows={4}
            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:border-primary focus:outline-none font-satoshi text-sm resize-none"
            placeholder="Décrivez vos disponibilités et motivations..."
            required
          />
        </div>

        {/* Messages de statut */}
        {submitStatus === "success" && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <p className="text-green-800 font-satoshi text-sm">
              ✓ Votre candidature a été envoyée avec succès ! Nous vous
              recontacterons rapidement.
            </p>
          </div>
        )}

        {submitStatus === "error" && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-800 font-satoshi text-sm">
              ✗ Une erreur est survenue. Veuillez réessayer ou nous contacter
              directement.
            </p>
          </div>
        )}

        {/* Bouton submit */}
        <Button
          type="submit"
          variant="primary"
          className="w-full"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Envoi en cours..." : "Envoyer ma candidature"}
        </Button>
      </form>
    </div>
  );
}
