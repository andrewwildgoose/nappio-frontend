<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/state';

	let loading = true;
	let error = '';
	let subscriptionId = '';

	onMount(() => {
		subscriptionId = page.url.searchParams.get('subscription_id') || '';

		// If we reach this point, it means the server-side redirect didn't work
		// We can implement a client-side fallback here if needed
		const timer = setTimeout(() => {
			error = 'Checkout session creation is taking longer than expected. Please try again.';
			loading = false;
		}, 10000); // 10 second timeout

		return () => clearTimeout(timer);
	});
</script>

<svelte:head>
	<title>Building Checkout - Nappio</title>
	<meta name="description" content="Creating your checkout session..." />
</svelte:head>

<div
	class="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4"
>
	<div class="w-full max-w-md">
		<div class="rounded-2xl bg-white p-8 text-center shadow-xl">
			{#if loading && !error}
				<!-- Loading State -->
				<div class="mb-6">
					<div
						class="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-blue-100"
					>
						<div class="h-8 w-8 animate-spin rounded-full border-b-2 border-blue-600"></div>
					</div>
					<h1 class="mb-2 text-2xl font-bold text-gray-900">Building Your Checkout</h1>
					<p class="text-gray-600">
						Please wait while we prepare your subscription checkout session...
					</p>
					{#if subscriptionId}
						<p class="mt-2 text-sm text-gray-500">
							Subscription: {subscriptionId}
						</p>
					{/if}
				</div>

				<!-- Progress Dots -->
				<div class="flex justify-center space-x-2">
					<div class="h-2 w-2 animate-bounce rounded-full bg-blue-600"></div>
					<div
						class="h-2 w-2 animate-bounce rounded-full bg-blue-600"
						style="animation-delay: 0.1s"
					></div>
					<div
						class="h-2 w-2 animate-bounce rounded-full bg-blue-600"
						style="animation-delay: 0.2s"
					></div>
				</div>
			{:else}
				<!-- Error State -->
				<div class="mb-6">
					<div
						class="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-red-100"
					>
						<svg class="h-8 w-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
							></path>
						</svg>
					</div>
					<h1 class="mb-2 text-2xl font-bold text-gray-900">Something Went Wrong</h1>
					<p class="mb-6 text-gray-600">{error}</p>

					<div class="space-y-3">
						<button
							class="w-full rounded-lg bg-blue-600 px-6 py-3 font-medium text-white transition-colors duration-200 hover:bg-blue-700"
							on:click={() => window.location.reload()}
						>
							Try Again
						</button>
						<a
							href="/subscribe"
							class="block w-full rounded-lg bg-gray-100 px-6 py-3 font-medium text-gray-700 transition-colors duration-200 hover:bg-gray-200"
						>
							Back to Plans
						</a>
					</div>
				</div>
			{/if}
		</div>
	</div>
</div>

<style>
	.animate-bounce {
		animation: bounce 1s infinite;
	}

	@keyframes bounce {
		0%,
		20%,
		53%,
		80%,
		100% {
			transform: translateY(0);
		}
		40%,
		43% {
			transform: translateY(-8px);
		}
		70% {
			transform: translateY(-4px);
		}
		90% {
			transform: translateY(-2px);
		}
	}
</style>
