/**
 * Helpers de formatage pour dates, heures, monnaie
 * Fuseau: Europe/Paris
 */

/**
 * Formate une date ISO en format français: dd/mm/yyyy
 * Accepte les formats ISO complets ou juste YYYY-MM-DD des inputs HTML
 */
export function formatDateFR(isoString: string): string {
  const date = new Date(isoString);
  if (isNaN(date.getTime())) {
    // Si la date est invalide, retourner la string telle quelle
    return isoString;
  }

  return new Intl.DateTimeFormat('fr-FR', {
    timeZone: 'Europe/Paris',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(date);
}

/**
 * Formate une heure ISO en format français: HH:mm
 * Accepte aussi directement le format HH:mm depuis les inputs HTML
 */
export function formatTimeFR(isoString: string): string {
  // Si c'est déjà au format HH:mm, on le retourne tel quel
  if (/^\d{2}:\d{2}$/.test(isoString)) {
    return isoString;
  }

  const date = new Date(isoString);
  if (isNaN(date.getTime())) {
    // Si la date est invalide, retourner la string telle quelle
    return isoString;
  }

  return new Intl.DateTimeFormat('fr-FR', {
    timeZone: 'Europe/Paris',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(date);
}

/**
 * Formate un montant en euros: 1234.56 → "1 234,56 €"
 * Remplace les espaces insécables fines (U+202F) par des espaces normales pour compatibilité PDF
 */
export function formatMoneyEUR(amount: number): string {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
  })
    .format(amount)
    .replace(/\u202F/g, ' '); // Remplace l'espace insécable fine par une espace normale
}

/**
 * Calcule le nombre de jours uniques à partir d'un tableau de dates ISO
 */
export function countUniqueDays(dates: string[]): number {
  const uniqueDates = new Set(
    dates.map(iso => new Date(iso).toISOString().split('T')[0])
  );
  return uniqueDates.size;
}

/**
 * Trim et nettoie une string pour le PDF
 */
export function sanitizeText(text: string): string {
  return text.trim();
}

/**
 * Génère un nom de fichier sécurisé pour l'upload
 * Supprime les caractères spéciaux et les espaces
 */
export function sanitizeFilename(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD') // Décompose les caractères accentués
    .replace(/[\u0300-\u036f]/g, '') // Supprime les accents
    .replace(/[^a-z0-9]+/g, '-') // Remplace les caractères spéciaux par des tirets
    .replace(/^-+|-+$/g, ''); // Supprime les tirets en début et fin
}

/**
 * Formate une date pour un nom de fichier: YYYYMMDD
 */
export function formatDateForFilename(isoString: string): string {
  const date = new Date(isoString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}${month}${day}`;
}
