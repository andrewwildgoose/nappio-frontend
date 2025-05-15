import { json } from '@sveltejs/kit';
import { BACKEND_API_URL } from '$env/static/private';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request, locals: { supabase } }) => {
    const session = await supabase.auth.getSession();
    const jwt = session.data.session?.access_token;

    if (!jwt) {
        return json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const { priceId } = await request.json();

        const response = await fetch(`${BACKEND_API_URL}/api/create-checkout`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${jwt}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ priceId })
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