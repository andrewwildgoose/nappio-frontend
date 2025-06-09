// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
import { SupabaseClient, User, Session } from '@supabase/supabase-js';
import type { Plan } from '$lib/types/plans';

declare global {
	namespace App {
		// interface Error {}

		interface Locals {
			user: User | null;
			session: Session | null;
			supabase: SupabaseClient
		}
        interface PageData {
            plans?: Plan[];
            error?: string | null;
			subscriptions?: SubscriptionDetailsResponse[];
			addresses?: AddressResponse[];
        }
		// interface PageState {}
		// interface Platform {}
	}
}

export {};
