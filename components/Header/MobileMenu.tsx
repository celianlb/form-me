"use client";

import Button from "@/components/UI/Button";
import { CategoryWithCount } from "@/types/category";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  categories?: CategoryWithCount[];
}

export default function MobileMenu({
  isOpen,
  onClose,
  categories = [],
}: MobileMenuProps) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isFormationsOpen, setIsFormationsOpen] = useState(false);

  const handleDashboardClick = () => {
    if (session?.user) {
      onClose();
      if (session.user.role === "ADMIN") {
        router.push("/admin/dashboard");
      } else if (session.user.role === "LEARNER") {
        router.push("/dashboard");
      }
    }
  };

  const handleSignOut = async () => {
    onClose();
    try {
      // Utiliser redirect: false pour éviter les boucles
      const result = await signOut({
        redirect: false,
      });

      // Redirection manuelle après déconnexion réussie
      if (result?.url) {
        window.location.href = result.url;
      } else {
        window.location.href = "/";
      }
    } catch (error) {
      console.error("Erreur lors de la déconnexion:", error);
      // Fallback : redirection manuelle
      window.location.href = "/";
    }
  };

  if (!isOpen) return null;

  return (
    <div className="lg:hidden border-t border-platinium">
      <div className="py-4 space-y-4">
        {/* Navigation Links */}
        <div className="space-y-2">
          {/* Formations avec sous-menu */}
          <div>
            <button
              onClick={() => setIsFormationsOpen(!isFormationsOpen)}
              className="flex items-center cursor-pointer justify-between w-full px-0 py-2 text-blackBlue hover:text-primary transition-colors font-satoshi font-medium"
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

            {/* Sous-catégories de formations */}
            {isFormationsOpen && (
              <div className="ml-4 mt-2 space-y-2">
                {categories.map((category) => (
                  <Link
                    key={category.id}
                    href={`/formations/category/${category.slug}`}
                    onClick={onClose}
                    className="block py-1 text-grayBlue hover:text-primary transition-colors font-satoshi text-sm"
                  >
                    <div className="flex justify-between items-center">
                      <span>{category.name}</span>
                      <span className="text-xs text-grayBlue/70">
                        {category.trainingCount}
                      </span>
                    </div>
                  </Link>
                ))}
                <Link
                  href="/formations"
                  onClick={onClose}
                  className="block py-1 text-primary font-satoshi font-medium text-sm"
                >
                  Voir toutes les formations →
                </Link>
              </div>
            )}
          </div>

          {/* Valeurs & Engagements */}
          <Link
            href="/valeurs-&-engagements"
            onClick={onClose}
            className="block py-2 text-blackBlue hover:text-primary transition-colors font-satoshi font-medium"
          >
            Valeurs & Engagements
          </Link>

          {/* À propos */}
          <Link
            href="/a-propos"
            onClick={onClose}
            className="block py-2 text-blackBlue hover:text-primary transition-colors font-satoshi font-medium"
          >
            À propos
          </Link>
        </div>

        {/* Buttons */}
        <div className="space-y-3 pt-4 border-t border-platinium">
          {status === "loading" ? (
            <div className="w-full h-10 bg-gray-200 rounded-lg animate-pulse"></div>
          ) : session?.user ? (
            <div className="space-y-2">
              {/* User info */}
              <div className="w-full flex items-center space-x-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M12 12C14.4862 12 16.5 9.98625 16.5 7.5C16.5 5.01375 14.4862 3 12 3C9.51375 3 7.5 5.01375 7.5 7.5C7.5 9.98625 9.51375 12 12 12ZM12 14.25C8.99625 14.25 3 15.7575 3 18.75V21H21V18.75C21 15.7575 15.0037 14.25 12 14.25Z"
                    fill="#125EFF"
                  />
                </svg>
                <div className="flex-1">
                  <p className="text-blue-700 font-medium text-sm">
                    {session.user.name || session.user.email}
                  </p>
                  <p className="text-xs text-blue-600">{session.user.role}</p>
                </div>
              </div>

              {/* User actions */}
              <div className="space-y-1">
                <button
                  onClick={handleDashboardClick}
                  className="w-full flex items-center space-x-2 p-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16M4 18h7"
                    />
                  </svg>
                  <span className="text-sm">
                    {session.user.role === "ADMIN"
                      ? "Dashboard Admin"
                      : "Mes Formations"}
                  </span>
                </button>

                <button
                  onClick={handleSignOut}
                  className="w-full flex items-center space-x-2 p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                    />
                  </svg>
                  <span className="text-sm">Se déconnecter</span>
                </button>
              </div>
            </div>
          ) : (
            <Button
              variant="secondary"
              href="/auth/signin"
              className="w-full justify-center"
            >
              Connexion
            </Button>
          )}
          <Button
            href="/devis-&-contact"
            variant="primary"
            className="w-full justify-center"
          >
            Devis
          </Button>
        </div>
      </div>
    </div>
  );
}
