import { json } from '@sveltejs/kit';
import { BACKEND_API_URL } from '$env/static/private';
import type { RequestHandler } from './$types';
import { error } from '@sveltejs/kit';
import { logger } from '$lib/logger';

export const POST: RequestHandler = async ({ request, locals }) => {
	if (!locals.user) {
		throw error(401, 'Unauthorized');
	}

	try {
		const body = await request.json() as { voucherCode: string };
		const { voucherCode } = body;

		const { session } = await locals.safeGetSession();
		const jwt = session?.access_token;

		// Call backend to validate the voucher code
		const response = await fetch(`${BACKEND_API_URL}/api/v1/vouchers/validate`, {
			method: 'POST',
			headers: {
				Authorization: `Bearer ${jwt}`,
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ voucherCode })
		});

		const data = await response.json();

		if (!response.ok) {
			throw new Error(data.error || 'Failed to validate voucher');
		}

		return json(data);
	} catch (error) {
		logger.error('Voucher validation failed', { status: 500 });
		return json({ error: 'Failed to validate voucher' }, { status: 500 });
	}
};
