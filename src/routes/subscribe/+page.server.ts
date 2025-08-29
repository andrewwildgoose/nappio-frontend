import { error } from '@sveltejs/kit';
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

        console.log('Creating subscription with data:', JSON.stringify(data));

        try {

            const session = await supabase.auth.getSession();

            const jwt = session.data.session?.access_token;

            const response = await fetch(`${BACKEND_API_URL}/api/v1/create-subscription`, {
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
                throw error(400, responseData.error || 'Subscription creation failed');
            }

            return {
                success: true,
                checkout_url: responseData.checkout_url
            };
        } catch (e) {
            throw error(500, 'Failed to create subscription');
        }
    }
} satisfies Actions;
