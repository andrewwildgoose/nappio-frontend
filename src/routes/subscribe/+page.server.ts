import { error, fail } from '@sveltejs/kit';
import { supabase } from '$lib/server/supabaseClient';
import type { Actions } from './$types';
import type { AddressFormData } from '$lib/types/address';
import { BACKEND_API_URL } from '$env/static/private';

export const actions = {
    createSubscription: async ({ request, locals }) => {
        if (!locals.user) {
            throw error(401, 'Unauthorized');
        }

        const cancelUrl = '/subscribe';

        const formData = await request.formData();
        const data = {
            babyBirthdate: formData.get('babyBirthdate'),
            babyWeight: Number(formData.get('babyWeight')),
            wantNappyWraps: formData.get('wantNappyWraps') === 'true',
            address: JSON.parse(formData.get('address') as string) as AddressFormData,
            cancelUrl: cancelUrl
        };

        try {
            const session = await supabase.auth.getSession();
            const jwt = session.data.session?.access_token;

            const response = await fetch(`${BACKEND_API_URL}/api/v1/start-subscription`, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${jwt}`
                },
                body: JSON.stringify(data)
            });

            const responseData = await response.json();
            console.log('Subscription creation response:', responseData);

            if (!response.ok) {
                return fail(400, { 
                    error: responseData.error || 'Subscription creation failed' 
                });
            }

            const { checkout_url, session_id } = responseData;
            console.log('Received checkout URL:', checkout_url);
            console.log('Received session ID:', session_id);
            
            if (!checkout_url) {
                return fail(500, { error: 'No checkout URL received' });
            }

            // Return the checkout data directly
            return {
                checkout_url,
                session_id
            };
        } catch (e) {
            throw error(500, 'Failed to create subscription');
        }
    }
} satisfies Actions;
