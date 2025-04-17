import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url, locals: { supabase } }) => {
    const code = url.searchParams.get('code');
    console.log('Received code:', code);
    console.log('Received URL:', url);

    if (code) {
        const { data: { session }, error } = await supabase.auth.exchangeCodeForSession(code);
        
        if (error) {
            console.error('Auth error:', error);
            throw redirect(303, '/signin?error=auth_callback_failed');
        }

        if (session?.user) {
            // The user store will be automatically updated by Supabase's auth state change listener
            throw redirect(303, '/dashboard');
        }
    }

    throw redirect(303, '/dashboard');
};