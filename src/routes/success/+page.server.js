/** @type {import('./$types').PageServerLoad} */
export async function load({ url }) {
    console.log('Full URL:', url.href); // Log the full URL
    console.log('Email Query Parameter:', url.searchParams.get('email')); // Log the email query parameter
    const email = url.searchParams.get('email');

    return {
        email
    };
}