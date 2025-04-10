import { createClient } from "@supabase/supabase-js";

export const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Create a single instance
let supabase = null;

const supabaseClient = async (supabaseAccessToken) => {
  if (!supabase) {
    supabase = createClient(supabaseUrl, supabaseKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
        debug: false // Disable debug warnings
      },
      global: {
        headers: {
          Authorization: `Bearer ${supabaseAccessToken}`,
        }
      }
    });
  }

  // Update the auth header if token changes
  supabase.auth.setSession({
    access_token: supabaseAccessToken,
    refresh_token: ''
  });

  return supabase;
};

export default supabaseClient;
