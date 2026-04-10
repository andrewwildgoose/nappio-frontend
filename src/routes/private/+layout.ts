import type { LayoutLoad } from './$types';
import { createSupabaseBrowserClient } from '$lib/client/supabaseClient';

export const load: LayoutLoad = async ({ fetch }) => {
	const supabase = createSupabaseBrowserClient(fetch);

	const {
		data: { session }
	} = await supabase.auth.getSession();
	const {
		data: { user }
	} = await supabase.auth.getUser();

	return {
		session,
		user
	};
};
