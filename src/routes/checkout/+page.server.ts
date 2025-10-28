import { error, redirect, fail } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import { BACKEND_API_URL } from '$env/static/private';

export const load: PageServerLoad = async ({ url, parent }) => {
    console.log('Checkout page load function called, URL:', url.toString());
    // Extract subscription_id from query parameters
    const subscriptionId = url.searchParams.get('subscription_id');

    if (!subscriptionId) {
        throw error(400, 'Missing subscription_id parameter');
    }

    // Get the user session for authentication
    console.log('Fetching user session for authentication');
    const { session } = await parent();

    // If user is not signed in, redirect to signin with return URL
    if (!session || !session.access_token) {
        const returnUrl = `/checkout?subscription_id=${subscriptionId}`;
        throw redirect(303, `/auth?redirect=${encodeURIComponent(returnUrl)}`);
    }

    const jwt = session.access_token;

    let checkoutData;
    
    try {
        // Call your backend API to create checkout session for the subscription
        const requestUrl = `${BACKEND_API_URL}/api/v1/create-checkout-from-subscription`;
        const requestBody = { id: subscriptionId };
        const requestHeaders = {
            'Authorization': `Bearer ${jwt}`,
            'Content-Type': 'application/json'
        };
        
        console.log('Making checkout request:', {
            url: requestUrl,
            headers: requestHeaders,
            body: requestBody
        });
        
        const response = await fetch(requestUrl, {
            method: 'POST',
            headers: requestHeaders,
            body: JSON.stringify(requestBody)
        });

        const data = await response.json();

        console.log('Checkout creation response:', data);

        if (!response.ok) {
            console.error('Checkout creation error:', data);
            throw error(response.status, data.error || 'Failed to create checkout session');
        }

        checkoutData = data;
        
    } catch (err) {
        console.error('Error creating checkout session:', err);
        
        // If it's already a redirect or error, re-throw it
        if (err instanceof Response) {
            throw err;
        }
        
        // Otherwise, throw a generic error
        throw error(500, 'Failed to process checkout request');
    }

    // Handle redirect outside try-catch
    if (checkoutData.checkout_url) {
        console.log('Redirecting to checkout URL:', checkoutData.checkout_url);
        throw redirect(302, checkoutData.checkout_url);
    }

    // If no checkout URL, throw an error
    throw error(500, 'No checkout URL received from server');
};
