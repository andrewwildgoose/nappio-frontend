import { writable } from 'svelte/store';
import type { User, Session } from '@supabase/supabase-js';

// Auth state stores
export const user = writable<User | null>(null);
export const session = writable<Session | null>(null);
export const loading = writable<boolean>(true);
