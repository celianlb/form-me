import { CategoryOption } from "@/types/category";
import Dropdown from "../UI/Dropdown";
import SearchInput from "../UI/SearchInput";

interface SearchFormationProps {
  categories: CategoryOption[];
}

export default function SearchFormation({ categories }: SearchFormationProps) {
  return (
    <div className="bg-platinium/20 border border-primary/30 rounded-4xl lg:rounded-full p-6 md:p-8 w-fit max-w-5xl">
      {/* Layout Mobile - Stack vertical avec grille pour les dropdowns */}
      <div className="lg:hidden space-y-4">
        {/* 1ère ligne : SearchInput seul */}
        <div className="w-full">
          <SearchInput />
        </div>

        {/* 2ème ligne : 2 premiers dropdowns */}
        <div className="grid grid-cols-2 gap-4">
          <Dropdown options={categories} placeholder="Catégorie" />
          <Dropdown
            options={[
              { value: "1", label: "1 jour" },
              { value: "2", label: "2 jours" },
              { value: "3", label: "3 jours" },
              { value: "3+", label: "3 jours+" },
            ]}
            placeholder="Durée"
          />
        </div>

        {/* 3ème ligne : 2 derniers dropdowns */}
        <div className="grid grid-cols-2 gap-4">
          <Dropdown
            options={[
              { value: "septembre-2025", label: "Septembre 2025" },
              { value: "octobre-2025", label: "Octobre 2025" },
              { value: "novembre-2025", label: "Novembre 2025" },
              { value: "decembre-2025", label: "Décembre 2025" },
              { value: "janvier-2026", label: "Janvier 2026" },
              { value: "fevrier-2026", label: "Février 2026" },
              { value: "mars-2026", label: "Mars 2026" },
              { value: "avril-2026", label: "Avril 2026" },
            ]}
            placeholder="Quand ?"
          />
          <Dropdown
            options={[
              { value: "en-ligne", label: "En ligne" },
              { value: "en-presentiel", label: "En présentiel" },
            ]}
            placeholder="Où ?"
          />
        </div>
      </div>

      {/* Layout Desktop - Flex horizontal */}
      <div className="hidden lg:flex gap-4">
        <SearchInput />
        <Dropdown options={categories} placeholder="Catégorie" />
        <Dropdown
          options={[
            { value: "1", label: "1 jour" },
            { value: "2", label: "2 jours" },
            { value: "3", label: "3 jours" },
            { value: "3+", label: "3 jours+" },
          ]}
          placeholder="Durée"
        />
        <Dropdown
          options={[
            { value: "en-ligne", label: "En ligne" },
            { value: "en-presentiel", label: "En présentiel" },
          ]}
          placeholder="Où ?"
        />
      </div>
    </div>
  );
}
