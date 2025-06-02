import { fail } from '@sveltejs/kit';
import { BACKEND_API_URL } from '$env/static/private';


export const actions = {
    subscribe: async ({ request }) => {
        const data = await request.formData();
        const first_name = data.get('first_name');
        const email = data.get('email');
        const postcode = data.get('postcode');

        try {
            const response = await fetch(`${BACKEND_API_URL}/api/v1/newsletter/subscribe`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ first_name, email, postcode: postcode ? postcode.toUpperCase() : '' })
            });

            const result = await response.json();
            
            console.log('result', result);

            if (!response.ok) {
                console.log('response', response);
                return fail(400, {
                    error: result.detail,
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
            console.log('error', error);
            return fail(500, {
                error: 'Server error occurred',
                first_name,
                email,
                postcode
            });
        }
    }
};