/**
 * Service de stockage Supabase
 * Remplace Cloudinary pour le stockage des fichiers
 */

import { createClient } from '@supabase/supabase-js'

// Client Supabase avec service_role pour l'accès serveur
const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export type Bucket = 'formations' | 'supports' | 'templates' | 'generated-docs'

interface UploadResult {
  url: string
  path: string
}

/**
 * Upload un fichier vers Supabase Storage
 */
export async function uploadFile(
  buffer: Buffer,
  bucket: Bucket,
  filename: string
): Promise<UploadResult> {
  // Nettoyer le nom de fichier
  const sanitizedFilename = filename
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9.-]/g, '_')

  const path = `${Date.now()}_${sanitizedFilename}`

  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(path, buffer, {
      contentType: getContentType(filename),
      upsert: false
    })

  if (error) {
    console.error('[Supabase Storage] Upload error:', error)
    throw new Error(`Upload failed: ${error.message}`)
  }

  const { data: urlData } = supabase.storage
    .from(bucket)
    .getPublicUrl(data.path)

  return {
    url: urlData.publicUrl,
    path: data.path
  }
}

/**
 * Upload un PDF vers Supabase Storage
 */
export async function uploadPdf(
  buffer: Buffer,
  bucket: Bucket,
  filename?: string
): Promise<UploadResult> {
  const name = filename || `document_${Date.now()}.pdf`
  return uploadFile(buffer, bucket, name)
}

/**
 * Upload un template PDF
 */
export async function uploadTemplatePdf(
  buffer: Buffer,
  templateName: string
): Promise<UploadResult> {
  const sanitizedName = templateName
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '_')
    .substring(0, 50)

  return uploadFile(buffer, 'templates', `template_${sanitizedName}.pdf`)
}

/**
 * Upload un document généré
 */
export async function uploadGeneratedPdf(
  buffer: Buffer,
  templateId: string
): Promise<UploadResult> {
  return uploadFile(buffer, 'generated-docs', `doc_${templateId}_${Date.now()}.pdf`)
}

/**
 * Supprime un fichier de Supabase Storage
 */
export async function deleteFile(bucket: Bucket, path: string): Promise<void> {
  const { error } = await supabase.storage.from(bucket).remove([path])
  if (error) {
    console.error('[Supabase Storage] Delete error:', error)
    throw new Error(`Delete failed: ${error.message}`)
  }
}

/**
 * Récupère l'URL publique d'un fichier
 */
export function getPublicUrl(bucket: Bucket, path: string): string {
  const { data } = supabase.storage.from(bucket).getPublicUrl(path)
  return data.publicUrl
}

/**
 * Détermine le content-type à partir de l'extension
 */
function getContentType(filename: string): string {
  const ext = filename.split('.').pop()?.toLowerCase()
  const types: Record<string, string> = {
    // Images
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    png: 'image/png',
    gif: 'image/gif',
    webp: 'image/webp',
    svg: 'image/svg+xml',

    // Documents
    pdf: 'application/pdf',
    doc: 'application/msword',
    docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    xls: 'application/vnd.ms-excel',
    xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    ppt: 'application/vnd.ms-powerpoint',
    pptx: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',

    // Vidéos
    mp4: 'video/mp4',
    avi: 'video/x-msvideo',
    mov: 'video/quicktime',
    wmv: 'video/x-ms-wmv',
    webm: 'video/webm',
  }
  return types[ext || ''] || 'application/octet-stream'
}

export { supabase }
