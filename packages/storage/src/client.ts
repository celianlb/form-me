/**
 * Supabase client singleton for storage operations
 */

import { createClient, SupabaseClient } from '@supabase/supabase-js'
import type { StorageConfig } from './types'

let supabaseClient: SupabaseClient | null = null

/**
 * Get or create the Supabase client instance
 * Uses service_role key for server-side access
 */
export function getSupabaseClient(config?: StorageConfig): SupabaseClient {
  if (supabaseClient) {
    return supabaseClient
  }

  const supabaseUrl = config?.supabaseUrl || process.env.SUPABASE_URL
  const supabaseServiceRoleKey = config?.supabaseServiceRoleKey || process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl) {
    throw new Error('[Storage] SUPABASE_URL is not configured')
  }

  if (!supabaseServiceRoleKey) {
    throw new Error('[Storage] SUPABASE_SERVICE_ROLE_KEY is not configured')
  }

  supabaseClient = createClient(supabaseUrl, supabaseServiceRoleKey)
  return supabaseClient
}

/**
 * Reset the Supabase client (useful for testing)
 */
export function resetSupabaseClient(): void {
  supabaseClient = null
}
