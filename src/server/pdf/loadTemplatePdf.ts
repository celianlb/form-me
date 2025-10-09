/**
 * Service: Chargement du template PDF depuis Cloudinary
 * Télécharge le PDF template et retourne un Buffer pour manipulation
 */

export async function loadTemplatePdf(pdfUrl: string): Promise<Buffer> {
  try {
    const response = await fetch(pdfUrl);

    if (!response.ok) {
      throw new Error(
        `Failed to fetch PDF template: ${response.status} ${response.statusText}`
      );
    }

    const arrayBuffer = await response.arrayBuffer();
    return Buffer.from(arrayBuffer);
  } catch (error) {
    console.error('[loadTemplatePdf] Error:', error);
    throw new Error(
      `Unable to load PDF template from ${pdfUrl}: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
}
