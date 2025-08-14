import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { BACKEND_API_URL } from '$env/static/private';

interface SubscriptionResponse {
    plan_name: string;
    customer_email: string;
}

export const load: PageServerLoad = async ({ url, locals }) => {
    // First validate session exists
    if (!locals.session) {
        throw redirect(303, '/signin');
    }

    const jwt = locals.session.access_token;
    if (!jwt) {
        throw redirect(303, '/signin');
    }

    // Log incoming parameters for debugging
    console.log('Full URL:', url.href);
    console.log('Query Parameters:', Object.fromEntries(url.searchParams));

    const sessionId = url.searchParams.get('session_id');
    const email = url.searchParams.get('email');

    // Handle Stripe subscription success
    if (sessionId) {
        try {
            const response = await fetch(`${BACKEND_API_URL}/api/v1/subscription-details`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${jwt}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ session_id: sessionId })
            });

            if (!response.ok) {
                console.error('Subscription details error:', response.status);
                return { 
                    type: 'error' as const, 
                    message: 'Failed to fetch subscription details' 
                };
            }

            const data = await response.json() as SubscriptionResponse;
            return {
                type: 'subscription' as const,
                planName: data.plan_name,
                customerEmail: data.customer_email
            };
        } catch (error) {
            console.error('Error fetching subscription details:', error);
            return { 
                type: 'error' as const, 
                message: 'Failed to fetch subscription details' 
            };
        }
    }

    // Handle newsletter signup success
    else if (email) {
        return {
            type: 'newsletter' as const,
            email
        };
    }

    // If neither parameter is present, return a generic error
    return {
        type: 'error' as const,
        message: 'Missing success parameters'
    };
};