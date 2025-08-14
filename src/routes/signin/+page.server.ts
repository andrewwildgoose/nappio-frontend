import { fail, redirect } from '@sveltejs/kit';
// import { supabase } from '$lib/server/supabaseClient';
import type { Actions, PageServerLoad } from './$types';
import { handleServerSignIn, handleServerSignOut, requireUnauth } from '$lib/server/auth-helper';

export const load: PageServerLoad = async (event) => {
    await requireUnauth(event);
};

export const actions = {
    auth: async ({ request, cookies, locals: { supabase }, url }) => {
        const data = await request.formData();
        const type = data.get('type') as 'signin' | 'signup' | 'signout';

        console.log('[Server] Processing auth action:', { type });

        try {
            switch (type) {
                case 'signout': {
                    return await handleServerSignOut(cookies);
                }

                case 'signup':
                    return handleSignup({ data, url });

                case 'signin': {
                    const email = data.get('email')?.toString();
                    const password = data.get('password')?.toString();
                    return await handleServerSignIn({ email, password, cookies });
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

// async function handleSignin({ data, cookies }: { data: FormData; cookies: Cookies }) {
//     const email = data.get('email')?.toString();
//     const password = data.get('password')?.toString();

//     if (!email || !password) {
//         return fail(400, { error: 'Missing email or password' });
//     }

//     const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
//         email,
//         password
//     });

//     if (authError) {
//         return fail(400, {
//             error: authError.message,
//             email
//         });
//     }

//     // Set auth cookies after successful authentication
//     const { access_token, refresh_token } = authData.session;
//     cookies.set('sb-access-token', access_token, {
//         path: '/',
//         maxAge: 60 * 60 * 24 * 7, // 7 days
//         sameSite: 'lax',
//         // secure: process.env.NODE_ENV === 'production'
//     });

//     cookies.set('sb-refresh-token', refresh_token, {
//         path: '/',
//         maxAge: 60 * 60 * 24 * 7,
//         sameSite: 'lax',
//         // secure: process.env.NODE_ENV === 'production'
//     });

//     return {
//         success: true,
//         message: 'Successfully signed in'
//     };
// }