// This file is used to handle server-side logic in a SvelteKit application.
import type { Handle } from '@sveltejs/kit';
import { supabase } from "$lib/server/supabaseClient";

export const handle: Handle = async ({ event, resolve }) => {
    try {
        const { data: { session }, error } = await supabase.auth.getSession();

        if (error) {
            console.error('[Server] Session error:', error);
            event.locals.session = null;
            event.locals.user = null;
        } else {
            console.log('[Server] Session status:', {
                hasSession: !!session,
                userId: session?.user?.id
            });
            event.locals.session = session;
            event.locals.user = session?.user || null;
        }

        event.locals.supabase = supabase;
        const response = await resolve(event);
        return response;
    } catch (error) {
        console.error('[Server] Unexpected auth error:', error);
        return await resolve(event);
    }
};