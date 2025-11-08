/**
 * Types TypeScript pour Convention et Émargement
 */

export interface ConventionInput {
  societe: {
    nom: string;
    siret: string;
    adresse: string;
    representantPrenom: string;
    representantNom: string;
  };
  formation: {
    nom: string;
    objectifsOperationnels: string[];
    dureeHeures: number;
    lieu: string;
  };
  datesEtHoraires: Array<{
    dateISO: string;
    debutISO: string;
    finISO: string;
  }>;
  effectif: Array<{
    prenom: string;
    nom: string;
    dateNaissanceISO: string;
  }>;
  tarifJournalierEUR: number;
}

export interface EmargementInput {
  formationNom: string;
  organismeNom: string;
  lieu: string;
  formateur: {
    prenom: string;
    nom: string;
  };
  session: {
    dateISO: string;
    periodeJournee: 'matin' | 'apres-midi'; // Matin ou Après-midi
    heureDebut: string; // Format HH:mm ou ISO
    heureFin: string;   // Format HH:mm ou ISO
  };
  stagiaire: {
    prenom: string;
    nom: string;
    dateNaissanceISO: string;
    telephone?: string;
    entreprise: string;
    fonction: string;
  };
}

export interface ConventionResult {
  documentId: string;
  pdfUrl: string;
}

export interface EmargementResult {
  batchId: string;
  documents: Array<{
    documentId: string;
    pdfUrl: string;
    label: string;
  }>;
}
