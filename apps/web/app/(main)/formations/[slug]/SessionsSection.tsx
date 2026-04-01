"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import {
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  ArrowLeft,
  Calendar,
  Users,
  X,
} from "lucide-react";
import {
  format,
  isSameMonth,
  startOfMonth,
  addMonths,
  subMonths,
} from "date-fns";
import { fr } from "date-fns/locale";
import SessionCard from "./SessionCard";
import Button from "@/components/UI/Button";

export interface Session {
  id: number;
  title: string;
  startDate: string;
  endDate: string | null;
  mode: "PARTNER_CENTER" | "E_LEARNING" | "INTRA_COMPANY";
  location: string | null;
  availableSpots: number | null;
  isFull: boolean;
}

interface SessionsSectionProps {
  formationId: number;
  formationTitle: string;
  categoryName?: string;
  initialSessions?: Session[];
}

const modeLabels: Record<string, string> = {
  PARTNER_CENTER: "Présentiel",
  E_LEARNING: "E-learning",
  INTRA_COMPANY: "Intra entreprise",
};

type Step = "list" | "form";
type MonthDirection = "next" | "prev" | null;

export default function SessionsSection({
  formationId,
  formationTitle,
  categoryName,
  initialSessions,
}: SessionsSectionProps) {
  const [sessions, setSessions] = useState<Session[]>(initialSessions || []);
  const [loading, setLoading] = useState(!initialSessions);
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(startOfMonth(new Date()));

  // Animation state
  const [step, setStep] = useState<Step>("list");
  const [isAnimating, setIsAnimating] = useState(false);
  const [slideClass, setSlideClass] = useState("");
  const [monthSlideClass, setMonthSlideClass] = useState("");
  const [monthDirection, setMonthDirection] = useState<MonthDirection>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  // Form state
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

  useEffect(() => {
    if (initialSessions) return;

    const fetchSessions = async () => {
      try {
        const response = await fetch(
          `/api/sessions/public?trainingId=${formationId}`
        );
        if (response.ok) {
          const data = await response.json();
          setSessions(data);
        }
      } catch (err) {
        console.error("Error fetching sessions:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchSessions();
  }, [formationId, initialSessions]);

  const filteredSessions = useMemo(() => {
    return sessions.filter((session) =>
      isSameMonth(new Date(session.startDate), currentMonth)
    );
  }, [sessions, currentMonth]);

  // Month navigation with animation
  const handleMonthChange = (direction: "prev" | "next") => {
    if (isAnimating) return;
    setIsAnimating(true);
    setMonthDirection(direction);

    // Slide out
    setMonthSlideClass(
      direction === "next"
        ? "translate-x-[-20px] opacity-0"
        : "translate-x-[20px] opacity-0"
    );

    setTimeout(() => {
      setCurrentMonth((prev) =>
        direction === "next" ? addMonths(prev, 1) : subMonths(prev, 1)
      );
      // Prep slide in from opposite side
      setMonthSlideClass(
        direction === "next"
          ? "translate-x-[20px] opacity-0"
          : "translate-x-[-20px] opacity-0"
      );

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setMonthSlideClass("translate-x-0 opacity-100");
          setTimeout(() => {
            setIsAnimating(false);
            setMonthDirection(null);
          }, 250);
        });
      });
    }, 200);
  };

  // Step transitions
  const handleSelectSession = (session: Session) => {
    if (isAnimating) return;
    setIsAnimating(true);
    setSlideClass("translate-x-[-30px] opacity-0 scale-[0.98]");

    setTimeout(() => {
      setSelectedSession(session);
      setStep("form");
      setError(null);
      setFormData({
        nom: "",
        prenom: "",
        email: "",
        telephone: "",
        profil: "entreprise",
        apprenants: "1",
      });
      setSlideClass("translate-x-[30px] opacity-0 scale-[0.98]");

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setSlideClass("translate-x-0 opacity-100 scale-100");
          setTimeout(() => setIsAnimating(false), 300);
        });
      });
    }, 250);
  };

  const handleBack = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setSlideClass("translate-x-[30px] opacity-0 scale-[0.98]");

    setTimeout(() => {
      setSelectedSession(null);
      setStep("list");
      setError(null);
      setSlideClass("translate-x-[-30px] opacity-0 scale-[0.98]");

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setSlideClass("translate-x-0 opacity-100 scale-100");
          setTimeout(() => setIsAnimating(false), 300);
        });
      });
    }, 250);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSession) return;
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
          sessionId: selectedSession.id,
          apprenants: parseInt(formData.apprenants) || 1,
          formationTitle,
          categoryName,
          isReservation: true,
        }),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        // Animate back to list with success
        setSlideClass("translate-x-[30px] opacity-0 scale-[0.98]");
        setTimeout(() => {
          setSelectedSession(null);
          setStep("list");
          setShowSuccess(true);
          setTimeout(() => setShowSuccess(false), 5000);
          setSlideClass("translate-x-[-30px] opacity-0 scale-[0.98]");

          requestAnimationFrame(() => {
            requestAnimationFrame(() => {
              setSlideClass("translate-x-0 opacity-100 scale-100");
            });
          });
        }, 250);
      } else {
        setError(result.error || "Une erreur est survenue");
      }
    } catch {
      setError("Erreur de connexion. Veuillez réessayer.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-4xl p-6 border border-gray-100 shadow-xl shadow-darkBlue/10">
        <div className="animate-pulse space-y-4">
          <div className="h-5 bg-gray-200 rounded w-32" />
          <div className="h-12 bg-gray-100 rounded-2xl" />
          <div className="h-16 bg-gray-100 rounded-2xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-4xl overflow-hidden border border-gray-100 shadow-xl shadow-darkBlue/10">
      {/* Header */}
      <div className="bg-gray-50 border-b border-gray-100 px-5 py-4">
        {step === "form" && selectedSession ? (
          <button
            onClick={handleBack}
            className="flex items-center gap-2 text-sm font-satoshi font-semibold text-darkBlue hover:text-primary transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            Retour aux sessions
          </button>
        ) : (
          <div className="flex items-center justify-between">
            <button
              onClick={() => handleMonthChange("prev")}
              className="p-2 rounded-xl hover:bg-gray-200 transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-5 h-5 text-darkBlue" />
            </button>

            <div
              className={`text-center transition-all duration-250 ease-out ${monthSlideClass}`}
            >
              <p className="font-sora font-bold text-darkBlue capitalize">
                {format(currentMonth, "MMMM yyyy", { locale: fr })}
              </p>
              <p className="text-xs text-grayBlue font-satoshi mt-0.5">
                {filteredSessions.length} session
                {filteredSessions.length > 1 ? "s" : ""} disponible
                {filteredSessions.length > 1 ? "s" : ""}
              </p>
            </div>

            <button
              onClick={() => handleMonthChange("next")}
              className="p-2 rounded-xl hover:bg-gray-200 transition-colors cursor-pointer"
            >
              <ChevronRight className="w-5 h-5 text-darkBlue" />
            </button>
          </div>
        )}
      </div>

      {/* Animated content area */}
      <div ref={contentRef} className="relative">
        <div
          className={`p-5 transition-all duration-300 ease-out ${slideClass}`}
        >
          {step === "form" && selectedSession ? (
            <>
              {/* Selected session summary */}
              <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100 mb-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                      <Calendar className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-satoshi font-bold text-darkBlue text-sm">
                        {format(
                          new Date(selectedSession.startDate),
                          "d MMMM yyyy",
                          { locale: fr }
                        )}
                      </p>
                      <p className="text-xs text-grayBlue font-satoshi">
                        {modeLabels[selectedSession.mode] ??
                          selectedSession.mode}
                      </p>
                    </div>
                  </div>
                  {selectedSession.availableSpots !== null && (
                    <div className="flex items-center gap-1.5 text-xs text-grayBlue font-satoshi">
                      <Users className="w-3.5 h-3.5" />
                      {selectedSession.availableSpots} place
                      {selectedSession.availableSpots > 1 ? "s" : ""}
                    </div>
                  )}
                </div>
              </div>

              {/* Inline form */}
              <form onSubmit={handleSubmit} className="space-y-4">
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
                      max={selectedSession.availableSpots || 99}
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
                    {isSubmitting
                      ? "Envoi en cours..."
                      : "Confirmer ma réservation"}
                  </Button>
                </div>

                <p className="text-xs text-grayBlue text-center font-satoshi">
                  Notre équipe vous contactera sous 24h pour finaliser votre
                  inscription
                </p>
              </form>
            </>
          ) : (
            <>
              {/* Success message */}
              {showSuccess && (
                <div className="mb-4 p-4 bg-green-50 border-2 border-dashed border-green-200 rounded-2xl animate-[fadeIn_0.3s_ease-out]">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center shrink-0">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                    </div>
                    <div>
                      <p className="font-satoshi font-bold text-green-800 text-sm">
                        Réservation envoyée !
                      </p>
                      <p className="text-xs text-green-700 font-satoshi">
                        Confirmation sous 24h
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {sessions.length === 0 ? (
                <div className="text-center py-6">
                  <div className="border-2 border-dashed border-gray-200 rounded-2xl p-6">
                    <p className="font-satoshi font-bold text-darkBlue mb-1">
                      Aucune session programmée
                    </p>
                    <p className="text-sm text-grayBlue font-satoshi mb-4">
                      Contactez-nous pour planifier une date
                    </p>
                    <Button href="/devis-&-contact" variant="secondary">
                      Demander une session
                    </Button>
                  </div>
                </div>
              ) : filteredSessions.length === 0 ? (
                <div className="text-center py-4">
                  <div className="border-2 border-dashed border-gray-200 rounded-2xl p-5">
                    <p className="font-satoshi text-sm text-grayBlue">
                      Aucune session ce mois-ci
                    </p>
                    <p className="text-xs text-grayBlue/70 font-satoshi mt-1">
                      Naviguez pour voir les autres dates
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredSessions.map((session) => (
                    <SessionCard
                      key={session.id}
                      session={session}
                      onReserve={handleSelectSession}
                    />
                  ))}
                </div>
              )}

              {/* Quick stats */}
              {sessions.length > 0 && (
                <div className="mt-5 pt-4 border-t border-gray-100">
                  <div className="flex items-center justify-center gap-2">
                    <div className="border-2 border-dashed border-gray-200 rounded-xl px-3 py-1.5">
                      <span className="font-satoshi font-bold text-xs text-darkBlue">
                        {sessions.length} session
                        {sessions.length > 1 ? "s" : ""} au total
                      </span>
                    </div>
                    <div className="bg-primary rounded-xl px-3 py-1.5 shadow-sm">
                      <span className="font-satoshi font-bold text-xs text-white">
                        Réponse 24h
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
