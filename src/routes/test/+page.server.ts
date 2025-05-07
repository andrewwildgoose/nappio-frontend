import { BACKEND_API_URL } from '$env/static/private';
import type { Actions } from './$types';

export const actions: Actions = {
    testJWT: async ({ request, locals: { supabase } }) => {
        const session = await supabase.auth.getSession();
        const jwt = session.data.session?.access_token; // This is your JWT

        if (!jwt) {
            return { success: false, error: 'No JWT found - user might not be logged in' };
        }

        try {
            const response = await fetch(`${BACKEND_API_URL}/api/test/jwt`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${jwt}`,
                    'Content-Type': 'application/json'
                }
            });

            const data = await response.json();
            return { success: true, data };
        } catch (error) {
            console.error('Error sending JWT:', error);
            return { success: false, error: 'Failed to communicate with backend' };
        }
    }
};