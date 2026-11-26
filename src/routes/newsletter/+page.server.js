import { fail } from '@sveltejs/kit';
import { backendFetch } from '$lib/server/backend';
import { logger } from '$lib/logger';

// UK postcode outward code (first half), e.g. SW2, M1, EC1A. Mirrors backend validation.
const OUTWARD_CODE_RE = /^[A-Z]{1,2}[0-9][A-Z0-9]?$/;

/** @param {unknown} detail */
function formatError(detail) {
	if (typeof detail === 'string') return detail;
	if (Array.isArray(detail)) {
		// Pydantic messages are prefixed with "Value error, ", so strip it
		return detail.map((err) => String(err?.msg ?? '').replace(/^Value error, /, '')).join(', ');
	}
	return 'An unknown error occurred';
}

export const actions = {
	subscribe: async ({ request }) => {
		const data = await request.formData();
		const first_name = String(data.get('first_name') ?? '').trim();
		const email = String(data.get('email') ?? '').trim();
		const postcode = String(data.get('postcode') ?? '')
			.trim()
			.toUpperCase();
		const honeypot = String(data.get('company') ?? '');

		// Honeypot filled in, so this is almost certainly a bot. Pretend it worked and drop it.
		if (honeypot) {
			logger.warn('Newsletter honeypot triggered, signup discarded');
			return { success: true, email };
		}

		if (postcode && !OUTWARD_CODE_RE.test(postcode)) {
			return fail(400, {
				error: 'Please enter a valid UK postcode area, e.g. SW2',
				first_name,
				email,
				postcode
			});
		}

		try {
			const response = await backendFetch(`/api/v1/newsletter/subscribe`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ first_name, email, postcode })
			});

			const result = await response.json();

			if (!response.ok) {
				return fail(400, {
					error: formatError(result.detail),
					first_name,
					email,
					postcode
				});
			}

			return {
				success: true,
				...result
			};
		} catch (error) {
			logger.error('Newsletter subscription request failed');
			return fail(500, {
				error: 'Server error occurred',
				first_name,
				email,
				postcode
			});
		}
	}
};
