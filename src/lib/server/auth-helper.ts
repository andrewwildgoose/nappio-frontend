import { redirect } from '@sveltejs/kit';
import type { RequestEvent } from '@sveltejs/kit';

export async function requireAuth(event: RequestEvent) {
    if (!event.locals.session) {
        throw redirect(303, '/signin');
    }
    return event.locals.session;
}

export async function requireUnauth(event: RequestEvent) {
    if (event.locals.session) {
        throw redirect(303, '/dashboard');
    }
}