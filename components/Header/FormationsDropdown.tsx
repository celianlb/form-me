"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { Category } from "@/types/category";

interface FormationsDropdownProps {
  isOpen: boolean;
  onClose: () => void;
  categories?: Category[];
}

export default function FormationsDropdown({ isOpen, onClose, categories = [] }: FormationsDropdownProps) {
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      ref={dropdownRef}
      className="absolute top-full left-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-platinium py-4 z-50"
    >
      <div className="px-4 pb-2 mb-2 border-b border-platinium">
        <h3 className="font-sora font-semibold text-blackBlue">Catégories de formations</h3>
      </div>
      
      <div className="space-y-1">
        {categories.map((category) => (
          <Link
            key={category.id}
            href={`/formations/category/${category.slug}`}
            onClick={onClose}
            className="block px-4 py-2 text-blackBlue hover:bg-primary/5 hover:text-primary transition-colors font-satoshi"
          >
            {category.name}
          </Link>
        ))}
        
        <div className="border-t border-platinium mt-2 pt-2">
          <Link
            href="/formations"
            onClick={onClose}
            className="block px-4 py-2 text-primary font-satoshi font-medium hover:bg-primary/5"
          >
            Voir toutes les formations →
          </Link>
        </div>
      </div>
    </div>
  );
}