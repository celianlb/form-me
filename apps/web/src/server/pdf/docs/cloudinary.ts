/**
 * Supabase Storage helpers pour les documents Convention et Émargement
 * (Fichier renommé de cloudinary.ts mais conservé pour compatibilité)
 *
 * Les templates PDF sont maintenant générés programmatiquement via:
 * - generateConventionTemplate() pour les conventions
 * - generateEmargementTemplate() pour les feuilles d'émargement
 */
import { uploadFile, Bucket } from '../../storage/supabase';

/**
 * Upload d'un buffer PDF généré vers Supabase Storage
 * @param buffer - Le buffer PDF à uploader
 * @param folder - Le dossier de destination (mappé vers un bucket Supabase)
 * @param filename - Le nom de fichier (optionnel, sans extension)
 */
export async function uploadBuffer(
  buffer: Buffer,
  folder = 'generated-docs',
  filename?: string
): Promise<{ secure_url: string; public_id: string }> {
  // Mapper l'ancien folder vers le bucket Supabase
  const bucketMap: Record<string, Bucket> = {
    'generated-docs': 'generated-docs',
    'pdf-templates': 'templates',
    'conventions': 'generated-docs',
    'emargements': 'generated-docs',
  };

  const bucket = bucketMap[folder] || 'generated-docs';
  const name = filename ? `${filename}.pdf` : `document_${Date.now()}.pdf`;

  const result = await uploadFile(buffer, bucket, name);

  return {
    secure_url: result.url,
    public_id: result.path,
  };
}
