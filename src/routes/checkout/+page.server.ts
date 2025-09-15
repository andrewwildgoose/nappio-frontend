import { error, redirect } from '@sveltejs/kit';
import { BACKEND_API_URL } from '$env/static/private';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url, locals: { supabase } }) => {
    const subscriptionId = url.searchParams.get('subscription_id');

    if (!subscriptionId) {
        throw error(400, 'Missing subscription_id parameter');
    }

    // Get the user session for authentication
    const session = await supabase.auth.getSession();
    const jwt = session.data.session?.access_token;

    if (!jwt) {
        throw error(401, 'Unauthorized - Please sign in to continue');
    }

    try {
        // Call your backend API to create checkout session for the subscription
        const response = await fetch(`${BACKEND_API_URL}/api/v1/create-checkout-from-subscription`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${jwt}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ subscriptionId })
        });

        const data = await response.json();

        if (!response.ok) {
            console.error('Checkout creation error:', data);
            throw error(response.status, data.error || 'Failed to create checkout session');
        }

        // If we have a checkout URL, redirect immediately
        if (data.checkout_url) {
            throw redirect(302, data.checkout_url);
        }

        // If no checkout URL, throw an error
        throw error(500, 'No checkout URL received from server');
        
    } catch (err) {
        console.error('Error creating checkout session:', err);
        
        // If it's already a redirect or error, re-throw it
        if (err instanceof Response) {
            throw err;
        }
        
        // Otherwise, throw a generic error
        throw error(500, 'Failed to process checkout request');
    }
};
