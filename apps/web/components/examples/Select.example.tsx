import Select, { SelectOption } from "../UI/Dropdown";

// Exemple 1: Select de formations
const formationsOptions: SelectOption[] = [
  { value: "dev-web", label: "Développement Web" },
  { value: "design", label: "Design UX/UI" },
  { value: "marketing", label: "Marketing Digital" },
  { value: "gestion", label: "Gestion de Projet" },
  { value: "data", label: "Data Science" },
  { value: "security", label: "Cybersécurité", disabled: true }, // Option désactivée
];

// Exemple 2: Select de niveau
const niveauxOptions: SelectOption[] = [
  { value: "debutant", label: "Débutant" },
  { value: "intermediaire", label: "Intermédiaire" },
  { value: "avance", label: "Avancé" },
  { value: "expert", label: "Expert" },
];

// Exemple 3: Select de durée
const dureeOptions: SelectOption[] = [
  { value: "1h", label: "1 heure" },
  { value: "2h", label: "2 heures" },
  { value: "half-day", label: "Demi-journée (4h)" },
  { value: "full-day", label: "Journée complète (8h)" },
  { value: "weekend", label: "Week-end" },
];

export default function SelectExamples() {
  return (
    <div className="space-y-6 p-6">
      {/* Exemple 1: Controlled Select */}
      <div>
        <label className="block text-sm font-medium text-blackBlue mb-2">
          Choisissez une formation
        </label>
        <Select
          options={formationsOptions}
          placeholder="Sélectionner une formation"
          onChange={(value) => console.log("Formation sélectionnée:", value)}
        />
      </div>

      {/* Exemple 2: Select avec valeur par défaut */}
      <div>
        <label className="block text-sm font-medium text-blackBlue mb-2">
          Niveau requis
        </label>
        <Select
          options={niveauxOptions}
          defaultValue="intermediaire"
          onChange={(value) => console.log("Niveau sélectionné:", value)}
        />
      </div>

      {/* Exemple 3: Select désactivé */}
      <div>
        <label className="block text-sm font-medium text-blackBlue mb-2">
          Durée (indisponible)
        </label>
        <Select
          options={dureeOptions}
          disabled
          placeholder="Non disponible pour le moment"
        />
      </div>

      {/* Exemple 4: Select dans un formulaire */}
      <form className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-blackBlue mb-2">
            Formation souhaitée *
          </label>
          <Select
            options={formationsOptions}
            name="formation"
            required
            placeholder="Choisissez votre formation"
            onChange={(value) => console.log("Formulaire - Formation:", value)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-blackBlue mb-2">
            Votre niveau
          </label>
          <Select
            options={niveauxOptions}
            name="niveau"
            defaultValue="debutant"
            className="w-64" // Largeur personnalisée
          />
        </div>

        <button
          type="submit"
          className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
        >
          Valider
        </button>
      </form>
    </div>
  );
}
