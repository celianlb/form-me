"use client";

import { durationOptions, locationOptions } from "@/utils/filterConstants";
import { useEffect, useState } from "react";
import Button from "./Button";
import Dropdown from "./Dropdown";
import SearchInput from "./SearchInput";

export interface FilterState {
  search: string;
  duration: string;
  location: string;
}

interface FormationFiltersProps {
  onFilter: (filters: FilterState) => void;
  initialFilters?: Partial<FilterState>;
}

export default function FormationFilters({
  onFilter,
  initialFilters = {},
}: FormationFiltersProps) {
  const [filters, setFilters] = useState<FilterState>({
    search: initialFilters.search || "",
    duration: initialFilters.duration || "",
    location: initialFilters.location || "",
  });

  // Synchroniser avec les filtres externes
  useEffect(() => {
    setFilters({
      search: initialFilters.search || "",
      duration: initialFilters.duration || "",
      location: initialFilters.location || "",
    });
  }, [initialFilters]);

  const handleSearchChange = (value: string) => {
    const newFilters = { ...filters, search: value };
    setFilters(newFilters);
    onFilter(newFilters);
  };

  const handleDurationChange = (value: string) => {
    const newFilters = { ...filters, duration: value };
    setFilters(newFilters);
    onFilter(newFilters);
  };

  const handleLocationChange = (value: string) => {
    const newFilters = { ...filters, location: value };
    setFilters(newFilters);
    onFilter(newFilters);
  };

  const handleFilter = () => {
    onFilter(filters);
  };

  const handleReset = () => {
    const resetFilters = { search: "", duration: "", location: "" };
    setFilters(resetFilters);
    onFilter(resetFilters);
  };

  const hasActiveFilters =
    filters.search || filters.duration || filters.location;

  return (
    <div className="bg-platinium/20 border border-primary/30 rounded-4xl lg:rounded-full p-6 md:p-8 shadow-md shadow-grayBlue/10 w-fit mx-auto">
      <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center">
        {/* Recherche par intitulé */}
        <SearchInput
          value={filters.search}
          onChange={handleSearchChange}
          placeholder="Nom de la formation..."
        />

        {/* Filtre durée */}
        <div className="w-full lg:w-auto ">
          <Dropdown
            options={durationOptions}
            value={filters.duration}
            onChange={handleDurationChange}
            placeholder="Sélectionner une durée"
            className="w-full"
          />
        </div>

        {/* Filtre lieu */}
        <div className="w-full lg:w-auto ">
          <Dropdown
            options={locationOptions}
            value={filters.location}
            onChange={handleLocationChange}
            placeholder="Sélectionner un lieu"
            className="w-full"
          />
        </div>

        {/* Boutons */}
        <div className="flex gap-2 w-full lg:w-auto">
          <Button
            onClick={handleFilter}
            variant="secondary"
            className="flex-1 lg:flex-none"
          >
            Filtrer
          </Button>
          {hasActiveFilters && (
            <Button
              onClick={handleReset}
              variant="secondary"
              className="flex-1 lg:flex-none border-red-600 text-red-600 hover:bg-red-50"
            >
              X
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
