import { error, fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import type { AddressFormData, UserAddress } from '$lib/types/address';
import { BACKEND_API_URL } from '$env/static/private';
import { getSessionFromCookies } from '$lib/server/supabase';
import { logger } from '$lib/logger';

export const load: PageServerLoad = async ({ fetch, cookies }) => {
	// Get session from cookies
	const { user, session } = await getSessionFromCookies(cookies);

	let addresses: UserAddress[] = [];

	if (session) {
		try {

			const jwt = session.access_token;
			// Use the token from session consistently
			const addressesResponse = await fetch(`${BACKEND_API_URL}/api/v1/user/addresses`, {
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${jwt}`
				}
			});

			if (!addressesResponse.ok) {
				logger.error('Failed to fetch user addresses', { status: addressesResponse.status });
				throw new Error(
					`HTTP error! status: ${addressesResponse.status}`
				);
			}

			addresses = await addressesResponse.json();

		} catch (err) {
			logger.error('Error loading addresses');
			throw error(500, 'Failed to load addresses');
		}
	}
	return { user, session, addresses };
};

export const actions = {
	createSubscription: async ({ request, cookies }) => {
		// Get session from cookies
		const { session, user } = await getSessionFromCookies(cookies);

		if (!user) {
			throw error(401, 'Unauthorized');
		}

		const cancelUrl = '/subscribe';

		const formData = await request.formData();
		const addressId = formData.get('addressId') as string;
		
		const data = {
			babyBirthdate: formData.get('babyBirthdate'),
			babyWeight: Number(formData.get('babyWeight')),
			// Marked for removal - leaving in as may reintroduce later
			// wantNappyWraps: formData.get('wantNappyWraps') === 'true',
			serviceLevel: formData.get('serviceLevel'),
			// If addressId exists, send it; otherwise send the full address object
			...(addressId ? { addressId } : { address: JSON.parse(formData.get('address') as string) as AddressFormData }),
			cancelUrl: cancelUrl
		};

		try {
			const jwt = session?.access_token;

			if (!jwt) {
				throw error(401, 'No valid session');
			}

			const response = await fetch(`${BACKEND_API_URL}/api/v1/subscriptions`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${jwt}`
				},
				body: JSON.stringify(data)
			});

			const responseData = await response.json();

			if (!response.ok) {
				return fail(400, {
					error: responseData.error || 'Subscription creation failed'
				});
			}

			const { checkout_url, session_id } = responseData;

			if (!checkout_url) {
				return fail(500, { error: 'No checkout URL received' });
			}

			// Return the checkout data directly
			return {
				checkout_url,
				session_id
			};
		} catch (err) {
			logger.error('Error creating subscription');
			throw error(500, 'Failed to create subscription');
		}
	}
} satisfies Actions;
