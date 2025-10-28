// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
import type { Plan } from '$lib/types/plans';

declare global {
	namespace App {
		// interface Error {}

		interface Locals {
			// Locals no longer needed for auth
		}
        interface PageData {
            plans?: Plan[]
            error?: string | null
			subscriptions?: SubscriptionDetailsResponse[]
			addresses?: AddressResponse[]
        }
		// interface PageState {}
		// interface Platform {}
	}
}

export {};
