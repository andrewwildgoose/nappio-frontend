<script lang="ts">
	import ChangePasswordForm from '$lib/components/ChangePasswordForm.svelte';
	import { Spinner, Alert } from 'flowbite-svelte';
	import { onMount } from 'svelte';
	import { supabase } from '$lib/client/supabaseClient';
	import { goto } from '$app/navigation';
	import { logger } from '$lib/logger';

	let isLoading = $state(true);
	let isAuthenticated = $state(false);
	let error = $state('');

	onMount(async () => {
		// Complete the URL/code -> session exchange (uses cookie if PKCE)
		try {
			// Exchange the code from the URL for a session
			const { data, error } = await supabase.auth.exchangeCodeForSession(window.location.hash);
			if (error) throw error;
		} catch (err: any) {
			// Not fatal if there's no code in URL
			logger.warn('Code exchange skipped', { reason: err?.message ?? 'no code in URL' });
		}

		// Now check current session / user
		const { data, error: sessionErr } = await supabase.auth.getSession();
		
		if (sessionErr) {
			logger.error('Failed to retrieve auth session');
			error = 'Failed to read auth session. Please request a new password reset link.';
			isLoading = false;
			setTimeout(() => goto('/auth'), 3000);
			return;
		}

		if (!data.session) {
			// Not signed in — show an appropriate message
			logger.error('No active session found for password update');
			error = 'No active session found. The reset link may be expired or invalid.';
			isLoading = false;
			setTimeout(() => goto('/auth'), 3000);
			return;
		}

		isAuthenticated = true;
		isLoading = false;
	});
</script>

<svelte:head>
	<title>Update Password - Nappio</title>
	<meta name="description" content="Update your Nappio account password" />
</svelte:head>

<div class="flex min-h-screen items-center justify-center bg-background p-4">
	{#if isLoading}
		<div class="flex flex-col items-center space-y-4">
			<Spinner size="12" />
			<p class="text-text-colour font-commissioner text-xl">Verifying your identity...</p>
		</div>
	{:else if error}
		<div class="bg-background/50 mx-auto flex w-full max-w-md flex-col space-y-4 p-5 shadow-sm md:p-8">
			<Alert color="dark" rounded={false} class="bg-primary! mb-4 flex justify-center">
				{error}
			</Alert>
			<p class="text-center text-text-colour">Redirecting you back to sign in...</p>
		</div>
	{:else if isAuthenticated}
		<ChangePasswordForm />
	{/if}
</div>
