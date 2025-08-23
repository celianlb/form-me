"use client";

import Button from "@/components/UI/Button";
import { CategoryWithCount } from "@/types/category";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import Logo from "./Logo";
import MobileMenu from "./MobileMenu";
import Navigation from "./Navigation";

interface HeaderProps {
  categories?: CategoryWithCount[];
}

export default function Header({ categories = [] }: HeaderProps) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isFormationsOpen, setIsFormationsOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const handleUserClick = () => {
    setIsUserMenuOpen(!isUserMenuOpen);
  };

  const handleDashboardClick = () => {
    if (session?.user) {
      if (session.user.role === "ADMIN") {
        router.push("/admin/dashboard");
      } else if (session.user.role === "LEARNER") {
        router.push("/dashboard");
      }
    }
    setIsUserMenuOpen(false);
  };

  const handleSignOut = async () => {
    setIsUserMenuOpen(false);
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

  // Fermer le menu utilisateur si on clique ailleurs
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(event.target as Node)
      ) {
        setIsUserMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <header
      className={`fixed mx-5 lg:mx-[120px] rounded-b-3xl px-6 py-4 lg:px-12 top-0 left-0 right-0 z-50 bg-white/40 backdrop-blur-md border-b border-l border-r border-darkBlue/20 transition-all duration-300 ${
        isFormationsOpen ? "pb-8" : ""
      }`}
    >
      <div className="flex items-center justify-between h-16">
        {/* Logo */}
        <Logo />

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center space-x-8">
          <Navigation
            isFormationsOpen={isFormationsOpen}
            setIsFormationsOpen={setIsFormationsOpen}
          />
        </div>

        {/* Desktop Buttons */}
        <div className="hidden lg:flex items-center space-x-4">
          {status === "loading" ? (
            // Loading state
            <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse"></div>
          ) : session?.user ? (
            // User connected - show user menu
            <div className="relative" ref={userMenuRef}>
              <button
                onClick={handleUserClick}
                className="flex cursor-pointer items-center space-x-2 px-3 py-2 rounded-full hover:bg-gray-100 transition-colors"
                title="Menu utilisateur"
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M12 12C14.4862 12 16.5 9.98625 16.5 7.5C16.5 5.01375 14.4862 3 12 3C9.51375 3 7.5 5.01375 7.5 7.5C7.5 9.98625 9.51375 12 12 12ZM12 14.25C8.99625 14.25 3 15.7575 3 18.75V21H21V18.75C21 15.7575 15.0037 14.25 12 14.25Z"
                    fill="#125EFF"
                  />
                </svg>
                <span className="text-sm text-gray-700 font-medium">
                  {session.user.name || session.user.email}
                </span>
                <svg
                  className={`w-4 h-4 transition-transform ${
                    isUserMenuOpen ? "rotate-180" : ""
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

              {/* Dropdown Menu */}
              {isUserMenuOpen && (
                <div className="absolute w-fit right-0 mt-2 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50">
                  <div className="px-4 py-2 w-fit border-b border-gray-100">
                    <p className="text-sm w-fit font-medium text-gray-900">
                      {session.user.name || session.user.email}
                    </p>
                    <p className="text-xs text-gray-500">{session.user.role}</p>
                  </div>

                  <button
                    onClick={handleDashboardClick}
                    className="w-full cursor-pointer text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <span className="flex items-center">
                      <svg
                        className="w-4 h-4 mr-2"
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
                      {session.user.role === "ADMIN"
                        ? "Dashboard Admin"
                        : "Mes Formations"}
                    </span>
                  </button>

                  <button
                    onClick={handleSignOut}
                    className="w-full cursor-pointer text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <span className="flex items-center">
                      <svg
                        className="w-4 h-4 mr-2"
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
                      Se déconnecter
                    </span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            // User not connected - show login button
            <Button href="/auth/signin" variant="secondary">
              Connexion
            </Button>
          )}
          <Button href="/devis-&-contact" variant="primary">
            Devis
          </Button>
        </div>

        {/* Mobile Burger Menu */}
        <button
          onClick={toggleMenu}
          className="lg:hidden flex flex-col items-center justify-center w-6 h-6 space-y-1"
        >
          <span
            className={`w-6 h-0.5 bg-blackBlue transition-transform duration-300 ${
              isMenuOpen ? "rotate-45 translate-y-2" : ""
            }`}
          />
          <span
            className={`w-6 h-0.5 bg-blackBlue transition-opacity duration-300 ${
              isMenuOpen ? "opacity-0" : ""
            }`}
          />
          <span
            className={`w-6 h-0.5 bg-blackBlue transition-transform duration-300 ${
              isMenuOpen ? "-rotate-45 -translate-y-2" : ""
            }`}
          />
        </button>
      </div>

      {/* Formations Dropdown intégré dans le header */}
      {isFormationsOpen && (
        <div className="hidden lg:block mt-4 pb-4">
          <div className="grid grid-cols-4 gap-3">
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/formations/category/${category.slug}`}
                className="flex flex-col justify-between bg-platinium/10 border border-primary/30 p-3 rounded-xl font-medium text-grayBlue hover:text-primary transition-colors font-satoshi text-[14px] min-h-[70px]"
                onClick={() => setIsFormationsOpen(false)}
              >
                <div className="flex-1">{category.name}</div>
                <div className="text-xs text-grayBlue/70 mt-2">
                  {category.trainingCount} formation
                  {category.trainingCount > 1 ? "s" : ""}
                </div>
              </Link>
            ))}
          </div>
          <div className="mt-4 pt-2 border-t border-darkBlue/20 hover:translate-x-1 transition-all duration-300">
            <Link
              href="/formations"
              className="text-primary w-full font-satoshi font-medium text-sm "
              onClick={() => setIsFormationsOpen(false)}
            >
              Voir toutes les formations →
            </Link>
          </div>
        </div>
      )}

      {/* Mobile Menu */}
      <MobileMenu
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        categories={categories}
      />
    </header>
  );
}
