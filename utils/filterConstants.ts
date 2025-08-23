import { SelectOption } from "@/components/UI/Dropdown";

// Options de durée unifiées
export const durationOptions: SelectOption[] = [
  { value: "", label: "Toutes les durées" },
  { value: "1", label: "1 jour" },
  { value: "2", label: "2 jours" },
  { value: "3", label: "3 jours" },
  { value: "3+", label: "3 jours +" },
];

// Options de lieu unifiées
export const locationOptions: SelectOption[] = [
  { value: "", label: "Tous les lieux" },
  { value: "en-ligne", label: "En ligne" },
  { value: "en-presentiel", label: "En présentiel" },
];

// Options de durée pour la page d'accueil (sans option "Toutes les durées")
export const homeDurationOptions: SelectOption[] = durationOptions.filter(
  (option) => option.value !== ""
);

// Options de lieu pour la page d'accueil (sans option "Tous les lieux")
export const homeLocationOptions: SelectOption[] = locationOptions.filter(
  (option) => option.value !== ""
);
