import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url, locals: { supabase } }) => {
    const code = url.searchParams.get('code');

    if (code) {
        const { error } = await supabase.auth.exchangeCodeForSession(code);
        
        if (error) {
            console.error('Auth callback error:', error);
            throw redirect(303, '/signin?error=auth_callback_failed');
        }
    }

    throw redirect(303, '/dashboard');
};