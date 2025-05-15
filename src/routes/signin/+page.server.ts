import { fail, redirect } from '@sveltejs/kit';
import { supabase } from '$lib/server/supabaseClient';
import type { Actions, PageServerLoad } from './$types';
import { requireUnauth } from '$lib/server/auth-helper';

export const load: PageServerLoad = async (event) => {
    await requireUnauth(event);
};

export const actions = {
    auth: async ({ request, locals: { supabase }, url }) => {
        const data = await request.formData();
        const type = data.get('type') as 'signin' | 'signup' | 'signout';

        console.log('[Server] Processing auth action:', { type });

        try {
            switch (type) {
                case 'signout': {
                    console.log('[Server] Processing signout');
                    const { error } = await supabase.auth.signOut();
                    
                    if (error) {
                        console.error('[Server] Signout error:', error);
                        return fail(500, { error: error.message });
                    }

                    console.log('[Server] Signout successful');
                    return { success: true, signedOut: true };
                }

                case 'signup':
                    return handleSignup({ data, url });

                case 'signin':
                    return handleSignin({ data });

                default:
                    return fail(400, { error: 'Invalid action type' });
                }
            } catch (error) {
                if (error instanceof redirect) throw error;
                console.error('Auth error:', error);
                return fail(500, { error: 'An unexpected error occurred' });
            }
        }
    } satisfies Actions;

async function handleSignup({ data, url }: { data: FormData; url: URL }) {
    const email = data.get('email')?.toString();
    const password = data.get('password')?.toString();
    const first_name = data.get('first_name')?.toString();
    const surname = data.get('surname')?.toString();
    const postcode = data.get('postcode')?.toString();

    if (!email || !password || !first_name || !surname || !postcode) {
        return fail(400, { error: 'Missing required fields' });
    }

    const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: {
                first_name,
                surname,
                postcode: postcode.toUpperCase()
            },
            emailRedirectTo: `${url.origin}/auth/callback`
        }
    });

    if (authError) {
        return fail(400, {
            error: authError.message,
            email,
            first_name,
            surname,
            postcode
        });
    }

    return {
        success: true,
        message: 'Check your email for the confirmation link!',
        email
    };
}

async function handleSignin({ data }: { data: FormData }) {
    const email = data.get('email')?.toString();
    const password = data.get('password')?.toString();

    if (!email || !password) {
        return fail(400, { error: 'Missing email or password' });
    }

    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password
    });

    if (authError) {
        return fail(400, {
            error: authError.message,
            email
        });
    }

    return {
        success: true,
        email
    };
}