import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://neuroweave-demo-url.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.dummykey';

// Check if we are running in full demo mode (i.e. no Supabase variables set)
export const isSupabaseConfigured = !!import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_URL !== 'https://neuroweave-demo-url.supabase.co';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
export default supabase;
