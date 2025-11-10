<script lang="ts">
	import AuthForm from '$lib/components/AuthForm.svelte';
	import { onMount } from 'svelte';

	// Automatically trigger forgot password mode
	onMount(() => {
		// You can add any additional logic here if needed
	});
</script>

<svelte:head>
	<title>Reset Password - Nappio</title>
	<meta name="description" content="Reset your Nappio account password" />
</svelte:head>

<div class="flex min-h-screen items-center justify-center bg-background p-4">
	<AuthForm />
</div>
