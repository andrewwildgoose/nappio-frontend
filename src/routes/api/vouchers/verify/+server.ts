import { json } from '@sveltejs/kit';
import { BACKEND_API_URL } from '$env/static/private';
import type { RequestHandler } from './$types';
import { logger } from '$lib/logger';
import { getSessionFromCookies } from '$lib/server/supabase';


export const POST: RequestHandler = async ({ request, cookies }) => {
	const { user, session } = await getSessionFromCookies(cookies);

	if (!user) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}

	try {
		const { voucherCode, postcode } = await request.json();

		if (!voucherCode || !postcode) {
			return json({ error: 'Voucher code and postcode are required' }, { status: 400 });
		}

		const jwt = session?.access_token;

		if (!jwt) {
			return json({ error: 'No valid session' }, { status: 401 });
		}

		const response = await fetch(`${BACKEND_API_URL}/api/v1/vouchers/verify`, {
			method: 'POST',
			headers: {
				Authorization: 'Bearer ' + jwt,
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				voucher_code: voucherCode,
				postcode
			})
		});

		const data = await response.json();

		console.log('Voucher verification response:', data);

		return json(data, { status: response.status });
	} catch {
		logger.error('Voucher verification failed');
		return json({ error: 'Failed to verify voucher' }, { status: 500 });
	}
};
