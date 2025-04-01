import { fail, redirect } from '@sveltejs/kit';
import { BACKEND_API_URL } from '$env/static/private';

export const actions = {
    subscribe: async ({ request }) => {
        const data = await request.formData();
        const first_name = data.get('first_name');
        const email = data.get('email');
        const postcode = data.get('postcode');

        try {
            const response = await fetch(`${BACKEND_API_URL}/newsletter/subscribe`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ first_name, email, postcode: postcode ? postcode.toUpperCase() : '' }),
            });

            const result = await response.json();

            // Handle successful subscription
            if (response.ok) {
                console.log('Subscription successful:', result);
                return { success: true, status: 303, location: '/success' };
            }

            // Handle expected errors (validation, duplicate email, etc.)
            console.log('Error from backend:', result.detail);
            let errorMessage;
            
            if (typeof result.detail === 'string') {
                errorMessage = result.detail;
            } else if (Array.isArray(result.detail)) {
                errorMessage = result.detail.map((err) => err.msg).join(', ');
            } else {
                errorMessage = 'An unknown error occurred';
            }

            return fail(response.status, {
                error: errorMessage,
                first_name,
                email,
                postcode,
            });

        } catch (error) {
            console.error('Unexpected error:', error);
            throw redirect(303, '/error');
        }
    },
};