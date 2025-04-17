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

export const user: Writable<UserData | null> = writable(null);

// Initialize the store with the current session
supabase.auth.getSession().then(({ data: { session } }) => {
    if (session?.user) {
        updateUserStore(session.user);
    }
});

// Listen for auth state changes
supabase.auth.onAuthStateChange((_event, session) => {
    updateUserStore(session?.user ?? null);
});

export function updateUserStore(supabaseUser: User | null) {
    if (!supabaseUser) {
        user.set(null);
        return;
    }

    const userData: UserData = {
        id: supabaseUser.id,
        email: supabaseUser.email,
        first_name: supabaseUser.user_metadata?.first_name,
        surname: supabaseUser.user_metadata?.surname,
        postcode: supabaseUser.user_metadata?.postcode,
        email_verified: supabaseUser.email_confirmed_at ? true : false
    };

    user.set(userData);
}