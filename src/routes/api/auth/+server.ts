import { json, redirect, type RequestHandler } from '@sveltejs/kit';
import { supabase } from "$lib/server/supabaseClient";

export const POST: RequestHandler = async ({ request, url }) => {
    console.log('Received request:', request);
    const { email, password, action } = await request.json();
    console.log('Received action:', action);
    console.log('Received request:', request.body);

    if (!action) {
        return json({ error: 'Action is required' }, { status: 400 });
    }

    let response;
    if (action === 'signup') {
        response = await supabase.auth.signUp({
            email,
            password,
            options: {
                emailRedirectTo: `${url.origin}/auth/callback`
            }
        });
    } else if (action === 'login') {
        response = await supabase.auth.signInWithPassword({ email, password });
    } else if (action === 'signout') {
        console.log('Signing out user...');
        const { error } = await supabase.auth.signOut();
        if (error) {
            return json({ error: error.message }, { status: 400 });
        }
        return json({ success: true });
    } else {
        return json({ error: 'Invalid action' }, { status: 400 });
    }

    if (!response) {
        return json({ error: 'Invalid response from auth service' }, { status: 500 });
    }

    if (response.error) {
        return json({ error: response.error.message }, { status: 400 });
    }

    return json({ user: response.data.user });
};
