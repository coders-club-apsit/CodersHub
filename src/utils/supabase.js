// import { createClient } from "@supabase/supabase-js";

// export const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
// const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// // Validate environment variables
// if (!supabaseUrl || !supabaseKey) {
//   throw new Error('Missing Supabase environment variables. Check your .env file.');
// }

// // Create a single instance for anonymous access
// const supabaseAnon = createClient(supabaseUrl, supabaseKey);

// // Function to create authenticated client
// const supabaseClient = async (supabaseAccessToken) => {
//   if (!supabaseAccessToken) {
//     return supabaseAnon;
//   }

//   return createClient(supabaseUrl, supabaseKey, {
//     global: {
//       headers: {
//         Authorization: `Bearer ${supabaseAccessToken}`,
//       },
//     },
//     auth: {
//       persistSession: true,
//       autoRefreshToken: true,
//       detectSessionInUrl: true
//     }
//   });
// };

// // Export both anonymous and authenticated clients
// export { supabaseAnon };
// export default supabaseClient;


// import { createClient } from '@supabase/supabase-js';
// import { useClerk } from '@clerk/clerk-react';
// import { useEffect, useState } from 'react';

// export const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
// const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// // Validate environment variables
// if (!supabaseUrl || !supabaseKey) {
//   throw new Error('Missing Supabase environment variables. Check your .env file.');
// }

// // Create a single instance for anonymous access
// export const supabaseAnon = createClient(supabaseUrl, supabaseKey);

// // Hook to create authenticated Supabase client
// export const useSupabaseClient = () => {
//   const { getToken } = useClerk();
//   const [supabase, setSupabase] = useState(null);

//   useEffect(() => {
//     const initializeSupabase = async () => {
//       try {
//         const client = createClient(supabaseUrl, supabaseKey, {
//           auth: {
//             persistSession: true,
//             autoRefreshToken: true,
//             detectSessionInUrl: true,
//           },
//         });

//         // Get Clerk JWT token for Supabase
//         const token = await getToken({ template: 'supabase' });
//         if (token) {
//           await client.auth.setSession({ access_token: token });
//         }

//         setSupabase(client);
//       } catch (error) {
//         console.error('Error initializing Supabase client:', error);
//         setSupabase(supabaseAnon); // Fallback to anonymous client
//       }
//     };

//     initializeSupabase();
//   }, [getToken]);

//   return supabase;
// };

// // Function to create authenticated client (retained for other use cases)
// const supabaseClient = async (supabaseAccessToken) => {
//   if (!supabaseAccessToken) {
//     return supabaseAnon;
//   }

//   return createClient(supabaseUrl, supabaseKey, {
//     global: {
//       headers: {
//         Authorization: `Bearer ${supabaseAccessToken}`,
//       },
//     },
//     auth: {
//       persistSession: true,
//       autoRefreshToken: true,
//       detectSessionInUrl: true,
//     },
//   });
// };

// export default supabaseClient;

import { createClient } from '@supabase/supabase-js';
import { useClerk } from '@clerk/clerk-react';
import { useEffect, useState } from 'react';

export const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Validate environment variables
if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables. Check your .env file.');
}

// Single Supabase client instance
const supabaseClientInstance = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});

// Export anonymous client for fallback or initial use
export const supabaseAnon = supabaseClientInstance;

// Hook to manage authenticated Supabase client
export const useSupabaseClient = () => {
  const { session } = useClerk();
  const [supabase, setSupabase] = useState(supabaseClientInstance);

  useEffect(() => {
    const updateSupabaseAuth = async () => {
      try {
        if (session) {
          const token = await session.getToken({ template: 'supabase' });
          if (token) {
            await supabaseClientInstance.auth.setSession({ access_token: token });
          } else {
            await supabaseClientInstance.auth.setSession(null);
          }
        } else {
          await supabaseClientInstance.auth.setSession(null);
        }
        setSupabase(supabaseClientInstance);
      } catch (error) {
        console.error('Error updating Supabase auth:', error);
        setSupabase(supabaseClientInstance); // Fallback to anon client
      }
    };

    updateSupabaseAuth();

    // Listen for auth state changes
    const { data: authListener } = supabaseClientInstance.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        setSupabase(supabaseClientInstance);
      }
    });

    // Cleanup subscription
    return () => {
      authListener?.subscription?.unsubscribe();
    };
  }, [session]);

  return supabase;
};

// Retained for compatibility with other parts of your app
export default async (supabaseAccessToken) => {
  if (!supabaseAccessToken) {
    return supabaseClientInstance;
  }

  const client = createClient(supabaseUrl, supabaseKey, {
    global: {
      headers: {
        Authorization: `Bearer ${supabaseAccessToken}`,
      },
    },
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  });
  return client;
};