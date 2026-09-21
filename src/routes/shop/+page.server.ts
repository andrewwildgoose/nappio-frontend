import { BACKEND_API_URL } from '$env/static/private';
import { fail, isRedirect, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import type { UserAddress } from '$lib/types/address';
import { getSessionFromCookies } from '$lib/server/supabase';
import { logger } from '$lib/logger';

interface ShopProduct {
	id: string;
	name?: string;
	description?: string;
	price?: number;
	unit_amount?: number;
	currency?: string;
	stripe_price_id?: string;
}

interface ShopProductsResponse {
	products?: ShopProduct[];
}

function buildAddressFromForm(formData: FormData) {
	const address_line_1 = String(formData.get('address_line_1') || '').trim();
	const address_line_2 = String(formData.get('address_line_2') || '').trim();
	const city = String(formData.get('city') || '').trim();
	const postcode = String(formData.get('postcode') || '').trim();
	const country = String(formData.get('country') || '').trim();
	const address_notes = String(formData.get('address_notes') || '').trim();

	const hasAnyAddressField =
		Boolean(address_line_1) || Boolean(city) || Boolean(postcode) || Boolean(country) || Boolean(address_line_2);

	if (!hasAnyAddressField) {
		return null;
	}

	if (!address_line_1 || !city || !postcode || !country) {
		return { error: 'Please complete all required address fields.' };
	}

	return {
		address: {
			address_line_1,
			address_line_2: address_line_2 || undefined,
			city,
			postcode,
			country,
			address_notes: address_notes || undefined
		}
	};
}

async function fetchProducts(fetchFn: typeof fetch): Promise<ShopProduct[]> {
	const productsResponse = await fetchFn(`${BACKEND_API_URL}/api/v1/shop/products`);

	if (!productsResponse.ok) {
		throw new Error(`Failed to load products: ${productsResponse.status}`);
	}

	const productsData: ShopProductsResponse = await productsResponse.json();
	return productsData.products ?? [];
}

export const load: PageServerLoad = async ({ fetch, cookies }) => {
	const { session, user } = await getSessionFromCookies(cookies);
	let addresses: UserAddress[] = [];
	let loadError: string | null = null;

	let products: ShopProduct[] = [];
	try {
		products = await fetchProducts(fetch);
	} catch {
		logger.error('Error loading shop products');
		loadError = 'We could not load products right now. Please try again shortly.';
	}

	if (session?.access_token) {
		try {
			const addressesResponse = await fetch(`${BACKEND_API_URL}/api/v1/user/addresses`, {
				headers: {
					'Content-Type': 'application/json',
					Authorization: `******
				}
			});

			if (addressesResponse.ok) {
				addresses = await addressesResponse.json();
			}
		} catch {
			logger.error('Error loading user addresses for shop checkout');
		}
	}

	return {
		products,
		addresses,
		isSignedIn: Boolean(session?.access_token),
		userEmail: user?.email ?? null,
		loadError
	};
};

export const actions: Actions = {
	checkout: async ({ fetch, request, cookies }) => {
		const formData = await request.formData();
		const { session } = await getSessionFromCookies(cookies);

		let products: ShopProduct[] = [];
		try {
			products = await fetchProducts(fetch);
		} catch {
			return fail(500, { error: 'Unable to process checkout because products could not be loaded.' });
		}

		const items = products
			.map((product) => {
				const quantityRaw = String(formData.get(`qty_${product.id}`) ?? '0');
				const quantity = Number.parseInt(quantityRaw, 10);
				if (!Number.isInteger(quantity) || quantity < 1) {
					return null;
				}

				return {
					product_id: product.id,
					quantity
				};
			})
			.filter((item): item is { product_id: string; quantity: number } => item !== null);

		if (items.length === 0) {
			return fail(400, { error: 'Please select at least one product.' });
		}

		const cancel_url = '/shop';
		const addressResult = buildAddressFromForm(formData);
		if (addressResult && 'error' in addressResult) {
			return fail(400, { error: addressResult.error });
		}

		try {
			if (session?.access_token) {
				const addressId = String(formData.get('addressId') || '').trim();
				if (!addressId && !addressResult) {
					return fail(400, {
						error: 'Please select a saved address or enter a new delivery address.'
					});
				}

				const payload: {
					items: { product_id: string; quantity: number }[];
					cancel_url: string;
					address_id?: string;
					address?: Record<string, string | undefined>;
				} = {
					items,
					cancel_url
				};

				if (addressId) {
					payload.address_id = addressId;
				} else if (addressResult?.address) {
					payload.address = addressResult.address;
				}

				const response = await fetch(`${BACKEND_API_URL}/api/v1/shop/checkout`, {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
						Authorization: `******
					},
					body: JSON.stringify(payload)
				});

				const responseData = await response.json();
				if (!response.ok) {
					return fail(response.status, {
						error: responseData.detail || responseData.error || 'Unable to create checkout session.'
					});
				}

				if (!responseData.checkout_url) {
					return fail(500, { error: 'No checkout URL was returned by the server.' });
				}

				throw redirect(303, responseData.checkout_url);
			}

			const guest_email = String(formData.get('guest_email') || '').trim();
			if (!guest_email || !guest_email.includes('@')) {
				return fail(400, { error: 'Please provide a valid email address.' });
			}

			if (!addressResult?.address) {
				return fail(400, { error: 'Please provide your delivery address to continue.' });
			}

			const guestPayload = {
				items,
				guest_email,
				address: addressResult.address,
				cancel_url
			};

			const guestResponse = await fetch(`${BACKEND_API_URL}/api/v1/shop/checkout/guest`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(guestPayload)
			});

			const guestResponseData = await guestResponse.json();
			if (!guestResponse.ok) {
				return fail(guestResponse.status, {
					error:
						guestResponseData.detail ||
						guestResponseData.error ||
						'Unable to create guest checkout session.'
				});
			}

			if (!guestResponseData.checkout_url) {
				return fail(500, { error: 'No checkout URL was returned by the server.' });
			}

			throw redirect(303, guestResponseData.checkout_url);
		} catch (error) {
			if (isRedirect(error)) {
				throw error;
			}

			logger.error('Error creating shop checkout session');
			return fail(500, { error: 'We could not start checkout. Please try again.' });
		}
	}
};
