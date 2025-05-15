import { BACKEND_API_URL } from '$env/static/private';

/** @type {import('./$types').PageServerLoad} */
export async function load({ url, locals: { supabase } }) {
    // Log incoming parameters for debugging
    console.log('Full URL:', url.href);
    console.log('Query Parameters:', Object.fromEntries(url.searchParams));

    const sessionId = url.searchParams.get('session_id');
    const email = url.searchParams.get('email');

    // Handle Stripe subscription success
    if (sessionId) {
        try {
            const { data: { session } } = await supabase.auth.getSession();
            const response = await fetch(`${BACKEND_API_URL}/subscription-details`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${session?.access_token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ session_id: sessionId })
            });

            if (!response.ok) {
                return { type: 'error', message: 'Failed to fetch subscription details' };
            }

            const data = await response.json();
            return {
                type: 'subscription',
                planName: data.plan_name,
                customerEmail: data.customer_email
            };
        } catch (error) {
            console.error('Error fetching subscription details:', error);
            return { type: 'error', message: 'Failed to fetch subscription details' };
        }
    }

    // Handle newsletter signup success
    else if (email) {
        return {
            type: 'newsletter',
            email
        };
    }

    // If neither parameter is present, return a generic error
    return {
        type: 'error',
        message: 'Missing success parameters'
    };
}