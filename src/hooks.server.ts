// This file is used to handle server-side logic in a SvelteKit application.
import type { Handle } from '@sveltejs/kit';
import { supabase } from "$lib/server/supabaseClient";
import { updateUserStore } from '$lib/stores/auth';

export const handle: Handle = async ({ event, resolve }) => {
    const { data: { session }, error } = await supabase.auth.getSession();

    if (error) {
        console.error('Session error:', error);
    }

    // Make session and user available to all routes
    event.locals.session = session;
    event.locals.user = session?.user || null;

    event.locals.supabase = supabase;

    // Update the user store if we have a session
    if (session?.user) {
        updateUserStore(session.user);
    }

    const response = await resolve(event);
    return response;
};