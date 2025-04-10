import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

let supabaseInstance = null

export const getSupabase = (token = null) => {
  // Validate environment variables
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing Supabase environment variables')
  }

  if (!supabaseInstance) {
    supabaseInstance = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
        // Disable debug warnings in production
        debug: process.env.NODE_ENV === 'development'
      },
      global: {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      },
      // Add error handling and retries
      db: {
        schema: 'public',
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true
      }
    })

    // Add error event listener
    supabaseInstance.auth.onError((error) => {
      console.error('Supabase Auth Error:', error.message)
    })
  }

  return supabaseInstance
}

// Add cleanup function
export const clearSupabaseInstance = () => {
  supabaseInstance = null
}
