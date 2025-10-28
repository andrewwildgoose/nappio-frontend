<script lang="ts">
	import { page } from '$app/state';
	import { goto } from '$app/navigation';
	import { enhance, applyAction } from '$app/forms';
	import type { SubmitFunction } from '@sveltejs/kit';
	import { Button, Input, Label, Alert, Spinner, P } from 'flowbite-svelte';
	import SubscriptionAddress from './SubscriptionAddress.svelte';
	import type { AddressFormData } from '$lib/types/address';

	// Auth check
	let isSignedIn = $derived(page.data.user != null);

	console.log('User data in Subscription Flow:', page.data.user != null);

	// export let priceId: string;

	// Flow state management
	let currentStep = $state(0);
	let previousStepValue = $state(0);
	let isSubmitting = $state(false);
	let error = $state<string | null>(null);

	// Track direction for animation
	$effect(() => {
		previousStepValue = currentStep;
	});

	// Form data
	let babyBirthdate = $state('');
	let babyWeight = $state(0);
	let wantNappyWraps = $state(false);
	let address = $state<AddressFormData>({} as AddressFormData);

	// Valid service area postcodes
	const validPostcodes = ['SW2', 'SW4', 'SW8', 'SW9'];

	// Format and validate postcode
	function isValidServiceArea(postcode: string): boolean {
		if (!postcode) return false;
		const formattedPostcode = postcode.replace(/\s+/g, '').toUpperCase();
		return validPostcodes.some((validCode) =>
			formattedPostcode.startsWith(validCode.replace(/\s+/g, ''))
		);
	}

	// Step validation
	let canProceed = $derived<Record<number, boolean>>({
		0: isSignedIn, // Info step always valid
		1: isSignedIn && Boolean(babyBirthdate) && babyWeight > 0,
		2: isSignedIn, // Nappy wraps selection always valid
		3: isSignedIn && Boolean(address.postcode) && isValidServiceArea(address.postcode) // Check if postcode is in service area
	});

	// Function to handle auth redirect
	function goToSignIn() {
		goto('/auth?redirect=/subscribe');
	}

	const steps = [
		{ title: '1. Welcome to Nappio', component: 'InfoStep' },
		{ title: '2. About Your Baby', component: 'BabyDetailsStep' },
		{ title: '3. Additional Items', component: 'NappyWrapStep' },
		{ title: '4. Delivery Address', component: 'AddressStep' }
	];

	const handleEnhanceSubmit: SubmitFunction = ({ formElement, formData, action, cancel }) => {
		// Validate before submission
		if (!canProceed[currentStep]) {
			cancel();
			error = 'Please complete all required fields';
			return;
		}

		isSubmitting = true;
		error = null;

		return async ({ result }) => {
			try {
				if (result.type === 'success' && result.data) {
					const { checkout_url } = result.data;
					if (checkout_url) {
						window.location.href = checkout_url;
						return;
					}
				} else if (result.type === 'error') {
					error = result.error.message;
				} else if (result.type === 'failure') {
					error = result.data?.error || 'Subscription creation failed';
				}

				// Apply the action result to update the form state
				await applyAction(result);
			} catch (e) {
				error = e instanceof Error ? e.message : 'An unexpected error occurred';
			} finally {
				isSubmitting = false;
			}
		};
	};

	function nextStep() {
		if (currentStep < steps.length - 1 && canProceed[currentStep]) {
			currentStep++;
		}
	}

	function previousStep() {
		if (currentStep > 0) {
			currentStep--;
		}
	}
</script>

<form
	method="POST"
	action="?/createSubscription"
	use:enhance={handleEnhanceSubmit}
	class="m-4 mx-auto max-w-3xl p-4"
>
	<input type="hidden" name="babyBirthdate" value={babyBirthdate} />
	<input type="hidden" name="babyWeight" value={babyWeight} />
	<input type="hidden" name="wantNappyWraps" value={wantNappyWraps} />
	<input type="hidden" name="address" value={JSON.stringify(address)} />
	<!-- Progress indicator -->
	<div class="mb-8">
		<!-- Step titles - visible on md screens -->
		<div class="mb-2 hidden w-full justify-between md:flex">
			{#each steps as step, index}
				<div class="w-full text-center">
					<span
						class={`text-md font-commissioner p-2 font-bold ${index === currentStep ? 'text-text-colour' : 'text-stone-500'}`}
					>
						{step.title}
					</span>
				</div>
			{/each}
		</div>

		<!-- Progress bar -->
		<div class="bg-primary relative h-2 w-full overflow-hidden">
			<div
				class="bg-tertiary absolute top-0 left-0 h-full transition-all duration-500 ease-in-out"
				style="width: {((currentStep + 1) / steps.length) * 100}%"
			></div>
		</div>
	</div>

	<!-- Step content -->
	<div class="mb-8">
		{#if currentStep === 0}
			<!-- Info Step -->
			<div class="text-text-colour text-center">
				<h2 class="font-ranchers mb-4 text-4xl">Welcome to Nappio!</h2>
				<p class="mb-4">We're excited to get you started with our nappy service.</p>
				<div class="bg-primary border-text-colour border-1 p-6">
					<p class="font-commissioner text-2xl">Our subscription includes</p>
					<div class="grid grid-cols-1 gap-4 p-6 md:grid-cols-4">
						<div class="bg-background border-text-colour border-1 p-6 shadow-sm">
							<div class="flex flex-col items-center text-center">
								<i class="fa-solid fa-baby mb-4 text-3xl" style="color: #262625;"></i>
								<p class="font-medium">Weekly delivery of clean nappies</p>
							</div>
						</div>

						<div class="bg-background border-text-colour border-1 p-6 shadow-sm">
							<div class="flex flex-col items-center text-center">
								<i class="fa-solid fa-bicycle mb-4 text-3xl" style="color: #262625;"></i>
								<p class="font-medium">Collection of used nappies</p>
							</div>
						</div>

						<div class="bg-background border-text-colour border-1 p-6 shadow-sm">
							<div class="flex flex-col items-center text-center">
								<i class="fa-solid fa-soap mb-4 text-3xl" style="color: #262625;"></i>
								<p class="font-medium">Professional cleaning service</p>
							</div>
						</div>

						<div class="bg-background border-text-colour border-1 p-6 shadow-sm">
							<div class="flex flex-col items-center text-center">
								<i class="fa-solid fa-leaf mb-4 text-3xl" style="color: #262625;"></i>
								<p class="font-medium">Environmentally friendly solution</p>
							</div>
						</div>
					</div>
				</div>
				<div class="bg-accent2 border-text-colour border-1 border-t-0 p-6">
					<p class="font-commissioner text-2xl">Pricing Details</p>
					<div class="grid grid-cols-1 gap-4 p-6 md:grid-cols-2">
						<div class="bg-background border-text-colour border-1 p-6 shadow-sm">
							<div class="flex flex-col items-center text-center">
								<p>
									To get started, there's a one-off setup cost of <strong>£40</strong>, which covers
									everything you need to get started.
								</p>
							</div>
						</div>
						<div class="bg-background border-text-colour border-1 p-6 shadow-sm">
							<div class="flex flex-col items-center text-center">
								<p>
									After that, it's just <strong>£20 per week</strong>, paid on our
									collection/delivery day (Tuesday) — less than the cost of a night out!
								</p>
							</div>
						</div>
					</div>
				</div>
				{#if !isSignedIn}
					<div class="p-8">
						<div class="bg-primary border-accent mt-4 border-2 p-6 shadow-md">
							<p class=" mb-2">
								You'll need to set up your account with us before starting your subscription.
							</p>
							<!-- <Button
                                on:click={goToSignIn}
                                class="bg-tertiary! hover:bg-text-colour! text-text-colour hover:text-tertiary font-commissioner rounded-none"
                            >
                                Sign in or Register
                            </Button> -->
						</div>
					</div>
				{/if}
			</div>
		{:else if currentStep === 1}
			<!-- Baby Details Step -->
			<div class="items-center space-y-4 text-center">
				<h2 class="font-ranchers mb-4 text-4xl">Tell us about your baby</h2>
				<p class="mb-4">
					We use this information to make sure your baby gets the most appropriate size of nappies
					and to help identify when they outgrow them.
				</p>

				<div
					class="bg-primary border-text-colour mb-0 flex h-48 flex-col items-center justify-center gap-2 border-1 md:flex-row"
				>
					<Label
						class="font-commissioner text-bottom text-text-colour flex-1 pt-12 text-left text-xl md:pt-0 md:pl-6"
						for="birthdate">Baby's Birth Date</Label
					>
					<Input
						type="date"
						id="birthdate"
						bind:value={babyBirthdate}
						required
						class="bg-secondary! text-text-colour mx-auto h-full max-w-xs flex-1 rounded-none border-none pl-6 text-left text-2xl"
					/>
				</div>

				<div
					class="bg-accent2 border-text-colour flex h-48 flex-col items-center justify-center gap-2 border-1 border-t-0 md:flex-row"
				>
					<Label
						class="font-commissioner text-bottom text-text-colour flex-1 pt-12 text-left text-xl md:pt-0 md:pl-6"
						for="weight">Approximate Weight (kg)</Label
					>
					<Input
						type="number"
						id="weight"
						bind:value={babyWeight}
						min="0.1"
						step="0.1"
						required
						class="bg-secondary! text-text-colour mx-auto h-full max-w-xs flex-1 rounded-none border-none pl-6 text-left text-2xl [-moz-appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
					/>
				</div>
			</div>
		{:else if currentStep === 2}
			<!-- Nappy Wraps Step -->
			<div class="items-center space-y-8 text-center">
				<h2 class="font-ranchers mb-4 text-4xl">Would you like to rent nappy wraps?</h2>
				<p class="mx-auto mb-4 max-w-2xl">
					Nappy wraps are the waterproof outer layer that keep your baby's clothes dry. We can
					include them in your subscription for <strong>£2 per week</strong>.
				</p>

				<div
					class="border-text-colour mx-auto grid h-96 max-w-4xl grid-cols-1 border-1 md:grid-cols-2"
				>
					<Button
						class={`group p-6 ${wantNappyWraps ? 'bg-tertiary border-accent2 border-6' : 'bg-primary border-primary hover:bg-accent2 hover:border-accent2 border-2'} flex min-h-[300px] flex-col items-center justify-center gap-4 rounded-none shadow-md transition-all hover:shadow-lg`}
						on:click={() => (wantNappyWraps = true)}
					>
						<div class="mb-4 h-64 w-full overflow-hidden">
							<img
								src="/images/Nappy stock image 2 - Edited Cropped.JPG"
								alt="Nappy wraps with stars pattern"
								class="h-full w-full object-cover"
							/>
						</div>
						<span
							class={`font-commissioner text-text-colour ${wantNappyWraps ? 'text-xl' : 'text-xl'}`}
						>
							Yes, include wraps
						</span>
						<p class="text-text-colour mt-2 text-sm">(+£2/week)</p>
					</Button>

					<Button
						class={`p-6 ${!wantNappyWraps ? 'bg-tertiary border-accent2 border-6 shadow-sm' : 'bg-primary border-primary hover:bg-accent2 hover:border-accent2 border-2 shadow-lg'} flex min-h-[300px] flex-col items-center justify-center gap-4 rounded-none transition-all hover:shadow-xl`}
						on:click={() => (wantNappyWraps = false)}
					>
						<div class="relative mb-4 h-64 w-full overflow-hidden">
							<img
								src="/images/Nappy stock image 2 - Edited Cropped.JPG"
								alt="Nappy wraps with stars pattern"
								class="h-full w-full object-cover opacity-50 grayscale"
							/>
							<div class="absolute inset-0 flex items-center justify-center">
								<i class="fa-solid fa-ban fa-4x" style="color: #f7b6af;"></i>
							</div>
						</div>

						<span
							class={`font-commissioner text-text-colour ${!wantNappyWraps ? 'text-xl' : 'text-xl'}`}
						>
							No, thanks
						</span>
						<p class="text-text-colour mt-2 text-sm">I'll provide my own wraps</p>
					</Button>
				</div>
			</div>
		{:else if currentStep === 3}
			<!-- Address Step -->
			<div class="items-center space-y-8 text-center">
				<h2 class="font-ranchers mb-4 text-4xl">Where will we be delivering to?</h2>
				<p class="mx-auto mb-4 max-w-2xl">
					Let us know your main delivery address, this is where we'll hold your introductory session
					and your subsequent collections and deliveries.<br />You can also add notes about your
					delivery preferences.
				</p>
			</div>
			<SubscriptionAddress bind:address />
		{/if}
	</div>

	{#if currentStep === 3 && !canProceed[currentStep]}
		<div class="mb-4 flex justify-center">
			<div class="bg-primary border-accent mx-auto max-w-lg border-2 p-3 text-center shadow-md">
				<p class="text-sm font-medium">
					{#if !isValidServiceArea(address.postcode)}
						<i class="fa-solid fa-location-dot mr-2" style="color: #7cc4a7;"></i>
						Our service is currently available in:
						<span class="font-ranchers">{validPostcodes.join(', ')}</span>
					{/if}
				</p>
			</div>
		</div>
	{/if}

	<!-- Navigation buttons -->
	<div class="mt-8 flex justify-between space-x-2">
		<Button
			on:click={previousStep}
			disabled={currentStep === 0}
			class="bg-tertiary! hover:bg-text-colour! text-text-colour hover:text-tertiary rounded-none shadow-md transition-shadow hover:shadow-lg"
		>
			Previous
		</Button>

		{#if currentStep === steps.length - 1}
			<div class="flex-col items-end">
				<Button
					type="submit"
					disabled={isSubmitting || !canProceed[currentStep]}
					class={`${!canProceed[currentStep] ? 'cursor-not-allowed opacity-50' : ''} bg-tertiary! hover:bg-text-colour! text-text-colour hover:text-tertiary rounded-none shadow-md transition-shadow hover:shadow-lg`}
				>
					{#if isSubmitting}
						<Spinner class="mr-2" />
						Processing...
					{:else}
						Complete Subscription
					{/if}
				</Button>
			</div>
		{:else if !isSignedIn}
			<Button
				on:click={goToSignIn}
				class="bg-tertiary! hover:bg-text-colour! text-text-colour hover:text-tertiary font-commissioner rounded-none shadow-md transition-shadow hover:shadow-lg"
			>
				Sign in to Continue
			</Button>
		{:else}
			<Button
				on:click={nextStep}
				disabled={!canProceed[currentStep]}
				class="bg-tertiary! hover:bg-text-colour! text-text-colour hover:text-tertiary rounded-none shadow-md transition-shadow hover:shadow-lg"
			>
				Next
			</Button>
		{/if}
	</div>

	{#if error}
		<Alert color="red" class="mt-4">
			{error}
		</Alert>
	{/if}
</form>
