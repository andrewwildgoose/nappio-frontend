import { json } from '@sveltejs/kit';
import { BACKEND_API_URL } from '$env/static/private';
import type { RequestHandler } from './$types';
import { logger } from '$lib/logger';

export const GET: RequestHandler = async ({ request, locals: { supabase } }) => {
    try {
        const response = await fetch(`${BACKEND_API_URL}/api/v1/service/service-areas`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
        });

        const data = await response.json();

        logger.info('Fetched service areas successfully', { status: response.status, data: data });

        if (!response.ok) {
            throw new Error(data.error || 'Failed to fetch service areas');
        }

        return json(data);
    } catch (error) {
        logger.error('Fetching service areas failed', { status: 500 });
        return json({ error: 'Failed to fetch service areas' }, { status: 500 });
    }
};
