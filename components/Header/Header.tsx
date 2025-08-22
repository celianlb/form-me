"use client";

import Button from "@/components/UI/Button";
import Link from "next/link";
import { useState, useEffect } from "react";
import Logo from "./Logo";
import MobileMenu from "./MobileMenu";
import Navigation from "./Navigation";
import { Category } from "@/types/category";

interface HeaderProps {
  categories?: Category[];
}

export default function Header({ categories = [] }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isFormationsOpen, setIsFormationsOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

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
          <Button href="/connexion" variant="secondary">
            Connexion
          </Button>
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
          <div className="grid grid-cols-2 gap-4 max-w-md">
            <div className="space-y-2">
              {categories.filter((_, index) => index % 2 === 0).map((category) => (
                <Link
                  key={category.id}
                  href={`/formations/category/${category.slug}`}
                  className="block text-blackBlue hover:text-primary transition-colors font-satoshi text-sm"
                  onClick={() => setIsFormationsOpen(false)}
                >
                  {category.name}
                </Link>
              ))}
            </div>
            <div className="space-y-2">
              {categories.filter((_, index) => index % 2 === 1).map((category) => (
                <Link
                  key={category.id}
                  href={`/formations/category/${category.slug}`}
                  className="block text-blackBlue hover:text-primary transition-colors font-satoshi text-sm"
                  onClick={() => setIsFormationsOpen(false)}
                >
                  {category.name}
                </Link>
              ))}
            </div>
          </div>
          <div className="mt-4 pt-2 border-t border-darkBlue/20">
            <Link
              href="/formations"
              className="text-primary font-satoshi font-medium text-sm hover:underline"
              onClick={() => setIsFormationsOpen(false)}
            >
              Voir toutes les formations →
            </Link>
          </div>
        </div>
      )}

      {/* Mobile Menu */}
      <MobileMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
    </header>
  );
}
