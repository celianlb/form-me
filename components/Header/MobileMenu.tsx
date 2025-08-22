"use client";

import Button from "@/components/UI/Button";
import Link from "next/link";
import { useState } from "react";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  const [isFormationsOpen, setIsFormationsOpen] = useState(false);

  if (!isOpen) return null;

  // Catégories temporaires - à remplacer par les vraies catégories
  const formationCategories = [
    { name: "Développement Web", href: "/formations/category?cat=dev-web" },
    { name: "Design UX/UI", href: "/formations/category?cat=design" },
    { name: "Marketing Digital", href: "/formations/category?cat=marketing" },
    { name: "Gestion de Projet", href: "/formations/category?cat=gestion" },
    { name: "Data Science", href: "/formations/category?cat=data" },
    { name: "Cybersécurité", href: "/formations/category?cat=security" },
  ];

  return (
    <div className="lg:hidden bg-white border-t border-platinium">
      <div className="py-4 space-y-4">
        {/* Navigation Links */}
        <div className="space-y-2">
          {/* Formations avec sous-menu */}
          <div>
            <button
              onClick={() => setIsFormationsOpen(!isFormationsOpen)}
              className="flex items-center justify-between w-full px-0 py-2 text-blackBlue hover:text-primary transition-colors font-satoshi font-medium"
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
                {formationCategories.map((category) => (
                  <Link
                    key={category.name}
                    href={category.href}
                    onClick={onClose}
                    className="block py-1 text-grayBlue hover:text-primary transition-colors font-satoshi text-sm"
                  >
                    {category.name}
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
          <Button
            href="/connexion"
            className="w-full justify-center bg-transparent border border-blackBlue text-blackBlue px-6 py-3 rounded-lg text-sm font-medium hover:bg-blackBlue hover:text-white transition-colors inline-flex items-center"
          >
            Connexion
          </Button>
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
