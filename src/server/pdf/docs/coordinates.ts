/**
 * Coordonnées des champs pour les templates Convention et Émargement
 * Format PDF: origine en bas-gauche, unités en points (1pt ≈ 0.35mm)
 * Page A4 portrait: ~595 x 842 points
 *
 * CONVENTION: Coordonnées approximatives pour MVP
 * EMARGEMENT: Coordonnées approximatives pour MVP
 *
 * À ajuster selon les templates réels Cloudinary
 */

export interface FieldCoords {
  pageIndex: number; // 0-based
  x: number;
  y: number;
  fontSize: number;
  maxWidth?: number; // Pour gérer le wrapping si nécessaire
}

/**
 * CONVENTION - Coordonnées des champs
 * Hypothèse: template A4 portrait avec zones prédéfinies
 */
export const CONVENTION_FIELDS_COORDS: Record<string, FieldCoords> = {
  // === ENTÊTE SOCIÉTÉ ===
  'societe.nom': { pageIndex: 0, x: 100, y: 750, fontSize: 12 },
  'societe.siret': { pageIndex: 0, x: 100, y: 735, fontSize: 10 },
  'societe.adresse': { pageIndex: 0, x: 100, y: 720, fontSize: 10 },
  'societe.representantPrenom': { pageIndex: 0, x: 100, y: 700, fontSize: 10 },
  'societe.representantNom': { pageIndex: 0, x: 200, y: 700, fontSize: 10 },

  // === FORMATION ===
  'formation.nom': { pageIndex: 0, x: 100, y: 660, fontSize: 14 },
  'formation.objectifsOperationnels': { pageIndex: 0, x: 100, y: 630, fontSize: 9, maxWidth: 400 },
  'formation.dureeHeures': { pageIndex: 0, x: 100, y: 600, fontSize: 10 },
  'formation.lieu': { pageIndex: 0, x: 100, y: 585, fontSize: 10 },

  // === TABLEAU DATES (début) ===
  'dates.header': { pageIndex: 0, x: 100, y: 550, fontSize: 10 },
  // Les lignes de dates seront générées dynamiquement à partir de y=530 avec step=-15

  // === TABLEAU EFFECTIF (début) ===
  'effectif.header': { pageIndex: 0, x: 100, y: 400, fontSize: 10 },
  // Les lignes d'effectif seront générées dynamiquement à partir de y=380 avec step=-15

  // === FRAIS ===
  'frais.tarifJournalier': { pageIndex: 0, x: 350, y: 200, fontSize: 10 },
  'frais.nbJours': { pageIndex: 0, x: 350, y: 185, fontSize: 10 },
  'frais.total': { pageIndex: 0, x: 350, y: 170, fontSize: 12 },

  // === SIGNATURES ===
  'signature.date': { pageIndex: 0, x: 100, y: 100, fontSize: 10 },
};

/**
 * EMARGEMENT - Coordonnées des champs
 * Hypothèse: template A4 portrait avec zones pour signatures multiples
 */
export const EMARGEMENT_FIELDS_COORDS: Record<string, FieldCoords> = {
  // === ENTÊTE ===
  'formation.nom': { pageIndex: 0, x: 100, y: 780, fontSize: 14 },
  'organisme.nom': { pageIndex: 0, x: 100, y: 760, fontSize: 10 },
  'lieu': { pageIndex: 0, x: 100, y: 745, fontSize: 10 },

  // === FORMATEUR ===
  'formateur.prenom': { pageIndex: 0, x: 100, y: 720, fontSize: 10 },
  'formateur.nom': { pageIndex: 0, x: 200, y: 720, fontSize: 10 },

  // === SESSION (date + horaires) ===
  'session.date': { pageIndex: 0, x: 100, y: 690, fontSize: 12 },
  'session.horaires': { pageIndex: 0, x: 100, y: 670, fontSize: 10 },
  // Exemples:
  // - "Matin: 09:00 - 12:30"
  // - "Après-midi: 14:00 - 17:30"
  // - "Journée entière: 09:00 - 17:30"

  // === TABLEAU SIGNATURES (lignes stagiaires) ===
  'signatures.header': { pageIndex: 0, x: 100, y: 630, fontSize: 10 },
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
    startY: 380,
    lineHeight: 15,
    maxLinesPerPage: 15,
    columns: {
      prenom: { x: 100, width: 100 },
      nom: { x: 220, width: 100 },
      dateNaissance: { x: 340, width: 100 },
    },
  },
};
