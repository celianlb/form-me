/**
 * @form-me/storage
 * Supabase Storage utilities for the Form Me platform
 */

// Client
export { getSupabaseClient, resetSupabaseClient } from './client'

// Storage operations
export {
  uploadFile,
  uploadPdf,
  uploadTemplatePdf,
  uploadGeneratedPdf,
  deleteFile,
  getPublicUrl,
  downloadFile,
  listFiles,
  fileExists,
  getContentType,
  sanitizeFilename,
} from './storage'

// Types
export type {
  Bucket,
  UploadResult,
  UploadOptions,
  StorageConfig,
  ContentTypeMap,
} from './types'
