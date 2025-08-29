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

// Initialize auth state
supabase.auth.onAuthStateChange((event, session) => {
    if (session?.user) {
        user.set({
            id: session.user.id,
            email: session.user.email,
            first_name: session.user.user_metadata?.first_name,
            surname: session.user.user_metadata?.surname,
            postcode: session.user.user_metadata?.postcode,
            email_verified: session.user.email_confirmed_at ? true : false
        });
        console.log('User data in auth store:', session.user);
    } else {
        user.set(null);
    }
});