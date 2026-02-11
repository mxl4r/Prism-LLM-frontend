import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// HELPER: Create a Mock Client
// This ensures the app builds and runs successfully on Vercel even without valid Supabase keys.
// This supports your architecture where keys/auth might be handled purely on the GCP backend later.
const createMockClient = () => {
  // Return a dummy object that mimics the Supabase client structure
  // so the app doesn't crash when importing 'supabase'.
  return {
    auth: {
      getSession: async () => ({ data: { session: null }, error: null }),
      signInWithOAuth: async () => {
        console.warn("SignIn called on Mock Client (No API Keys found)");
        return { data: null, error: null };
      },
      signOut: async () => {
        console.warn("SignOut called on Mock Client");
        return { error: null };
      },
      onAuthStateChange: () => {
        return { data: { subscription: { unsubscribe: () => {} } } };
      },
    },
    // Mock other potential usages to be safe
    from: () => ({
      select: () => ({ data: [], error: null }),
      insert: () => ({ data: [], error: null }),
      update: () => ({ data: [], error: null }),
      delete: () => ({ data: [], error: null }),
    })
  };
};

// If keys exist, create real client. Otherwise, use mock.
export const supabase = (supabaseUrl && supabaseAnonKey) 
  ? createClient(supabaseUrl, supabaseAnonKey) 
  : createMockClient() as any;
