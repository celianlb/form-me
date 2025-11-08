export interface FieldCoords {
  pageIndex: number; // 0-based
  x: number;
  y: number;
  fontSize: number;
  maxWidth?: number; // Pour gérer le wrapping si nécessaire
}

/**
 * CONVENTION - Coordonnées des champs (NOUVEAUX TEMPLATES)
 * Les coordonnées sont calculées en fonction de la position des placeholders dans le PDF
 * Système de coordonnées PDF: (0,0) = coin bas-gauche de la page
 * Page A4: 595 x 842 points
 *
 * Note: Les coordonnées ont été ajustées manuellement après test visuel
 */
export const CONVENTION_FIELDS_COORDS: Record<string, FieldCoords> = {
  // === PAGE 1: INFORMATIONS PRINCIPALES ===

  // Entreprise cliente (section "2 - [Nom de l'entreprise], [Siret], [Adresse complete]...")
  // Ligne "2 - [Nom de l'entreprise], [Siret]..." est à y≈590
  "societe.nom": { pageIndex: 0, x: 118, y: 589, fontSize: 10 },
  "societe.siret": { pageIndex: 0, x: 267, y: 589, fontSize: 10 },
  "societe.adresse": { pageIndex: 0, x: 312, y: 589, fontSize: 10 },
  // "[Nom et prenom du representant de l'entreprise]" est sur la ligne suivante
  "societe.representant": { pageIndex: 0, x: 398, y: 578, fontSize: 10 },

  // Article 1: Objet de la convention
  // "Intitulé du stage: [Dynamique en fonction de la formation choisis en DB]"
  "formation.nom": { pageIndex: 0, x: 245, y: 446, fontSize: 10 },

  // "Durée : [Nombre d'heure de formation]"
  "formation.dureeHeures": { pageIndex: 0, x: 206, y: 369, fontSize: 10 },

  // "Lieu adresse exacte : [Nom de l'entreprise], [Adresse, Code postale, Ville]"
  "formation.lieu": { pageIndex: 0, x: 277, y: 357, fontSize: 10 },

  // "Dates et horaires : [Jour + Horaire]"
  "datesEtHoraires": { pageIndex: 0, x: 245, y: 345, fontSize: 10, maxWidth: 300 },

  // Article 2: Effectif formé - Tableau des stagiaires
  // "[Mettre un tableau avec les renseignements sur les personnes (date de naissance, nom, prenom)]"
  // Le tableau commence juste après "L'organisme Form Me accueillera les personnes suivantes:"
  "effectif.tableauStart": { pageIndex: 0, x: 185, y: 280, fontSize: 9 },
  // Le tableau sera généré dynamiquement

  // Article 3: Dispositions financières
  // "Frais de formation : coût unitaire/stagiaire Net de TVA: [Dynamique en fonction de la formation]"
  "frais.tarifUnitaire": { pageIndex: 0, x: 456, y: 176, fontSize: 10 },

  // "TOTAL GENERAL : [Calcul du prix en fonction du temps de formation]"
  "frais.total": { pageIndex: 0, x: 214, y: 164, fontSize: 10 },
};

/**
 * EMARGEMENT - Coordonnées des champs
 */
export const EMARGEMENT_FIELDS_COORDS: Record<string, FieldCoords> = {
  // === ENTÊTE ===
  "formation.nom": { pageIndex: 0, x: 100, y: 780, fontSize: 14 },
  "organisme.nom": { pageIndex: 0, x: 100, y: 760, fontSize: 10 },
  lieu: { pageIndex: 0, x: 100, y: 745, fontSize: 10 },

  // === FORMATEUR ===
  "formateur.prenom": { pageIndex: 0, x: 100, y: 720, fontSize: 10 },
  "formateur.nom": { pageIndex: 0, x: 200, y: 720, fontSize: 10 },

  // === SESSION (date + horaires) ===
  "session.date": { pageIndex: 0, x: 100, y: 690, fontSize: 12 },
  "session.horaires": { pageIndex: 0, x: 100, y: 670, fontSize: 10 },
  // Exemples:
  // - "Matin: 09:00 - 12:30"
  // - "Après-midi: 14:00 - 17:30"
  // - "Journée entière: 09:00 - 17:30"

  // === TABLEAU SIGNATURES (lignes stagiaires) ===
  "signatures.header": { pageIndex: 0, x: 100, y: 630, fontSize: 10 },
  // Les lignes de signature seront générées dynamiquement si besoin
  // Pour MVP: on laisse vide, le PDF template contient déjà les lignes
};

/**
 * Configuration pour les tableaux dynamiques
 */
export const TABLE_CONFIG = {
  DATES: {
    startY: 530,
    lineHeight: 15,
    maxLinesPerPage: 20,
    columns: {
      date: { x: 100, width: 100 },
      debut: { x: 220, width: 80 },
      fin: { x: 320, width: 80 },
    },
  },
  EFFECTIF: {
    // Tableau des stagiaires (Nom, Prénom, Date de naissance)
    // Le tableau se positionne après le texte "L'organisme Form Me accueillera les personnes suivantes:"
    // et remplace "[Mettre un tableau avec les renseignements sur les personnes...]"
    startY: 265, // Position Y de départ pour la première ligne du tableau
    lineHeight: 15, // Espacement entre les lignes
    maxLinesPerPage: 8, // Nombre maximum de lignes avant débordement
    columns: {
      nom: { x: 185, width: 120 }, // Colonne Nom
      prenom: { x: 305, width: 120 }, // Colonne Prénom
      dateNaissance: { x: 425, width: 100 }, // Colonne Date de naissance
    },
  },
};
