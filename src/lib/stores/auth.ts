import { writable, type Writable } from 'svelte/store';
import type { User } from '@supabase/supabase-js';
import { supabase } from '$lib/client/supabaseClient';

interface UserData {
    id: string;
    email?: string;
    first_name?: string;
    surname?: string;
    postcode?: string;
    email_verified?: boolean;
}

const logWithTime = (message: string, data?: any) => {
    console.log(`[${new Date().toISOString()}] Auth Store: ${message}`, 
        data ? JSON.stringify(data, null, 2) : '');
};

export const user: Writable<UserData | null> = writable(null);
let authSubscription: { subscription: { unsubscribe: () => void } } | null = null;
let authPromise: Promise<void> | null = null;

// Handle user sign in
export async function handleSignIn(supabaseUser: User) {
    logWithTime('Starting sign in process', { userId: supabaseUser.id });
    
    const userData: UserData = {
        id: supabaseUser.id,
        email: supabaseUser.email,
        first_name: supabaseUser.user_metadata?.first_name,
        surname: supabaseUser.user_metadata?.surname,
        postcode: supabaseUser.user_metadata?.postcode,
        email_verified: supabaseUser.email_confirmed_at ? true : false
    };

    logWithTime('Setting user data', userData);
    user.set(userData);
    logWithTime('Sign in complete');
}

// Handle user sign out
export async function handleSignOut() {
    logWithTime('Starting sign out process');
    try {
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
        
        logWithTime('Clearing user store');
        user.set(null);
        logWithTime('Sign out complete');
    } catch (error) {
        logWithTime('Sign out error', { error });
        throw error;
    }
}

// Initialize auth state and return a promise that resolves when complete
async function initializeAuth() {
    if (authPromise) return authPromise;
    
    authPromise = (async () => {
        logWithTime('Starting auth initialization');
        
        try {
            // First, set up auth state listener
            if (!authSubscription) {
                logWithTime('Setting up auth state listener');
                const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
                    logWithTime('Auth state changed', { 
                        event, 
                        hasSession: !!session,
                        userId: session?.user?.id 
                    });

                    switch (event) {
                        case 'SIGNED_IN':
                            logWithTime('Sign in detected');
                            if (session?.user) await handleSignIn(session.user);
                            break;
                        case 'SIGNED_OUT':
                            logWithTime('Sign out detected');
                            user.set(null);
                            break;
                        case 'USER_UPDATED':
                            logWithTime('User update detected');
                            if (session?.user) await handleSignIn(session.user);
                            break;
                        case 'INITIAL_SESSION':
                            logWithTime('Initial session detected');
                            if (session?.user) await handleSignIn(session.user);
                            else user.set(null);
                            break;
                    }
                });
                authSubscription = { subscription };
            }

            // Then check current session
            const { data: { session }, error } = await supabase.auth.getSession();
            
            if (error) {
                logWithTime('Session error:', error);
                user.set(null);
                return;
            }

            logWithTime('Initial session check complete', { 
                hasSession: !!session,
                userId: session?.user?.id
            });

            if (session?.user) {
                await handleSignIn(session.user);
            } else {
                user.set(null);
            }

        } catch (error) {
            logWithTime('Auth initialization error:', error);
            user.set(null);
        }
    })();

    return authPromise;
}

export function cleanup() {
    logWithTime('Cleaning up auth subscription');
    if (authSubscription) {
        authSubscription.subscription.unsubscribe();
        authSubscription = null;
    }
    authPromise = null;
}

// Initialize auth when module loads
initializeAuth();

// Cleanup handlers
if (typeof window !== 'undefined') {
    window.addEventListener('beforeunload', cleanup);
}

if (import.meta.hot) {
    import.meta.hot.dispose(cleanup);
}