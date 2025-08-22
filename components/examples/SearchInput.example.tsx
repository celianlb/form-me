import SearchInput from "../UI/SearchInput";

export default function SearchInputExamples() {
  return (
    <div className="space-y-6 p-6 max-w-2xl">
      <h2 className="text-xl font-bold text-blackBlue">Exemples SearchInput</h2>

      {/* Exemple 1: SearchInput basique */}
      <div>
        <h3 className="text-md font-medium text-blackBlue mb-2">Recherche basique</h3>
        <SearchInput
          placeholder="Rechercher une formation..."
          onChange={(value) => console.log("Recherche:", value)}
          onSubmit={(value) => console.log("Soumis:", value)}
        />
      </div>

      {/* Exemple 2: SearchInput avec valeur contrôlée */}
      <div>
        <h3 className="text-md font-medium text-blackBlue mb-2">Avec valeur contrôlée</h3>
        <SearchInput
          value=""
          placeholder="Valeur contrôlée..."
          onChange={(value) => console.log("Contrôlée:", value)}
        />
      </div>

      {/* Exemple 3: SearchInput avec valeur par défaut */}
      <div>
        <h3 className="text-md font-medium text-blackBlue mb-2">Avec valeur par défaut</h3>
        <SearchInput
          defaultValue="React"
          placeholder="Rechercher..."
          onChange={(value) => console.log("Défaut:", value)}
        />
      </div>

      {/* Exemple 4: SearchInput désactivé */}
      <div>
        <h3 className="text-md font-medium text-blackBlue mb-2">Désactivé</h3>
        <SearchInput
          disabled
          placeholder="Recherche indisponible"
        />
      </div>

      {/* Exemple 5: SearchInput dans un formulaire */}
      <div>
        <h3 className="text-md font-medium text-blackBlue mb-2">Dans un formulaire</h3>
        <form className="space-y-4">
          <SearchInput
            name="search_formation"
            placeholder="Rechercher une formation..."
            onSubmit={(value) => {
              console.log("Formulaire soumis avec:", value);
              // Ici vous pourriez faire une redirection ou une recherche
            }}
          />
          
          <p className="text-sm text-grayBlue">
            Appuyez sur Entrée pour rechercher
          </p>
        </form>
      </div>

      {/* Exemple 6: SearchInput avec largeur personnalisée */}
      <div>
        <h3 className="text-md font-medium text-blackBlue mb-2">Largeur personnalisée</h3>
        <SearchInput
          className="max-w-md"
          placeholder="Recherche réduite..."
          onChange={(value) => console.log("Personnalisée:", value)}
        />
      </div>
    </div>
  );
}