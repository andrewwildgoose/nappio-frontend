import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
    if (!locals.session) {
        throw redirect(303, '/signin');
    }

    const userData = {
        id: locals.user?.id,
        email: locals.user?.email,
        first_name: locals.user?.user_metadata?.first_name,
        surname: locals.user?.user_metadata?.surname,
        postcode: locals.user?.user_metadata?.postcode,
        email_verified: locals.user?.email_confirmed_at ? true : false
    };

    return {
        user: userData
    };
};