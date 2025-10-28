<script lang="ts">
	import { Button } from 'flowbite-svelte';
	import { supabase } from '$lib/client/supabaseClient';
	import { goto } from '$app/navigation';

	let isSigningOut = false;

	async function handleSignOut() {
		isSigningOut = true;
		const { error } = await supabase.auth.signOut();

		if (error) {
			console.error('Sign out error:', error);
		}

		await goto('/auth');
		isSigningOut = false;
	}
</script>

<Button
	on:click={handleSignOut}
	disabled={isSigningOut}
	class="bg-tertiary! hover:bg-accent! text-text-colour font-ranchers rounded-none border-none text-xl transition-colors duration-200"
>
	{isSigningOut ? 'Signing out...' : 'Sign Out'}
</Button>
