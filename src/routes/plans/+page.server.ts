import type { PageServerLoad, Actions } from './$types';
import { supabase } from '$lib/server/supabaseClient';
import { BACKEND_API_URL } from '$env/static/private';
import { fail, redirect } from '@sveltejs/kit';
import { addAddress } from '$lib/api/address.server';
import { handle } from '../../hooks.server';

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

async function subscribeUser(priceId: string, addressId: string | undefined) {

    console.log('Subscribing user with address ID:', addressId);
	const session = await supabase.auth.getSession();

	if (!session.data.session) {
		return redirect(303, '/signin');
	}

	const cancelUrl = '/plans';

	if (!priceId) {
		return fail(400, { error: 'Missing price ID' });
	}

	const jwt = session.data.session?.access_token;

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
}

export const actions = {
    handleAddress: async ({ request, locals }) => {
        const session = await supabase.auth.getSession();

        if (!session.data.session) {
            console.log('No session found, redirecting to sign-in');
            return redirect(303, '/signin');
        }

        const jwt = session.data.session?.access_token;

        const formData = await request.formData();
        const address = {
            error: '',
            message: '',
            address_line_1: formData.get('address_line1') as string,
            address_line_2: formData.get('address_line2') as string,
            city: formData.get('city') as string,
            country: formData.get('country') as string,
            postcode: formData.get('postcode') as string,
            address_notes: formData.get('address_notes') as string,
            priceId: formData.get('priceId') as string
        };
        console.log('Address submitted in server:', address);

        try {
            const data = await addAddress(address, jwt);

            let addressId = data.address?.id;
            let priceId = address.priceId;
            
            const response = await subscribeUser(priceId, addressId);
            if ('success' in response && response.success) {
                return { success: true, checkout_url: response.checkout_url };
            }

            return response;
        } catch (error) {
            return fail(400, { error: error instanceof Error ? error.message : String(error) });
        }
    },
    subscribe: async ({ request, locals: { supabase } }) => {

        const session = await supabase.auth.getSession();

        console.log('Server: Session:', session);
        

        if (!session.data.session) {
            console.log('No session found, redirecting to sign-in');
            return redirect(303, '/signin');
        }

        const data = await request.formData();
        const priceId = data.get('priceId') as string;
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