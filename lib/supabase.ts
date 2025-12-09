import { createClient } from '@supabase/supabase-js'

/**
 * Hardware Shop Management System - Supabase Client
 * Initializes and exports the Supabase client for database operations
 */

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Validate environment variables
if (!supabaseUrl) {
  throw new Error(
    'Missing NEXT_PUBLIC_SUPABASE_URL. Check your .env.local file and verify Supabase URL is set correctly.'
  )
}

if (!supabaseAnonKey) {
  throw new Error(
    'Missing NEXT_PUBLIC_SUPABASE_ANON_KEY. Check your .env.local file and verify Anon Key is set correctly.'
  )
}

/**
 * Supabase client instance
 * Use this to make authenticated requests to your PostgreSQL database
 */
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export default supabase