/**
 * Types for Supabase Storage operations
 */

/**
 * Available storage buckets
 */
export type Bucket = 'formations' | 'supports' | 'templates' | 'generated-docs'

/**
 * Result of a file upload operation
 */
export interface UploadResult {
  /** Public URL of the uploaded file */
  url: string
  /** Path of the file in the bucket */
  path: string
}

/**
 * Options for file upload
 */
export interface UploadOptions {
  /** Content type override (auto-detected if not provided) */
  contentType?: string
  /** Whether to overwrite existing file with same name */
  upsert?: boolean
}

/**
 * Configuration for the storage client
 */
export interface StorageConfig {
  /** Supabase project URL */
  supabaseUrl: string
  /** Supabase service role key for server-side access */
  supabaseServiceRoleKey: string
}

/**
 * Mapping of file extensions to MIME types
 */
export type ContentTypeMap = Record<string, string>
