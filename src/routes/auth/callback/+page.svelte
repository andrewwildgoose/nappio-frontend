<script lang="ts">
    import { Spinner } from 'flowbite-svelte';
    import { onMount } from 'svelte';
    import { supabase } from '$lib/client/supabaseClient';
    import { goto } from '$app/navigation';

    onMount(async () => {
        // Get the auth code from URL
        const params = new URLSearchParams(window.location.search);
        const code = params.get('code');

        if (code) {
            const { error } = await supabase.auth.exchangeCodeForSession(code);
            
            if (error) {
                console.error('Auth callback error:', error);
                await goto('/auth?error=auth_callback_failed');
                return;
            }
        }

        // Redirect to dashboard
        await goto('/private/dashboard');
    });
</script>

<div class="flex items-center justify-center min-h-screen">
    <Spinner size="12" />
</div>