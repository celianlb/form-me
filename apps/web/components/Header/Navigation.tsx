"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface NavigationProps {
  isFormationsOpen: boolean;
  setIsFormationsOpen: (isOpen: boolean) => void;
}

export default function Navigation({
  isFormationsOpen,
  setIsFormationsOpen,
}: NavigationProps) {
  const pathname = usePathname();

  const isFormationsActive = pathname.startsWith("/formations");
  const isNousRejoindreActive = pathname === "/nous-rejoindre";

  return (
    <nav className="flex items-center space-x-2">
      {/* Formations Link avec Dropdown */}
      <div className="relative">
        <button
          onClick={() => setIsFormationsOpen(!isFormationsOpen)}
          className={`flex cursor-pointer items-center space-x-1.5 px-4 py-2 rounded-full font-satoshi font-medium text-sm transition-all duration-200 ${
            isFormationsOpen || isFormationsActive
              ? "bg-gray-100 text-darkBlue"
              : "text-grayBlue hover:bg-gray-100 hover:text-darkBlue"
          }`}
        >
          <span>Formations</span>
          <svg
            className={`w-3.5 h-3.5 transition-transform duration-200 ${
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

      {/* Nous rejoindre */}
      <Link
        href="/nous-rejoindre"
        className={`px-4 py-2 rounded-full font-satoshi font-medium text-sm transition-all duration-200 ${
          isNousRejoindreActive
            ? "bg-gray-100 text-darkBlue"
            : "text-grayBlue hover:bg-gray-100 hover:text-darkBlue"
        }`}
      >
        Nous rejoindre
      </Link>
    </nav>
  );
}
