/**
 * Service: Upload de PDF vers Supabase Storage
 * (Ancien nom conservé pour compatibilité, mais utilise maintenant Supabase)
 */

import { uploadFile, uploadGeneratedPdf as supabaseUploadGeneratedPdf, uploadTemplatePdf as supabaseUploadTemplatePdf } from '../storage/supabase';

interface UploadResult {
  url: string;
  publicId: string; // Pour compatibilité, contient maintenant le path Supabase
}

/**
 * Upload d'un PDF vers Supabase Storage
 * @deprecated Utiliser directement les fonctions de @/src/server/storage/supabase
 */
export async function uploadPdfToCloudinary(
  pdfBuffer: Buffer,
  folder: string = 'generated-docs',
  filename?: string
): Promise<UploadResult> {
  // Mapper l'ancien folder vers le bucket Supabase
  const bucket = folder === 'pdf-templates' ? 'templates' : 'generated-docs';
  const name = filename || `document_${Date.now()}.pdf`;

  const result = await uploadFile(pdfBuffer, bucket, name);

  return {
    url: result.url,
    publicId: result.path, // Pour compatibilité
  };
}

/**
 * Upload d'un template PDF
 * @deprecated Utiliser directement uploadTemplatePdf de @/src/server/storage/supabase
 */
export async function uploadTemplatePdf(
  pdfBuffer: Buffer,
  templateName: string
): Promise<UploadResult> {
  const result = await supabaseUploadTemplatePdf(pdfBuffer, templateName);
  return {
    url: result.url,
    publicId: result.path,
  };
}

/**
 * Upload d'un document généré
 * @deprecated Utiliser directement uploadGeneratedPdf de @/src/server/storage/supabase
 */
export async function uploadGeneratedPdf(
  pdfBuffer: Buffer,
  templateId: string
): Promise<UploadResult> {
  const result = await supabaseUploadGeneratedPdf(pdfBuffer, templateId);
  return {
    url: result.url,
    publicId: result.path,
  };
}
