import { fail, redirect } from '@sveltejs/kit';
import type { RequestEvent } from '@sveltejs/kit';
import type { Session } from '@supabase/supabase-js';

export async function requireAuth(event: RequestEvent): Promise<Session> {
    const session = event.locals.session;
    if (!session) {
        throw redirect(303, '/auth');
    }
    return session;
}

export async function requireUnauth(event: RequestEvent): Promise<void> {
    if (event.locals.session) {
        throw redirect(303, '/private/dashboard');
    }
}

export async function handleServerSignOut(event: RequestEvent) {
    // Supabase SSR handles cookies automatically
    await event.locals.supabase.auth.signOut();
    return { success: true };
}

export async function handleServerSignIn({ 
    email, 
    password, 
    supabase 
}: { 
    email: string; 
    password: string; 
    supabase: RequestEvent['locals']['supabase'];
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

    // Cookies are automatically handled by @supabase/ssr
    return {
        success: true,
        message: 'Successfully signed in'
    };
}

