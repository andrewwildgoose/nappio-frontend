import type { LayoutLoad } from './$types';
import { supabase } from '$lib/client/supabaseClient';

export const load: LayoutLoad = async () => {
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
