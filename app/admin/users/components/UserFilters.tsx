import { Search, Filter } from "lucide-react";
import Image from "next/image";
import Button from "@/components/UI/Button";
import type { Pagination } from "./types";

interface UserFiltersProps {
  searchTerm: string;
  selectedRole: string;
  pagination: Pagination | null;
  onSearchChange: (value: string) => void;
  onSearchSubmit: (e: React.FormEvent) => void;
  onRoleFilter: (role: string) => void;
}

export function UserFilters({
  searchTerm,
  selectedRole,
  pagination,
  onSearchChange,
  onSearchSubmit,
  onRoleFilter,
}: UserFiltersProps) {
  const roleFilters = [
    { value: "all", label: "Tous", count: pagination?.totalCount },
    { value: "ADMIN", label: "Administrateurs" },
    { value: "LEARNER", label: "Apprenants" },
  ];

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-primary/20 overflow-hidden mb-8">
      <div className="relative p-8 bg-gradient-to-r from-white to-primary/5 border-b border-b-grayBlue/20">
        <Image
          src="/formation/dot-pattern.svg"
          width={150}
          height={150}
          alt=""
          className="absolute top-0 right-0"
        />
        <h2 className="text-2xl font-satoshi font-bold text-darkBlue mb-2">
          Recherche et Filtres
        </h2>
        <p className="text-gray-600">
          Trouvez rapidement l&apos;utilisateur que vous cherchez
        </p>
      </div>

      <div className="p-8">
        <form onSubmit={onSearchSubmit} className="space-y-6">
          {/* Search bar */}
          <div className="flex gap-4">
            <div className="flex-1">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Rechercher par email, prénom ou nom..."
                className="w-full px-4 py-3 border border-grayBlue/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent font-satoshi"
              />
            </div>
            <Button type="submit" variant="primary">
              <Search className="w-4 h-4 mr-2" />
              Rechercher
            </Button>
          </div>

          {/* Role filters */}
          <div>
            <label className="block text-sm font-satoshi font-medium text-darkBlue mb-3">
              Filtrer par rôle
            </label>
            <div className="flex flex-wrap gap-3">
              {roleFilters.map((filter) => (
                <button
                  key={filter.value}
                  type="button"
                  onClick={() => onRoleFilter(filter.value)}
                  className={`px-4 py-2 rounded-xl border-2 text-sm font-satoshi font-medium transition-colors ${
                    selectedRole === filter.value
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-gray-200 text-gray-700 hover:border-gray-300"
                  }`}
                >
                  <Filter className="w-4 h-4 inline mr-2" />
                  {filter.label}
                  {filter.count && ` (${filter.count})`}
                </button>
              ))}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
