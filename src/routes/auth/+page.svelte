<script>
	import AuthForm from '$lib/components/AuthForm.svelte';
	import { onMount } from 'svelte';

	onMount(() => {
		if (window.location.hash) {
			history.replaceState(null, document.title, window.location.pathname + window.location.search);
		}
	});
</script>

<div class="flex min-h-dvh flex-col items-center justify-start">
	<div class="h-full w-full items-center justify-center p-10">
		<AuthForm />
	</div>
</div>
