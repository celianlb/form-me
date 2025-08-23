"use client";

import { CategoryOption } from "@/types/category";
import {
  homeDurationOptions,
  homeLocationOptions,
} from "@/utils/filterConstants";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Button from "../UI/Button";
import Dropdown from "../UI/Dropdown";
import SearchInput from "../UI/SearchInput";

interface SearchFormationProps {
  categories: CategoryOption[];
}

export default function SearchFormation({ categories }: SearchFormationProps) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedDuration, setSelectedDuration] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");

  const handleSearch = () => {
    // Si une catégorie est sélectionnée, rediriger vers la page de catégorie avec les filtres
    if (selectedCategory) {
      const params = new URLSearchParams();

      if (searchQuery.trim()) {
        params.set("search", searchQuery.trim());
      }
      if (selectedDuration) {
        params.set("duration", selectedDuration);
      }
      if (selectedLocation) {
        params.set("location", selectedLocation);
      }

      const queryString = params.toString();
      const url = `/formations/category/${selectedCategory}${
        queryString ? `?${queryString}` : ""
      }`;
      router.push(url);
    } else {
      // Si aucune catégorie n'est sélectionnée, rediriger vers la page formations avec les filtres
      const params = new URLSearchParams();

      if (searchQuery.trim()) {
        params.set("search", searchQuery.trim());
      }
      if (selectedDuration) {
        params.set("duration", selectedDuration);
      }
      if (selectedLocation) {
        params.set("location", selectedLocation);
      }

      const queryString = params.toString();
      const url = `/formations${queryString ? `?${queryString}` : ""}`;
      router.push(url);
    }
  };

  return (
    <div className="bg-platinium/20 border border-primary/30 rounded-4xl lg:rounded-full p-6 md:p-8 w-fit max-w-5xl">
      {/* Layout Mobile - Stack vertical avec grille pour les dropdowns */}
      <div className="lg:hidden space-y-4">
        {/* 1ère ligne : SearchInput seul */}
        <div className="w-full">
          <SearchInput
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Rechercher une formation..."
          />
        </div>

        {/* 2ème ligne : 2 premiers dropdowns */}
        <div className="grid grid-cols-2 gap-4">
          <Dropdown
            options={categories}
            placeholder="Catégorie"
            value={selectedCategory}
            onChange={setSelectedCategory}
          />
          <Dropdown
            options={homeDurationOptions}
            placeholder="Durée"
            value={selectedDuration}
            onChange={setSelectedDuration}
          />
        </div>

        {/* 3ème ligne : 2 derniers dropdowns */}
        <div className="grid grid-cols-2 gap-4">
          <Dropdown
            options={homeLocationOptions}
            placeholder="Où ?"
            value={selectedLocation}
            onChange={setSelectedLocation}
          />
          <Button onClick={handleSearch} variant="secondary" className="w-full">
            Rechercher
          </Button>
        </div>
      </div>

      {/* Layout Desktop - Flex horizontal */}
      <div className="hidden lg:flex gap-4 items-center">
        <SearchInput
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Rechercher une formation..."
        />
        <Dropdown
          options={categories}
          placeholder="Catégorie"
          value={selectedCategory}
          onChange={setSelectedCategory}
        />
        <Dropdown
          options={homeDurationOptions}
          placeholder="Durée"
          value={selectedDuration}
          onChange={setSelectedDuration}
        />
        <Dropdown
          options={homeLocationOptions}
          placeholder="Où ?"
          value={selectedLocation}
          onChange={setSelectedLocation}
        />
        <Button
          onClick={handleSearch}
          variant="secondary"
          className="whitespace-nowrap"
        >
          Rechercher
        </Button>
      </div>
    </div>
  );
}
