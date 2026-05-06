import { redirect, fail } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import type { UserAddress } from '$lib/types/address';
import { BACKEND_API_URL } from '$env/static/private';
import { addAddress, assignAddress } from '$lib/api/address.server';
import { createSupabaseServerClient, getSessionFromCookies } from '$lib/server/supabase';
import { logger } from '$lib/logger';

interface SubscriptionDetailsResponse {
	id: string;
	status: string;
	start_date: string;
	end_date?: string;
	subscription_id: string;
	next_payment_date?: string;
	address_id?: string; // Add this field
	address?: UserAddress; // Add this field for the matched address
	items: Array<{
		name: string;
		price: number;
		currency: string;
	}>;
}

interface AddressResponse {
	address_line_1: string;
	address_line_2?: string;
	city: string;
	country: string;
	postcode: string;
	address_notes?: string;
}

// interface UserAddress {
// 	id: string;
// 	user_id: string;
// 	address_line_1: string;
// 	address_line_2?: string;
// 	city: string;
// 	postcode: string;
// 	country: string;
// 	address_notes?: string;
// 	created_at?: string;
// 	updated_at?: string;
// }

interface DeleteAddressResponse {
	message: string;
}

export const load: PageServerLoad = async ({ fetch, cookies }) => {
	// Get session from cookies
	const { session, user } = await getSessionFromCookies(cookies);

	// First validate session exists
	if (!session) {
		throw redirect(303, '/auth');
	}

	const jwt = session.access_token;
	if (!jwt) {
		throw redirect(303, '/auth');
	}

	const userData = {
		id: user?.id,
		email: user?.email,
		first_name: user?.user_metadata?.first_name,
		surname: user?.user_metadata?.surname,
		postcode: user?.user_metadata?.postcode,
		email_verified: user?.email_confirmed_at ? true : false
	};

	try {
		// Use the token from session consistently
		const [subscriptionsResponse, addressesResponse] = await Promise.all([
			fetch(`${BACKEND_API_URL}/api/v1/user/subscription`, {
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${jwt}`
				}
			}),
			fetch(`${BACKEND_API_URL}/api/v1/user/addresses`, {
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${jwt}`
				}
			})
		]);

		if (!subscriptionsResponse.ok || !addressesResponse.ok) {
			logger.error('Failed to fetch user data', {
				subscriptionsStatus: subscriptionsResponse.status,
				addressesStatus: addressesResponse.status
			});
			throw new Error(
				`HTTP error! status: ${subscriptionsResponse.status}, ${addressesResponse.status}`
			);
		}

		const subscriptions: SubscriptionDetailsResponse[] = await subscriptionsResponse.json();
		const addresses: UserAddress[] = await addressesResponse.json();

		// Match addresses to subscriptions
		const subscriptionsWithAddresses = subscriptions.map((subscription) => {
			if (subscription.address_id) {
				const matchedAddress = addresses.find((addr) => addr.id === subscription.address_id);

				if (matchedAddress) {
					return {
						...subscription,
						address: matchedAddress
					};
				} else {
					return {
						...subscription,
						address: null
					};
				}
			}

			return {
				...subscription,
				address: null
			};
		});

		return {
			user: {
				...userData
			},
			subscriptions: subscriptionsWithAddresses,
			addresses
		};
	} catch (error) {
		logger.error('Error fetching dashboard data');
		return {
			user: userData,
			subscriptions: [],
			addresses: []
		};
	}
};

export const actions: Actions = {
	submitAddress: async ({ request, cookies }) => {
		// Get session from cookies
		const { session } = await getSessionFromCookies(cookies);

		if (!session?.access_token) {
			return fail(401, { error: 'Unauthorized' });
		}

		const jwt = session.access_token;

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

		try {
			const data = await addAddress(address, jwt);
			return { success: data.success, message: data.message, address: data.address };
		} catch (error) {
			return fail(400, { error: error instanceof Error ? error.message : String(error) });
		}
	},
	assignAddress: async ({ request, cookies }) => {
		// Get session from cookies
		const { session } = await getSessionFromCookies(cookies);

		if (!session?.access_token) {
			return fail(401, { error: 'Unauthorized' });
		}

		const jwt = session.access_token;
		const formData = await request.formData();

		const addressId = String(formData.get('address_id'));
		const subscriptionId = String(formData.get('subscription_id'));

		try {
			const data = await assignAddress(addressId, subscriptionId, jwt);
			return { success: true, message: data.message };
		} catch (error) {
			return fail(400, { error: error instanceof Error ? error.message : String(error) });
		}
	},
	addressDelete: async ({ request, cookies }) => {
		// Get session from cookies
		const { session } = await getSessionFromCookies(cookies);

		if (!session?.access_token) {
			return fail(401, { error: 'Unauthorized' });
		}

		const jwt = session.access_token;
		const formData = await request.formData();

		const addressId = formData.get('id');
		const response = await fetch(`${BACKEND_API_URL}/api/v1/user/addresses/${addressId}`, {
			method: 'DELETE',
			headers: {
				Authorization: `Bearer ${jwt}`
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
	}
} satisfies Actions;
