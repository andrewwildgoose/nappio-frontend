import { createBrowserClient } from '@supabase/ssr';
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public';

export const supabase = createBrowserClient(
    PUBLIC_SUPABASE_URL, 
    PUBLIC_SUPABASE_ANON_KEY,
    {
        auth: {
            flowType: 'pkce', // Use PKCE for better security and SSR compatibility
            autoRefreshToken: true,
            persistSession: true,
            detectSessionInUrl: true
        }
    }
);