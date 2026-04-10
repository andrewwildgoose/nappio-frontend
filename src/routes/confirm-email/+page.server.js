import { fail } from '@sveltejs/kit';
import { BACKEND_API_URL } from '$env/static/private';
import { logger } from '$lib/logger';

/** @type {import('./$types').PageServerLoad} */
export async function load({ url }) {
	const email = url.searchParams.get('email');

	if (!email) {
		return fail(400, { error: 'Email parameter is missing.' });
	}

	try {
		const response = await fetch(`${BACKEND_API_URL}/api/v1/newsletter/verify`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ email })
		});

		const result = await response.json();

		if (!response.ok) {
			return fail(response.status, { error: result.detail || 'Verification failed.' });
		}

		return {
			email: email,
			message: result.message
		};
	} catch (error) {
		logger.error('Email verification request failed');
		return fail(500, { error: 'An unexpected error occurred while verifying the email.' });
	}
}
