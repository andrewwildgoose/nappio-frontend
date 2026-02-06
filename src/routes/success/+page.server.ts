import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { BACKEND_API_URL } from '$env/static/private';
import { getSessionFromCookies } from '$lib/server/supabase';

interface PaymentResponse {
	amount_total: number;
	customer_email: string;
	checkout_type: string;
}

export const load: PageServerLoad = async ({ url, cookies }) => {
	// Log incoming parameters for debugging
	console.log('Full URL:', url.href);
	console.log('Query Parameters:', Object.fromEntries(url.searchParams));

	const sessionId = url.searchParams.get('session_id');
	const email = url.searchParams.get('email');
	const type = url.searchParams.get('type');

	// Get session from cookies
	const { session, user } = await getSessionFromCookies(cookies);

	// Only require authentication for payment-related success pages
	if (sessionId && !user) {
		throw redirect(303, '/auth');
	}

	// Handle Stripe subscription success
	if (sessionId) {
		try {
			// Extract the JWT access token from the user's session
			// This will be used to authenticate the request to our backend
			const jwt = session?.access_token;

			// Call our backend API to retrieve payment details from Stripe
			// The backend uses the session_id to fetch the checkout session from Stripe
			const response = await fetch(`${BACKEND_API_URL}/api/v1/payment-completed-details`, {
				method: 'POST',
				headers: {
					Authorization: `Bearer ${jwt}`,
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ session_id: sessionId })
			});

			// If the API call fails, return an error response
			if (!response.ok) {
				console.error('payment details error:', response.status);
				return {
					type: 'error' as const,
					message: 'Failed to fetch payment details'
				};
			}

			// Parse the payment details from the response
			const data = (await response.json()) as PaymentResponse;

			// Format the payment amount from cents to pounds with 2 decimal places
			// Stripe returns amounts in the smallest currency unit (e.g., pence)
			const amount_total = new Intl.NumberFormat('en-GB', {
				minimumFractionDigits: 2,
				maximumFractionDigits: 2
			}).format(data.amount_total / 100);

			// If the amount is £0.00, this was a payment intent setup (e.g., saving card details)
			// rather than an actual payment, so return a different response type
			if (amount_total === '0.00') {
				return {
					type: 'payment_intent' as const,
					customerEmail: data.customer_email
				};
			}

			if (data.checkout_type === 'start_up') {
				return {
					type: 'start_up_payment' as const,
					amountTotal: amount_total,
					customerEmail: data.customer_email,
				};
			} else {
				// Return success data for an actual payment
				return {
					type: 'payment' as const,
					amountTotal: amount_total,
					customerEmail: data.customer_email,
				};				
			}


		} catch (error) {
			// Handle any network errors or unexpected failures
			console.error('Error fetching payment details:', error);
			return {
				type: 'error' as const,
				message: 'Failed to fetch payment details'
			};
		}
	}

	// Handle user signup success
	else if (type === 'signup' && email) {
		return {
			type: 'signup' as const,
			email
		};
	}

	// Handle newsletter signup success
	else if (email) {
		return {
			type: 'newsletter' as const,
			email
		};
	}

	// If neither parameter is present, return a generic error
	return {
		type: 'error' as const,
		message: 'Missing success parameters'
	};
};
