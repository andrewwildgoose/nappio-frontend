import { redirect, fail } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import { BACKEND_API_URL } from '$env/static/private';
import { supabase } from '$lib/server/supabaseClient';
import { addAddress, assignAddress } from '$lib/api/address.server';

interface SubscriptionDetailsResponse {
    id: string;
    plan_name: string;
    status: string;
    monthly_cost: number;
    start_date: string;
    end_date?: string;
    next_payment_date?: string;
    address_id?: string;  // Add this field
    address?: UserAddress;  // Add this field for the matched address
}

interface AddressResponse {
    address_line_1: string;
    address_line_2?: string;
    city: string;
    country: string;
    postcode: string;
    address_notes?: string;
}

interface UserAddress {
    id: string;
    user_id: string;
    address_line_1: string;
    address_line_2?: string;
    city: string;
    postcode: string;
    country: string;
    address_notes?: string;
    created_at?: string;
    updated_at?: string;
}

interface AddAddressResponse {
    success: boolean;
    message: string;
    address?: UserAddress;
}

interface DeleteAddressResponse {
    message: string;
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

        if (!subscriptionsResponse.ok || !addressesResponse.ok) {
            console.error('HTTP error:', {
                subscriptions: subscriptionsResponse.status,
                addresses: addressesResponse.status
            });
            throw new Error(`HTTP error! status: ${subscriptionsResponse.status}, ${addressesResponse.status}`);
        }

        const subscriptions: SubscriptionDetailsResponse[] = await subscriptionsResponse.json();
        const addresses: UserAddress[] = await addressesResponse.json();

        console.log('Raw subscriptions:', subscriptions);
        console.log('Available addresses:', addresses);

        // Match addresses to subscriptions
        const subscriptionsWithAddresses = subscriptions.map(subscription => {
            if (subscription.address_id) {
                console.log(`Finding address match for subscription ${subscription.id} with address_id ${subscription.address_id}`);
                const matchedAddress = addresses.find(addr => addr.id === subscription.address_id);
                
                if (matchedAddress) {
                    console.log(`Found matching address for subscription ${subscription.id}:`, matchedAddress);
                    return {
                        ...subscription,
                        address: matchedAddress
                    };
                } else {
                    console.log(`No matching address found for subscription ${subscription.id} with address_id ${subscription.address_id}`);
                    return {
                        ...subscription,
                        address: null
                    };
                }
            }
            
            console.log(`Subscription ${subscription.id} has no address_id`);
            return {
                ...subscription,
                address: null
            };
        });

        console.log('Final subscriptions with addresses:', subscriptionsWithAddresses);

        return {
            user: {
                ...userData,
            },
            subscriptions: subscriptionsWithAddresses,
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

    submitAddress: async ({ request }) => {

        const { data: { session } } = await supabase.auth.getSession();
        const jwt = session?.access_token;

        const formData = await request.formData();
        const address = {
            error: '',
            message: '',
            address_line_1: formData.get('address_line1') as string,
            address_line_2: formData.get('address_line2') as string,
            city: formData.get('city') as string,
            country: formData.get('country') as string,
            postcode: formData.get('postcode') as string,
            address_notes: formData.get('address_notes') as string
        };
        console.log('Address submitted in server:', address);

        try {
            const data = await addAddress(address, jwt);
            return { success: data.success, message: data.message, address: data.address };
        } catch (error) {
            return fail(400, { error: error instanceof Error ? error.message : String(error) });
        }

    },
    assignAddress: async ({ request, locals }) => {
        const formData = await request.formData();
        
        const session = await supabase.auth.getSession();
        const jwt = session.data.session?.access_token;

        const addressId = String(formData.get('address_id'));
        const subscriptionId = String(formData.get('subscription_id'));
        
        console.log('Starting address assignment:', {
            addressId,
            subscriptionId,
        });
            
        try {
            const data = await assignAddress(addressId, subscriptionId, jwt);
            return { success: true, message: data.message };
        } catch (error) {
            return fail(400, { error: error instanceof Error ? error.message : String(error) });
        }
    },
    addressDelete: async ({ request, locals }) => {
        const formData = await request.formData();

        const session = await supabase.auth.getSession();
        const jwt = session.data.session?.access_token;
        
        const addressId = formData.get('id');
        const response = await fetch(`${BACKEND_API_URL}/api/v1/user/delete-address/${addressId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${jwt}`
            }
        });

        if (!response.ok) {
            const errorData = await response.json();
            return fail(response.status, {
                error: errorData.detail || 'Failed to delete address'
            });
        }

        const data: DeleteAddressResponse = await response.json();
        return {
            success: true,
            message: data.message
        };
    },
} satisfies Actions;
