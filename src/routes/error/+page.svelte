<script>
	import { page } from '$app/state'; // Import the page object to access query parameters
	import { Button } from 'flowbite-svelte';
	import { ArrowRightOutline } from 'flowbite-svelte-icons';

	// Extract the error message from the query parameters
	const errorMessage = decodeURIComponent(
		page.url.searchParams.get('message') || 'An unexpected error occurred'
	);
	const email = decodeURIComponent(page.url.searchParams.get('email') || ''); // Extract the email if needed
</script>

<div class="flex h-screen flex-col items-center justify-center p-5">
	<div
		class="bg-accent text-text-colour font-commissioner flex flex-col items-center justify-center p-8 text-center"
	>
		<h1 class="font-commissioner mb-4 text-3xl">Subscription Failed</h1>
		<p>{email}</p>
		<p class="text-lg">{errorMessage}</p>
		<div class="mt-8">
			<Button
				href="/"
				class="bg-tertiary! hover:bg-text-colour! text-text-colour! hover:text-tertiary! font-commissioner rounded-none text-3xl transition-colors duration-200"
				size="lg"
			>
				Go to Homepage <ArrowRightOutline class="ms-2 h-8 w-8" />
			</Button>
		</div>
	</div>
</div>
