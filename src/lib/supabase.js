import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  }
})

// Helper function to create authenticated client
export const getSupabaseClient = async (getToken) => {
  if (getToken) {
    try {
      const token = await getToken({ template: 'supabase' });
      if (token) {
        supabase.auth.setSession({
          access_token: token,
          refresh_token: ''
        });
      }
    } catch (error) {
      console.error('Error setting auth token:', error);
    }
  }
  return supabase;
}

export { supabaseUrl }