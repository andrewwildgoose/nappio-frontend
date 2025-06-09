import { redirect, fail } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import { BACKEND_API_URL } from '$env/static/private';
import { supabase } from '$lib/server/supabaseClient';

interface SubscriptionDetailsResponse {
    plan_name: string;
    status: string;
    monthly_cost: number;
    start_date: string;
    end_date?: string;
    next_payment_date?: string;
}

interface AddressResponse {
    address_line_1: string;
    address_line_2?: string;
    city: string;
    country: string;
    postcode: string;
    address_notes?: string;
}

export const load: PageServerLoad = async ({ locals, fetch }) => {
    if (!locals.session) {
        throw redirect(303, '/signin');
    }

    const userData = {
        id: locals.user?.id,
        email: locals.user?.email,
        first_name: locals.user?.user_metadata?.first_name,
        surname: locals.user?.user_metadata?.surname,
        postcode: locals.user?.user_metadata?.postcode,
        email_verified: locals.user?.email_confirmed_at ? true : false
    };

    try {
        const session = await supabase.auth.getSession();
        const jwt = session.data.session?.access_token;

        // Fetch both subscriptions and addresses in parallel
        const [subscriptionsResponse, addressesResponse] = await Promise.all([
            fetch(`${BACKEND_API_URL}/api/v1/user/user-subscriptions`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${jwt}`
                },
            }),
            fetch(`${BACKEND_API_URL}/api/v1/user/user-addresses`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${jwt}`
                },
            })
        ]);

        if (!subscriptionsResponse.ok) {
            console.error('Subscriptions HTTP error:', subscriptionsResponse.status);
            throw new Error(`Subscriptions HTTP error! status: ${subscriptionsResponse.status}`);
        }

        if (!addressesResponse.ok) {
            console.error('Addresses HTTP error:', addressesResponse.status);
            throw new Error(`Addresses HTTP error! status: ${addressesResponse.status}`);
        }

        const subscriptions: SubscriptionDetailsResponse[] = await subscriptionsResponse.json();
        const addresses: AddressResponse[] = await addressesResponse.json();

        console.log('Fetched subscriptions:', subscriptions);
        console.log('Fetched addresses:', addresses);

        return {
            user: {
                ...userData,
            },
            subscriptions,
            addresses
        };
    } catch (error) {
        console.error('Error fetching data:', error);
        return {
            user: userData,
            subscriptions: [],
            addresses: [],

        };
    }
};

export const actions: Actions = {
    address: async ({ request, fetch, locals }) => {
        const formData = await request.formData();
        const address = {
            address_line_1: formData.get('address_line1'),
            address_line_2: formData.get('address_line2'),
            city: formData.get('city'),
            country: formData.get('country'),
            postcode: formData.get('postcode'),
            address_notes: formData.get('address_notes')
        };

        console.log('Updating address with data:', address);

        try {
            const session = await supabase.auth.getSession();
            const jwt = session.data.session?.access_token;

            const response = await fetch(`${BACKEND_API_URL}/api/v1/user/update-user-address`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${jwt}`
                },
                body: JSON.stringify(address)
            });

            if (!response.ok) {
                const errorData = await response.json();
                return fail(response.status, {
                    error: errorData.detail || 'Failed to update address',
                    ...address
                });
            }

            return {
                message: 'Address updated successfully',
                ...address
            };

        } catch (error) {
            console.error('Error updating address:', error);
            return fail(500, {
                error: 'Failed to update address',
                ...address
            });
        }
    }
};