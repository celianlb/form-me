/**
 * Supabase Storage service
 * Handles file uploads, downloads, and management
 */

import { getSupabaseClient } from './client'
import type { Bucket, UploadResult, UploadOptions, ContentTypeMap } from './types'

/**
 * Content type mapping for common file extensions
 */
const CONTENT_TYPES: ContentTypeMap = {
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

  // Videos
  mp4: 'video/mp4',
  avi: 'video/x-msvideo',
  mov: 'video/quicktime',
  wmv: 'video/x-ms-wmv',
  webm: 'video/webm',
}

/**
 * Determine content type from filename extension
 */
export function getContentType(filename: string): string {
  const ext = filename.split('.').pop()?.toLowerCase()
  return CONTENT_TYPES[ext || ''] || 'application/octet-stream'
}

/**
 * Sanitize filename for storage
 * Removes special characters and accents
 */
export function sanitizeFilename(filename: string): string {
  return filename
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9.-]/g, '_')
}

/**
 * Upload a file to Supabase Storage
 */
export async function uploadFile(
  buffer: Buffer,
  bucket: Bucket,
  filename: string,
  options?: UploadOptions
): Promise<UploadResult> {
  const supabase = getSupabaseClient()
  const sanitizedFilename = sanitizeFilename(filename)
  const path = `${Date.now()}_${sanitizedFilename}`

  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(path, buffer, {
      contentType: options?.contentType || getContentType(filename),
      upsert: options?.upsert ?? false
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
 * Upload a PDF file to Supabase Storage
 */
export async function uploadPdf(
  buffer: Buffer,
  bucket: Bucket,
  filename?: string
): Promise<UploadResult> {
  const name = filename || `document_${Date.now()}.pdf`
  return uploadFile(buffer, bucket, name, { contentType: 'application/pdf' })
}

/**
 * Upload a PDF template
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
 * Upload a generated PDF document
 */
export async function uploadGeneratedPdf(
  buffer: Buffer,
  templateId: string
): Promise<UploadResult> {
  return uploadFile(buffer, 'generated-docs', `doc_${templateId}_${Date.now()}.pdf`)
}

/**
 * Delete a file from Supabase Storage
 */
export async function deleteFile(bucket: Bucket, path: string): Promise<void> {
  const supabase = getSupabaseClient()
  const { error } = await supabase.storage.from(bucket).remove([path])

  if (error) {
    console.error('[Supabase Storage] Delete error:', error)
    throw new Error(`Delete failed: ${error.message}`)
  }
}

/**
 * Get the public URL for a file
 */
export function getPublicUrl(bucket: Bucket, path: string): string {
  const supabase = getSupabaseClient()
  const { data } = supabase.storage.from(bucket).getPublicUrl(path)
  return data.publicUrl
}

/**
 * Download a file from Supabase Storage
 */
export async function downloadFile(bucket: Bucket, path: string): Promise<Blob> {
  const supabase = getSupabaseClient()
  const { data, error } = await supabase.storage.from(bucket).download(path)

  if (error) {
    console.error('[Supabase Storage] Download error:', error)
    throw new Error(`Download failed: ${error.message}`)
  }

  return data
}

/**
 * List files in a bucket (with optional path prefix)
 */
export async function listFiles(bucket: Bucket, pathPrefix?: string): Promise<string[]> {
  const supabase = getSupabaseClient()
  const { data, error } = await supabase.storage.from(bucket).list(pathPrefix)

  if (error) {
    console.error('[Supabase Storage] List error:', error)
    throw new Error(`List failed: ${error.message}`)
  }

  return data.map(file => file.name)
}

/**
 * Check if a file exists in a bucket
 */
export async function fileExists(bucket: Bucket, path: string): Promise<boolean> {
  const supabase = getSupabaseClient()
  const { data, error } = await supabase.storage.from(bucket).list('', {
    search: path
  })

  if (error) {
    return false
  }

  return data.some(file => file.name === path)
}
