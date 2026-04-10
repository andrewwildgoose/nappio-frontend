<script>
	import AuthForm from '$lib/components/AuthForm.svelte';
	import { replaceState } from '$app/navigation';
	import { onMount } from 'svelte';

	onMount(() => {
		if (window.location.hash) {
			replaceState('', window.location.pathname + window.location.search);
		}
	});
</script>

<svelte:head>
	<title>Sign up or sign in - Nappio</title>
	<meta name="description" content="Sign up or sign in to your Nappio account" />
</svelte:head>


<div class="flex min-h-dvh flex-col items-center justify-start">
	<div class="h-full w-full items-center justify-center p-10">
		<AuthForm />
	</div>
</div>
