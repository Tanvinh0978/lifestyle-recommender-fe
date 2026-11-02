import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://cneplluivcjntshojakp.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_vlMcGuyrkma3pDk_m5zVnw_0sgllDnM';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
export const isSupabaseConfigured = true;
