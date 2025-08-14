import { fail, redirect } from '@sveltejs/kit';
import type { Cookies, RequestEvent } from '@sveltejs/kit';
import type { Session } from '@supabase/supabase-js';
import { supabase } from './supabaseClient';

export async function requireAuth(event: RequestEvent): Promise<Session> {
    const session = event.locals.session;
    if (!session) {
        throw redirect(303, '/signin');
    }
    return session;
}

export async function requireUnauth(event: RequestEvent): Promise<void> {
    if (event.locals.session) {
        throw redirect(303, '/dashboard');
    }
}

export async function handleServerSignOut(cookies: Cookies) {
    // Clear server-side session
    await supabase.auth.signOut();
    
    // Clear auth cookies
    cookies.delete('sb-access-token', { path: '/' });
    cookies.delete('sb-refresh-token', { path: '/' });

    return { success: true };
}

export async function handleServerSignIn({ email, password, cookies }: { 
    email: string; 
    password: string; 
    cookies: Cookies;
}) {
    if (!email || !password) {
        return fail(400, { error: 'Missing email or password' });
    }

    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password
    });

    if (authError) {
        return fail(400, { error: authError.message });
    }

    // Set auth cookies
    const { access_token, refresh_token } = authData.session;
    cookies.set('sb-access-token', access_token, {
        path: '/',
        maxAge: 60 * 60 * 24 * 7,
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true
    });

    cookies.set('sb-refresh-token', refresh_token, {
        path: '/',
        maxAge: 60 * 60 * 24 * 7,
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true
    });

    return {
        success: true,
        message: 'Successfully signed in'
    };
}