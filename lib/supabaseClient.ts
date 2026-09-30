import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Used in the browser (client components): for auth, posting, uploads.
export const supabase = createClient(supabaseUrl, supabaseKey);
