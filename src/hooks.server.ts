import { createClient } from '@supabase/supabase-js'
import type { Handle } from '@sveltejs/kit';
import { SUPABASE_URL, SUPABASE_KEY } from '$env/static/private';

// Initialize Supabase client
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

// Handle function runs on every request to the server
export const handle: Handle = async ({ event, resolve }) => {
    // Get the current user session from Supabase
    const session = await supabase.auth.getSession();
    
    // Add the user object to event.locals for use throughout the app
    // If no session exists, user will be null
    event.locals.user = session.data.session?.user || null;

    // Continue with the request and get the response
    const response = await resolve(event);

	return response;
};
