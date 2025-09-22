import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { BACKEND_API_URL } from '$env/static/private';

interface PaymentResponse {
    amount_total: number;
    customer_email: string;
}

export const load: PageServerLoad = async ({ url, locals }) => {
    // Log incoming parameters for debugging
    console.log('Full URL:', url.href);
    console.log('Query Parameters:', Object.fromEntries(url.searchParams));

    const sessionId = url.searchParams.get('session_id');
    const email = url.searchParams.get('email');

    // Handle Stripe subscription success
    if (sessionId) {
        try {
            // First validate session exists
            if (!locals.session) {
                throw redirect(303, '/signin');
            }

            const jwt = locals.session.access_token;
            if (!jwt) {
                throw redirect(303, '/signin');
            }            
            const response = await fetch(`${BACKEND_API_URL}/api/v1/payment-completed-details`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${jwt}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ session_id: sessionId })
            });

            if (!response.ok) {
                console.error('payment details error:', response.status);
                return { 
                    type: 'error' as const, 
                    message: 'Failed to fetch payment details' 
                };
            }

            const data = await response.json() as PaymentResponse;

            const amount_total = new Intl.NumberFormat('en-GB', { 
                minimumFractionDigits: 2, 
                maximumFractionDigits: 2 
            }).format(data.amount_total / 100);

            return {
                type: 'payment' as const,
                amountTotal: amount_total,
                customerEmail: data.customer_email
            };
        } catch (error) {
            console.error('Error fetching payment details:', error);
            return { 
                type: 'error' as const, 
                message: 'Failed to fetch payment details' 
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