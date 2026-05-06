import { error, redirect, fail } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import { BACKEND_API_URL } from '$env/static/private';
import { getSessionFromCookies } from '$lib/server/supabase';
import { logger } from '$lib/logger';

export const load: PageServerLoad = async ({ url, cookies }) => {
	// Extract subscription_id from query parameters
	const subscriptionId = url.searchParams.get('subscription_id');

	if (!subscriptionId) {
		throw error(400, 'Missing subscription_id parameter');
	}

	// Get session from cookies
	const { session } = await getSessionFromCookies(cookies);

	// If user is not signed in, redirect to signin with return URL
	if (!session || !session.access_token) {
		const returnUrl = `/checkout?subscription_id=${subscriptionId}`;
		throw redirect(303, `/auth?redirect=${encodeURIComponent(returnUrl)}`);
	}

	const jwt = session.access_token;

	let checkoutData;

	try {
		// Call your backend API to create checkout session for the subscription
		const requestUrl = `${BACKEND_API_URL}/api/v1/subscriptions/checkout`;

		const response = await fetch(requestUrl, {
			method: 'POST',
			headers: {
				Authorization: `Bearer ${jwt}`,
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ id: subscriptionId })
		});

		const data = await response.json();

		if (!response.ok) {
			logger.error('Checkout session creation failed', { status: response.status });
			throw error(response.status, data.error || 'Failed to create checkout session');
		}

		checkoutData = data;
	} catch (err) {
		// If it's already a redirect or error, re-throw it
		if (err instanceof Response) {
			throw err;
		}

		logger.error('Error creating checkout session');

		// Otherwise, throw a generic error
		throw error(500, 'Failed to process checkout request');
	}

	// Handle redirect outside try-catch
	if (checkoutData.checkout_url) {
		throw redirect(302, checkoutData.checkout_url);
	}

	// If no checkout URL, throw an error
	throw error(500, 'No checkout URL received from server');
};
