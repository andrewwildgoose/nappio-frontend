import { fail } from '@sveltejs/kit';
import { supabase } from '$lib/server/supabaseClient';
import type { PageServerLoad } from './$types';
import type { Actions } from '@sveltejs/kit';
import { requireUnauth } from '$lib/server/auth-helper';

export const load: PageServerLoad = async (event) => {
    await requireUnauth(event);
};

export const actions = {
    auth: async ({ request, url }) => {
        const data = await request.formData();
        const email = data.get('email') as string;
        const password = data.get('password') as string;
        const type = data.get('type') as 'signin' | 'signup';

        try {
            if (type === 'signup') {
                const first_name = data.get('first_name') as string;
                const surname = data.get('surname') as string;
                const postcode = data.get('postcode') as string;

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
            } else {
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
        } catch (error) {
            console.error('Auth error:', error);
            return fail(500, {
                error: 'An unexpected error occurred',
                email
            });
        }
    }
} satisfies Actions;