import { fail } from '@sveltejs/kit';
import { BACKEND_API_URL } from '$env/static/private';

/** @type {import('./$types').PageServerLoad} */
export async function load({ url }) {
    console.log('Full URL:', url.href); // Log the full URL
    console.log('Email Query Parameter:', url.searchParams.get('email')); // Log the email query parameter
    const email = url.searchParams.get('email');

    if (!email) {
        return fail(400, { error: 'Email parameter is missing.' });
    }

    try {
        console.log(JSON.stringify({ email }))
        const response = await fetch(`${BACKEND_API_URL}/api/v1/newsletter/verify`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email }),
        });

        const result = await response.json();
        console.log('result', result);

        if (!response.ok) {
            return fail(response.status, { error: result.detail || 'Verification failed.' });
        }

        console.log('Returning from load:', { email, message: result.message });

        return {
            email: email,
            message: result.message,
        };
    } catch (error) {
        console.error('Error verifying email:', error);
        return fail(500, { error: 'An unexpected error occurred while verifying the email.' });
    }
}