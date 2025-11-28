<script lang="ts">
	import type { PageData } from './$types';
	import { Button } from 'flowbite-svelte';
	import { slide } from 'svelte/transition';
	import { cubicInOut } from 'svelte/easing';
	// import { enhance } from '$app/forms';
	// import { goto } from '$app/navigation';
	import SignOutForm from '$lib/components/SignOutForm.svelte';
	import AddressForm from '$lib/components/AddressForm.svelte';
	import DashboardSubscription from '$lib/components/DashboardSubscription.svelte';

	export let data: PageData;
	let showAddressForm = false;
	let isAddressesExpanded = false;
	let isSubscriptionsExpanded = false;

	let selectedAddress: (typeof data.addresses)[0] | null = null;

	function handleAddressDelete(address: (typeof data.addresses)[0]) {
		// Create and submit form programmatically
		const form = document.createElement('form');
		form.method = 'POST';
		form.action = '?/addressDelete';

		const actionInput = document.createElement('input');
		actionInput.type = 'hidden';
		actionInput.name = 'action';
		actionInput.value = 'delete';

		const idInput = document.createElement('input');
		idInput.type = 'hidden';
		idInput.name = 'id';
		idInput.value = address.id;

		form.appendChild(actionInput);
		form.appendChild(idInput);
		document.body.appendChild(form);
		form.submit();
		document.body.removeChild(form);
	}

	// Helper function to format date
	function formatDate(dateString: string) {
		return new Date(dateString).toLocaleDateString('en-GB');
	}
</script>

<svelte:head>
	<title>Dashboard - Nappio</title>
	<meta name="description" content="Your Nappio account dashboard" />
</svelte:head>


<div class="justify-top flex min-h-screen flex-col items-center p-4">
	<div class="bg-background w-full max-w-2xl border p-8 shadow-lg">
		<h1 class="font-ranchers mb-6 text-3xl">Welcome, {data.user.first_name}!</h1>
		<div class="space-y-4">
			<div class="border-b pb-4">
				<h2 class="font-commissioner mb-2 text-xl">Your Profile</h2>
				<p><strong>Email:</strong> {data.user.email}</p>
				<p><strong>Name:</strong> {data.user.first_name} {data.user.surname}</p>
				<!-- <p><strong>Postcode:</strong> {data.user.postcode}</p> -->
			</div>
			<!-- Add address section here -->
			<div class="mt-4 border-b">
				<div class="mb-4">
					<button
						type="button"
						class="flex w-full items-center justify-between"
						onclick={() => (isAddressesExpanded = !isAddressesExpanded)}
						onkeydown={(e) => e.key === 'Enter' && (isAddressesExpanded = !isAddressesExpanded)}
						aria-expanded={isAddressesExpanded}
					>
						<strong class="font-commissioner mb-2 text-xl">Addresses</strong>
						<i
							class={isAddressesExpanded ? 'fa-solid fa-minus fa-lg' : 'fa-solid fa-plus fa-lg'}
							style="color: #262625;"
						></i>
					</button>
					{#if isAddressesExpanded}
						<div transition:slide={{ duration: 500, easing: cubicInOut }}>
							<div class="mt-4 flex justify-end">
								<Button
									color="light"
									class="bg-tertiary! hover:bg-accent! text-text-colour! font-ranchers text-l rounded-none border-none transition-colors duration-200"
									onclick={() => {
										selectedAddress = null;
										showAddressForm = !showAddressForm;
									}}
								>
									{showAddressForm ? 'Cancel' : 'Add New Address'}
								</Button>
							</div>
							{#if showAddressForm}
								<div class="mt-4">
									<AddressForm action="?/submitAddress" initialAddress={selectedAddress} />
								</div>
							{/if}
							{#if data.addresses && data.addresses.length > 0}
								<div class="mt-2 space-y-4">
									{#each data.addresses as address}
										<div class="bg-background border p-4 shadow-sm">
											<div class="flex justify-between">
												<div>
													<p>{address.address_line_1}</p>
													{#if address.address_line_2}
														<p>{address.address_line_2}</p>
													{/if}
													<p>{address.city}</p>
													<p>{address.country}</p>
													<p>{address.postcode}</p>
													{#if address.address_notes}
														<p class="mt-2 text-sm italic">{address.address_notes}</p>
													{/if}
												</div>
												<Button
													color="light"
													class="bg-accent! hover:bg-tertiary! text-text-colour! font-commissioner text-l h-fit rounded-none border-none transition-colors duration-200"
													onclick={() => handleAddressDelete(address)}
												>
													Delete
												</Button>
											</div>
										</div>
									{/each}
								</div>
							{:else}
								<p class="text-gray-600">No address added</p>
							{/if}
						</div>
					{/if}
				</div>
			</div>

			<div class="border-b pb-4">
				<button
					type="button"
					class="flex w-full items-center justify-between"
					onclick={() => (isSubscriptionsExpanded = !isSubscriptionsExpanded)}
					onkeydown={(e) =>
						e.key === 'Enter' && (isSubscriptionsExpanded = !isSubscriptionsExpanded)}
					aria-expanded={isSubscriptionsExpanded}
				>
					<strong class="font-commissioner mb-2 text-xl">Your Subscriptions</strong>
					<i
						class={isSubscriptionsExpanded ? 'fa-solid fa-minus fa-lg' : 'fa-solid fa-plus fa-lg'}
						style="color: #262625;"
					></i>
				</button>
				{#if isSubscriptionsExpanded}
					<div transition:slide={{ duration: 500, easing: cubicInOut }}>
						{#if data.subscriptions && data.subscriptions.length > 0}
							<div class="space-y-4">
								{#each data.subscriptions as subscription}
									<DashboardSubscription {subscription} addresses={data.addresses} />
								{/each}
							</div>
						{:else}
							<div class="py-4 text-center">
								<p class="mb-4 text-gray-600">You don't have any active subscriptions.</p>
								<Button
									href="/subscribe"
									class="bg-primary! hover:bg-tertiary! text-text-colour! font-commissioner text-l rounded-none transition-colors duration-200"
								>
									Start a subscription
								</Button>
							</div>
						{/if}
					</div>
				{/if}
			</div>

			<div class="flex flex-col items-center justify-between md:flex-row">
				<div class="flex-1 pb-4 text-center text-sm md:pb-0 md:text-left">
					<p>
						If you have any questions about our service, your subscription or billing please contact
						us on <a
							href="mailto:info@nappio.co.uk"
							class="text-accent!"
							onclick={(e) => {
								e.preventDefault();
								window.open('mailto:info@nappio.co.uk', '_blank');
							}}>info@nappio.co.uk</a
						>
					</p>
				</div>
				<div class="flex-none">
					<SignOutForm />
				</div>
			</div>
		</div>
	</div>
</div>
