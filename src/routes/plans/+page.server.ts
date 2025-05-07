import type { PageServerLoad } from './$types';
import { supabase } from '$lib/server/supabaseClient';

export const load: PageServerLoad = async () => {
    const { data: subscription_plans, error } = await supabase
        .from('subscription_plans')
        .select('*')
        .eq('active', true)
        .order('sort_order');

    if (error) {
        console.log('Error fetching subscription plans:', error.message);
        return {
            plans: [],
            error: error.message
        };
    }

    return {
        plans: subscription_plans || []
    };
};