"use client";

import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { ArrowRight } from "lucide-react";

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

interface SessionCardProps {
  session: Session;
  onReserve: (session: Session) => void;
}

export default function SessionCard({ session, onReserve }: SessionCardProps) {
  const startDate = new Date(session.startDate);
  const endDate = session.endDate ? new Date(session.endDate) : null;

  // Format: "29 jan" or "29-30 jan"
  const formatShortDate = () => {
    const day = format(startDate, "d", { locale: fr });
    const month = format(startDate, "MMM", { locale: fr });

    if (endDate && format(endDate, "d") !== day) {
      const endDay = format(endDate, "d", { locale: fr });
      return { day: `${day}-${endDay}`, month };
    }
    return { day, month };
  };

  const { day, month } = formatShortDate();
  const modeLabel = session.mode === "E_LEARNING" ? "E-learning" : "Présentiel";

  return (
    <button
      onClick={() => !session.isFull && onReserve(session)}
      disabled={session.isFull}
      className={`
        w-full text-left rounded-2xl p-4 border-2 transition-all duration-200 group
        ${session.isFull
          ? "border-gray-200 bg-gray-50 opacity-50 cursor-not-allowed"
          : "border-dashed border-gray-200 hover:border-solid hover:border-primary bg-white hover:bg-primary/5"
        }
      `}
    >
      <div className="flex items-center justify-between gap-3">
        {/* Left: Date block */}
        <div className="flex items-center gap-4">
          {/* Date compact */}
          <div className={`
            text-center min-w-13 py-2 px-3 rounded-xl
            ${session.isFull ? "bg-gray-100" : "bg-primary/10"}
          `}>
            <p className={`
              font-sora font-bold text-lg leading-tight
              ${session.isFull ? "text-grayBlue" : "text-primary"}
            `}>
              {day}
            </p>
            <p className={`
              font-satoshi text-xs uppercase tracking-wide
              ${session.isFull ? "text-grayBlue/70" : "text-primary/70"}
            `}>
              {month}
            </p>
          </div>

          {/* Info */}
          <div>
            <p className="font-satoshi font-semibold text-darkBlue text-sm">
              {modeLabel}
              {session.location && session.mode === "PARTNER_CENTER" && (
                <span className="text-grayBlue font-normal"> · {session.location}</span>
              )}
            </p>
            {session.availableSpots !== null && (
              <p className={`
                font-satoshi text-xs mt-0.5
                ${session.isFull ? "text-red-500" : "text-grayBlue"}
              `}>
                {session.isFull
                  ? "Complet"
                  : `${session.availableSpots} place${session.availableSpots > 1 ? "s" : ""} disponible${session.availableSpots > 1 ? "s" : ""}`
                }
              </p>
            )}
          </div>
        </div>

        {/* Right: Arrow */}
        {!session.isFull && (
          <div className="w-8 h-8 rounded-full bg-gray-100 group-hover:bg-primary flex items-center justify-center transition-colors shrink-0">
            <ArrowRight className="w-4 h-4 text-grayBlue group-hover:text-white transition-colors" />
          </div>
        )}
      </div>
    </button>
  );
}
