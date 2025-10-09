/**
 * Helpers de formatage pour dates, heures, monnaie
 * Fuseau: Europe/Paris
 */

/**
 * Formate une date ISO en format français: dd/mm/yyyy
 */
export function formatDateFR(isoString: string): string {
  const date = new Date(isoString);
  return new Intl.DateTimeFormat('fr-FR', {
    timeZone: 'Europe/Paris',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(date);
}

/**
 * Formate une heure ISO en format français: HH:mm
 */
export function formatTimeFR(isoString: string): string {
  const date = new Date(isoString);
  return new Intl.DateTimeFormat('fr-FR', {
    timeZone: 'Europe/Paris',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(date);
}

/**
 * Formate un montant en euros: 1234.56 → "1 234,56 €"
 */
export function formatMoneyEUR(amount: number): string {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
  }).format(amount);
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
