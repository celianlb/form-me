/**
 * Maintenance mode utilities
 */

/**
 * Check if the application is in maintenance mode
 */
export const isMaintenanceMode = (): boolean => {
  return process.env.MAINTENANCE_MODE === 'true';
};

/**
 * Get the custom maintenance message from environment or use default
 */
export const getMaintenanceMessage = (): string => {
  return (
    process.env.MAINTENANCE_MESSAGE ||
    'Nous effectuons actuellement des améliorations sur notre plateforme. Nous serons de retour très prochainement.'
  );
};

/**
 * Get the estimated return time from environment
 * @returns ISO date string or null if not set
 */
export const getMaintenanceReturnTime = (): string | null => {
  return process.env.MAINTENANCE_RETURN_TIME || null;
};

/**
 * Get the contact email for maintenance page
 */
export const getMaintenanceContactEmail = (): string => {
  return process.env.MAINTENANCE_CONTACT_EMAIL || 'contact@form-me.fr';
};
