"use client";

import Link from "next/link";

interface NavigationProps {
  isFormationsOpen: boolean;
  setIsFormationsOpen: (isOpen: boolean) => void;
}

export default function Navigation({
  isFormationsOpen,
  setIsFormationsOpen,
}: NavigationProps) {
  return (
    <nav className="flex items-center space-x-8">
      {/* Formations Link avec Dropdown */}
      <div className="relative">
        <button
          onClick={() => setIsFormationsOpen(!isFormationsOpen)}
          className="flex cursor-pointer items-center space-x-1 text-grayBlue hover:text-primary transition-colors font-satoshi font-medium"
        >
          <span>Formations</span>
          <svg
            className={`w-4 h-4 transition-transform duration-200 ${
              isFormationsOpen ? "rotate-180" : ""
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>
      </div>

      {/* Valeurs & Engagements 
      <Link
        href="/certifications-qualite"
        className="text-blackBlue hover:text-primary transition-colors font-satoshi font-medium"
      >
        Certifications & Qualité
      </Link>*/}

      {/* À propos */}
      <Link
        href="/nous-rejoindre"
        className="text-grayBlue hover:text-primary transition-colors font-satoshi font-medium"
      >
        Nous rejoindre
      </Link>
    </nav>
  );
}
