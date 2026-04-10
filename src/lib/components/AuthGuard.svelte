<script lang="ts">
	import { user, loading } from '$lib/stores/auth';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import { Spinner } from 'flowbite-svelte';

	let { children } = $props();

	onMount(() => {
		// Wait for auth to load, then check if user is authenticated
		const unsubscribe = loading.subscribe((isLoading) => {
			if (!isLoading && !$user) {
				goto('/auth');
			}
		});

		return unsubscribe;
	});
</script>

{#if $loading}
	<div class="flex min-h-screen items-center justify-center">
		<Spinner size="12" />
	</div>
{:else if $user}
	{@render children()}
{/if}
