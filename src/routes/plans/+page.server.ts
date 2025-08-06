import type { PageServerLoad, Actions } from './$types';
import { supabase } from '$lib/server/supabaseClient';
import { BACKEND_API_URL } from '$env/static/private';
import { fail, redirect } from '@sveltejs/kit';
import { addAddress} from '$lib/api/address';

export const load: PageServerLoad = async ( { locals } ) => {
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
            user: locals.user
        };
    }

    return {
        plans: subscription_plans || [],
        user: locals.user
    };
};

export const actions = {
    subscribe: async ({ request, locals: { supabase } }) => {

        const session = await supabase.auth.getSession();

        console.log('Server: Session:', session);
        

        if (!session.data.session) {
            console.log('No session found, redirecting to sign-in');
            return redirect(303, '/signin');
        }

        const data = await request.formData();
        const priceId = data.get('priceId') as string;
        const phone = data.get('phone') as string;
        const cancelUrl = '/plans';

        // Collect address fields from form
        const address = {
            address_line_1: data.get('address_line1'),
            address_line_2: data.get('address_line2') || undefined,
            city: data.get('city'),
            country: data.get('country'),
            postcode: data.get('postcode'),
            address_notes: data.get('address_notes') || undefined
        };

        if (!priceId) {
            return fail(400, { error: 'Missing price ID' });
        }

        try {
            console.log('Server: Creating checkout session', { priceId });
            
            const jwt = session.data.session?.access_token; // This is your JWT

            // 1. Add address to backend
            const addressRes = await addAddress(address, jwt);
            const addressId = addressRes.address?.id;

            const response = await fetch(`${BACKEND_API_URL}/api/v1/create-checkout`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${jwt}`
                },
                body: JSON.stringify({ priceId, addressId, cancelUrl })
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