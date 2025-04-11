import { createClient } from "@supabase/supabase-js";

export const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Validate environment variables
if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables. Check your .env file.');
}

// Create a single instance for anonymous access
const supabaseAnon = createClient(supabaseUrl, supabaseKey);

// Function to create authenticated client
const supabaseClient = async (supabaseAccessToken) => {
  if (!supabaseAccessToken) {
    return supabaseAnon;
  }

  return createClient(supabaseUrl, supabaseKey, {
    global: {
      headers: {
        Authorization: `Bearer ${supabaseAccessToken}`,
      },
    },
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true
    }
  });
};

// Export both anonymous and authenticated clients
export { supabaseAnon };
export default supabaseClient;
