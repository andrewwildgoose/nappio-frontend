<script lang="ts">
	import { Button } from 'flowbite-svelte';
	import { ArrowRightOutline } from 'flowbite-svelte-icons';

	// Define the type for `data`
	export let data: {
		email?: string;
		message?: string;
		error?: string;
	};
</script>

<div class="text-text-colour flex h-screen flex-col items-center justify-center">
	{#if data.error}
		<h1 class="font-commissioner mb-4 text-3xl">Verification Failed</h1>
		<p class="text-lg">{data.error}</p>
	{:else}
		<div class="flex flex-col items-center justify-center">
			<div class="bg-accent2 p-8 text-center shadow-sm">
				<h1 class="font-ranchers mb-4 text-4xl">Email Verified</h1>
				<p class="font-commissioner mt-4">
					Your email has been successfully verified: <strong>{data.email}</strong><br />You're now
					ready to stay updated and enjoy all the benefits of our service. Got questions? We're here
					to help!
				</p>
				<br />
				<a
					href="mailto:info@nappio.co.uk"
					class="text-text-colour font-commissioner hover:bg-text-colour hover:text-accent2 p-2 underline"
					>Contact us at info@nappio.co.uk</a
				>
			</div>
			<Button
				href="/"
				class="bg-tertiary text-text-colour hover:bg-text-colour hover:text-tertiary font-commissioner m-5 items-end rounded-none text-3xl shadow-sm"
			>
				Go to Homepage <ArrowRightOutline class="ms-2 h-8 w-8" />
			</Button>
		</div>
	{/if}
</div>
