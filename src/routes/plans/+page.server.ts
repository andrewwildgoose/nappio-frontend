import type { PageServerLoad, Actions } from './$types';
import { supabase } from '$lib/server/supabaseClient';
import { BACKEND_API_URL } from '$env/static/private';
import { fail, redirect } from '@sveltejs/kit';

export const load: PageServerLoad = async () => {
    const { data: subscription_plans, error } = await supabase
        .from('subscription_plans')
        .select('*')
        .eq('active', true)
        .order('sort_order');

    if (error) {
        console.log('Error fetching subscription plans:', error.message);
        return {
            plans: [],
            error: error.message,
            user: null
        };
    }

    return {
        plans: subscription_plans || [],
    };
};

export const actions = {
    subscribe: async ({ request, locals: { supabase } }) => {

        const session = await supabase.auth.getSession();

        console.log('Server: Session:', session);
        

        if (!session.data.session) {
            console.log('No session found, redirecting to sign-in');
            throw redirect(303, '/signin');
        }

        const data = await request.formData();
        const priceId = data.get('priceId') as string;

        if (!priceId) {
            return fail(400, { error: 'Missing price ID' });
        }

        try {
            console.log('Server: Creating checkout session', { priceId });
            
            const jwt = session.data.session?.access_token; // This is your JWT

            const response = await fetch(`${BACKEND_API_URL}/api/v1/create-checkout`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${jwt}`
                },
                body: JSON.stringify({ priceId })
            });

            if (!response.ok) {
                const errorData = await response.json();
                return fail(response.status, { 
                    error: errorData.error || 'Failed to create checkout session' 
                });
            }

            const { checkout_url } = await response.json();
            
            if (!checkout_url) {
                return fail(500, { error: 'No checkout URL received' });
            }

            return { success: true, checkout_url };

        } catch (error) {
            console.error('Server: Error creating checkout session:', error);
            return fail(500, { error: 'Failed to initiate checkout' });
        }
    }
} satisfies Actions;