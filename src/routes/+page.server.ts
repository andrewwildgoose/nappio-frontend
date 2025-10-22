import { fail, redirect } from '@sveltejs/kit';
import { BACKEND_API_URL } from '$env/static/private';
import type { Actions, ActionResult } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { handleServerSignIn, handleServerSignOut, requireUnauth } from '$lib/server/auth-helper';


// Interface for the data sent to the backend when subscribing
interface SubscribeData {
    first_name: string;
    email: string;
    postcode?: string;
}

// Interface for the successful response from the backend
interface BackendResponse {
    id: string;
    first_name: string;
    email: string;
    postcode: string;
    subscribed_at: string;
    email_verified: boolean;
}

// Interface for the error response from the backend
interface BackendError {
    detail: string | Array<{
        type: string;
        loc: string[];
        msg: string;
        input: string;
        ctx?: {
            reason?: string;
        };
    }>;
}

export const load: PageServerLoad = async (event) => {
    await requireUnauth(event);
};
// Define actions for the page
export const actions = {
    // Action to handle newsletter subscription
    subscribe: async ({ request }): Promise<ActionResult> => {
        // Parse form data from the request
        const data = await request.formData();
        const first_name = data.get('first_name') as string;
        const email = data.get('email') as string;
        const postcode = data.get('postcode') as string | null;

        try {
            // Send subscription data to the backend API
            const response = await fetch(`${BACKEND_API_URL}/newsletter/subscribe`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 
                    first_name, 
                    email, 
                    postcode: postcode ? postcode.toUpperCase() : postcode // Convert postcode to uppercase if provided
                } as SubscribeData),
            });

            // Parse the response from the backend
            const result = await response.json() as BackendResponse | BackendError;

            // Handle successful subscription
            if (response.ok) {
                console.log('Subscription successful:', result);
                return {
                    status: 'success',
                    email: email // Return success status and email
                };
            }

            // Handle expected errors (e.g., validation errors, duplicate email)
            console.log('Error from backend:', (result as BackendError).detail);
            let errorMessage: string;
            
            // Determine the error message based on the backend response
            if (typeof (result as BackendError).detail === 'string') {
                errorMessage = (result as BackendError).detail;
            } else if (Array.isArray((result as BackendError).detail)) {
                errorMessage = ((result as BackendError).detail)
                    .map((err) => err.msg) // Extract error messages from the array
                    .join(', '); // Combine error messages into a single string
            } else {
                errorMessage = 'An unknown error occurred'; // Fallback error message
            }

            // Return a failure response with the error message and form data
            return fail(response.status, {
                error: errorMessage,
                first_name,
                email,
                postcode,
            });

        } catch (error) {
            // Handle unexpected errors (e.g., network issues)
            console.error('Unexpected error:', error);
            throw redirect(303, '/error'); // Redirect to an error page
        }
    },
    
    auth: async ({ request, locals: { supabase }, url }) => {
        const data = await request.formData();
        const type = data.get('type') as 'signin' | 'signup' | 'signout';

        console.log('[Server] Processing auth action:', { type });

        try {
            switch (type) {
                case 'signout': {
                    return await handleServerSignOut({ locals: { supabase } } as any);
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

    throw redirect(303, '/success?type=signup&email=' + encodeURIComponent(email));
}
