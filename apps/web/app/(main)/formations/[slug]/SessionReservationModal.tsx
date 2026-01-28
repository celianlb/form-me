"use client";

import { useState } from "react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { X, Calendar, Users, CheckCircle } from "lucide-react";
import Button from "@/components/UI/Button";

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

interface SessionReservationModalProps {
  session: Session;
  formationId: number;
  formationTitle: string;
  categoryName?: string;
  onClose: () => void;
  onSuccess: () => void;
}

export default function SessionReservationModal({
  session,
  formationId,
  formationTitle,
  categoryName,
  onClose,
  onSuccess,
}: SessionReservationModalProps) {
  const [formData, setFormData] = useState({
    nom: "",
    prenom: "",
    email: "",
    telephone: "",
    profil: "entreprise",
    apprenants: "1",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch("/api/send-devis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          ville: "Non renseigné",
          codePostal: "00000",
          formationId,
          sessionId: session.id,
          apprenants: parseInt(formData.apprenants) || 1,
          formationTitle,
          categoryName,
          isReservation: true,
        }),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        onSuccess();
      } else {
        setError(result.error || "Une erreur est survenue");
      }
    } catch {
      setError("Erreur de connexion. Veuillez réessayer.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const sessionDate = format(new Date(session.startDate), "d MMMM yyyy", {
    locale: fr,
  });
  const modeLabel = session.mode === "E_LEARNING" ? "E-learning" : "Présentiel";

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4 pt-20">
      {/* Backdrop - plus opaque pour meilleur contraste */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-md"
        onClick={onClose}
      />

      {/* Modal - ombre très prononcée, scrollable si besoin */}
      <div className="relative bg-white rounded-4xl w-full max-w-lg max-h-[calc(100vh-6rem)] overflow-y-auto shadow-[0_25px_60px_-15px_rgba(0,0,0,0.5)] ring-1 ring-white/20">
        {/* Header avec fond darkBlue */}
        <div className="relative bg-darkBlue p-6 overflow-hidden">
          {/* Blur decoratif */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/30 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-primary/20 rounded-full blur-2xl" />

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-white/60 hover:text-white transition-colors rounded-full hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="relative z-10">
            <div className="inline-block px-3 py-1.5 bg-primary/30 rounded-full mb-3">
              <span className="text-xs text-white font-satoshi font-semibold">
                Réservation
              </span>
            </div>
            <h3 className="text-xl font-satoshi font-bold text-white mb-1">
              {formationTitle}
            </h3>
            <div className="flex items-center gap-4 text-white/80 text-sm font-satoshi">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4" />
                {sessionDate}
              </span>
              <span>{modeLabel}</span>
            </div>
          </div>
        </div>

        {/* Session info badges */}
        <div className="px-6 -mt-4 relative z-20">
          <div className="bg-gray-100 rounded-2xl p-4 border border-gray-200 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                <Users className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-xs text-grayBlue font-satoshi">Places disponibles</p>
                <p className="font-satoshi font-bold text-darkBlue">
                  {session.availableSpots !== null ? (
                    <>{session.availableSpots} place{session.availableSpots > 1 ? "s" : ""}</>
                  ) : (
                    "Illimitées"
                  )}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="border-2 border-dashed border-gray-300 rounded-xl px-3 py-1.5">
                <span className="font-satoshi font-bold text-xs text-darkBlue">
                  Confirmation 24h
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-satoshi font-medium text-darkBlue mb-1.5">
                Nom
              </label>
              <input
                type="text"
                name="nom"
                value={formData.nom}
                onChange={handleInputChange}
                required
                placeholder="Dupont"
                className="w-full px-4 py-3 border border-grayBlue/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary font-satoshi text-sm bg-gray-50/50 transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-satoshi font-medium text-darkBlue mb-1.5">
                Prénom
              </label>
              <input
                type="text"
                name="prenom"
                value={formData.prenom}
                onChange={handleInputChange}
                required
                placeholder="Jean"
                className="w-full px-4 py-3 border border-grayBlue/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary font-satoshi text-sm bg-gray-50/50 transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-satoshi font-medium text-darkBlue mb-1.5">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              placeholder="jean.dupont@email.com"
              className="w-full px-4 py-3 border border-grayBlue/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary font-satoshi text-sm bg-gray-50/50 transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-satoshi font-medium text-darkBlue mb-1.5">
              Téléphone
            </label>
            <input
              type="tel"
              name="telephone"
              value={formData.telephone}
              onChange={handleInputChange}
              required
              placeholder="06 12 34 56 78"
              className="w-full px-4 py-3 border border-grayBlue/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary font-satoshi text-sm bg-gray-50/50 transition-all"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-satoshi font-medium text-darkBlue mb-1.5">
                Profil
              </label>
              <select
                name="profil"
                value={formData.profil}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-grayBlue/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary font-satoshi text-sm bg-gray-50/50 transition-all appearance-none cursor-pointer"
              >
                <option value="entreprise">Entreprise</option>
                <option value="particulier">Particulier</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-satoshi font-medium text-darkBlue mb-1.5">
                Participants
              </label>
              <input
                type="number"
                name="apprenants"
                min="1"
                max={session.availableSpots || 99}
                value={formData.apprenants}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border border-grayBlue/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary font-satoshi text-sm bg-gray-50/50 transition-all"
              />
            </div>
          </div>

          {error && (
            <div className="p-4 bg-red-50 border border-red-100 text-red-700 rounded-xl text-sm font-satoshi flex items-start gap-2">
              <X className="w-4 h-4 mt-0.5 flex-shrink-0" />
              {error}
            </div>
          )}

          <div className="pt-2">
            <Button
              type="submit"
              variant="dark"
              className="w-full justify-center"
              disabled={isSubmitting}
              icon={CheckCircle}
            >
              {isSubmitting ? "Envoi en cours..." : "Confirmer ma réservation"}
            </Button>
          </div>

          <p className="text-xs text-grayBlue text-center font-satoshi">
            Notre équipe vous contactera sous 24h pour finaliser votre inscription
          </p>
        </form>
      </div>
    </div>
  );
}
