"use client";

import { useState, useEffect, useMemo } from "react";
import { ChevronLeft, ChevronRight, CheckCircle } from "lucide-react";
import { format, isSameMonth, startOfMonth, addMonths, subMonths } from "date-fns";
import { fr } from "date-fns/locale";
import SessionCard from "./SessionCard";
import SessionReservationModal from "./SessionReservationModal";
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

interface SessionsSectionProps {
  formationId: number;
  formationTitle: string;
  categoryName?: string;
}

export default function SessionsSection({
  formationId,
  formationTitle,
  categoryName,
}: SessionsSectionProps) {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(startOfMonth(new Date()));

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const response = await fetch(
          `/api/sessions/public?trainingId=${formationId}`
        );
        if (response.ok) {
          const data = await response.json();
          setSessions(data);
        }
      } catch (error) {
        console.error("Error fetching sessions:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchSessions();
  }, [formationId]);

  // Filter sessions by current month
  const filteredSessions = useMemo(() => {
    return sessions.filter((session) =>
      isSameMonth(new Date(session.startDate), currentMonth)
    );
  }, [sessions, currentMonth]);

  // Count sessions per month for navigation
  const getSessionCountForMonth = (monthOffset: number) => {
    const targetMonth = addMonths(currentMonth, monthOffset);
    return sessions.filter((session) =>
      isSameMonth(new Date(session.startDate), targetMonth)
    ).length;
  };

  const handlePrevMonth = () => {
    setCurrentMonth((prev) => subMonths(prev, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth((prev) => addMonths(prev, 1));
  };

  const handleReserve = (session: Session) => {
    setSelectedSession(session);
  };

  const handleCloseModal = () => {
    setSelectedSession(null);
  };

  const handleSuccess = () => {
    setSelectedSession(null);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 5000);
  };

  const prevMonthCount = getSessionCountForMonth(-1);
  const nextMonthCount = getSessionCountForMonth(1);

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
    <>
      <div className="bg-white rounded-4xl overflow-hidden border border-gray-100 shadow-xl shadow-darkBlue/10">
        {/* Header with month navigation */}
        <div className="bg-gray-50 border-b border-gray-100 px-5 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={handlePrevMonth}
              className="p-2 rounded-xl hover:bg-gray-200 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              disabled={prevMonthCount === 0 && filteredSessions.length === 0}
            >
              <ChevronLeft className="w-5 h-5 text-darkBlue" />
            </button>

            <div className="text-center">
              <p className="font-sora font-bold text-darkBlue capitalize">
                {format(currentMonth, "MMMM yyyy", { locale: fr })}
              </p>
              <p className="text-xs text-grayBlue font-satoshi mt-0.5">
                {filteredSessions.length} session{filteredSessions.length > 1 ? "s" : ""} disponible{filteredSessions.length > 1 ? "s" : ""}
              </p>
            </div>

            <button
              onClick={handleNextMonth}
              className="p-2 rounded-xl hover:bg-gray-200 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              disabled={nextMonthCount === 0}
            >
              <ChevronRight className="w-5 h-5 text-darkBlue" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-5">
          {/* Success message */}
          {showSuccess && (
            <div className="mb-4 p-4 bg-green-50 border-2 border-dashed border-green-200 rounded-2xl">
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
            /* No sessions at all */
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
            /* No sessions for current month */
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
            /* Sessions list */
            <div className="space-y-3">
              {filteredSessions.map((session) => (
                <SessionCard
                  key={session.id}
                  session={session}
                  onReserve={handleReserve}
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
                    {sessions.length} session{sessions.length > 1 ? "s" : ""} au total
                  </span>
                </div>
                <div className="bg-primary rounded-xl px-3 py-1.5 rotate-1 shadow-sm">
                  <span className="font-satoshi font-bold text-xs text-white">
                    Réponse 24h
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {selectedSession && (
        <SessionReservationModal
          session={selectedSession}
          formationId={formationId}
          formationTitle={formationTitle}
          categoryName={categoryName}
          onClose={handleCloseModal}
          onSuccess={handleSuccess}
        />
      )}
    </>
  );
}
