import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { handleServerSignIn, handleServerSignOut, requireUnauth } from '$lib/server/auth-helper';

export const load: PageServerLoad = async (event) => {
    await requireUnauth(event);
};

export const actions = {
    auth: async (event) => {
        const { request, locals: { supabase }, url } = event;
        const data = await request.formData();
        const type = data.get('type') as 'signin' | 'signup' | 'signout';

        console.log('[Server] Processing auth action:', { type });

        try {
            switch (type) {
                case 'signout': {
                    return await handleServerSignOut(event);
                }

                case 'signup':
                    return handleSignup({ data, url, supabase });

                case 'signin': {
                    const email = data.get('email')?.toString();
                    const password = data.get('password')?.toString();
                    return await handleServerSignIn({ email, password, supabase });
                }
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

async function handleSignup({ 
    data, 
    url, 
    supabase 
}: { 
    data: FormData; 
    url: URL;
    supabase: any;
}) {
    const email = data.get('email')?.toString();
    const password = data.get('password')?.toString();
    const first_name = data.get('first_name')?.toString();
    const surname = data.get('surname')?.toString();
    const postcode = data.get('postcode')?.toString();

    console.log('[Server] Signup attempt:', { email, first_name, surname, postcode });

    if (!email || !password || !first_name || !surname || !postcode) {
        console.log('[Server] Signup failed: Missing required fields');
        return fail(400, { error: 'Missing required fields' });
    }

    console.log('[Server] Calling Supabase signup...');
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
        console.log('[Server] Signup error:', authError.message);
        return fail(400, {
            error: authError.message,
            email,
            first_name,
            surname,
            postcode
        });
    }

    console.log('[Server] Signup successful, redirecting to success page');
    throw redirect(303, '/success?type=signup&email=' + encodeURIComponent(email));
}