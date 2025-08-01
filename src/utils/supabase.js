import { createClient } from "@supabase/supabase-js";

export const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Create a single Supabase client instance
const supabase = createClient(supabaseUrl, supabaseKey);

// Main client function for authenticated requests
const supabaseClient = async (supabaseAccessToken) => {
  if (supabaseAccessToken) {
    // Create client with custom token for API calls
    return createClient(supabaseUrl, supabaseKey, {
      global: {
        headers: {
          Authorization: `Bearer ${supabaseAccessToken}`,
        },
      },
    });
  }
  
  // Return default client if no token provided
  return supabase;
};

// Export both the function and the default client
export default supabaseClient;
export { supabase };
