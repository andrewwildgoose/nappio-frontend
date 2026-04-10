<script lang="ts">
    import { Spinner } from 'flowbite-svelte';
    import { onMount } from 'svelte';
    import { goto } from '$app/navigation';
    import { supabase } from '$lib/client/supabaseClient';
    import { logger } from '$lib/logger';

    let errorMessage = $state('');

    onMount(async () => {
        const searchParams = new URLSearchParams(window.location.search);
        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        
        const error = searchParams.get('error') || hashParams.get('error');
        const errorDescription = searchParams.get('error_description') || hashParams.get('error_description');

        if (error) {
            logger.error('Authentication error during callback');
            errorMessage = errorDescription || error;
            setTimeout(() => goto(`/?error=${encodeURIComponent(error)}`), 3000);
            return;
        }

        // Check if there's a code (PKCE) or access_token (implicit)
        const code = searchParams.get('code');
        const accessToken = hashParams.get('access_token');
        
        if (code || accessToken) {
            // Wait a moment for Supabase to process the callback and set session
            // detectSessionInUrl handles this automatically
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            // Check if we have a session now
            const { data: { session } } = await supabase.auth.getSession();
            
            if (session) {
                await goto('/private/dashboard');
                return;
            }
            
            // No session after waiting
            logger.error('No session established after auth callback');
            errorMessage = 'Authentication failed. Please try again.';
            setTimeout(() => goto('/auth'), 3000);
            return;
        }

        // No valid params
        logger.error('Auth callback received with no valid parameters');
        errorMessage = 'Invalid confirmation link';
        setTimeout(() => goto('/?error=invalid_callback'), 3000);
    });
</script>

<div class="flex min-h-screen flex-col items-center justify-center">
    <Spinner size="12" />
    <p class="mt-4 text-lg">
        {errorMessage || 'Confirming your email...'}
    </p>
    {#if errorMessage}
        <p class="mt-2 text-sm text-gray-600">Redirecting...</p>
    {/if}
</div>