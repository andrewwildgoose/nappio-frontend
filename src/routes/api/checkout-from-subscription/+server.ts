import { json } from '@sveltejs/kit';
import { BACKEND_API_URL } from '$env/static/private';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request, url, locals: { supabase } }) => {
    const session = await supabase.auth.getSession();
    const jwt = session.data.session?.access_token;

    if (!jwt) {
        return json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        // Accept subscription ID from either request body or query params
        let subscriptionId;
        const contentType = request.headers.get('content-type');
        
        if (contentType && contentType.includes('application/json')) {
            const { subscriptionId: bodySubscriptionId } = await request.json();
            subscriptionId = bodySubscriptionId;
        } else {
            subscriptionId = url.searchParams.get('subscription_id');
        }

        if (!subscriptionId) {
            return json({ error: 'Subscription ID is required' }, { status: 400 });
        }

        // Call your backend to create checkout session from subscription
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
            throw new Error(data.error || 'Failed to create checkout session');
        }

        return json(data);
    } catch (error) {
        console.error('Checkout creation error:', error);
        return json({ error: 'Failed to create checkout session' }, { status: 500 });
    }
};
