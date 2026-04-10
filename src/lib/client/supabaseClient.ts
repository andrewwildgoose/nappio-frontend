import { createBrowserClient } from '@supabase/ssr';
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public';

export function createSupabaseBrowserClient(customFetch?: typeof fetch) {
	return createBrowserClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY, {
		global: customFetch ? { fetch: customFetch } : undefined,
		auth: {
			flowType: 'pkce',
			autoRefreshToken: true,
			persistSession: true,
			detectSessionInUrl: true
		}
	});
}

export const supabase = createSupabaseBrowserClient();