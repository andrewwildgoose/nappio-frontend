// Client side supabase client and cookie storage

import { createClient } from '@supabase/supabase-js';
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public';

export const supabase = createClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY, {
    auth: {
        persistSession: true,
        autoRefreshToken: true,
        storage: {
            type: 'cookieStorage',
            options: {
                name: 'sb',
                lifetime: 60 * 60 * 24 * 7, // 7 days
                domain: '',
                path: '/',
                sameSite: 'lax',
                //secure: process.env.NODE_ENV === 'production'
            }
        }
    }
});