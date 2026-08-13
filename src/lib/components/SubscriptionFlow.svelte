<script lang="ts">
	import { tick } from 'svelte';
	import { page } from '$app/state';
	import { goto } from '$app/navigation';
	import { enhance, applyAction } from '$app/forms';
	import type { SubmitFunction } from '@sveltejs/kit';
	import { Button, Input, Label, Alert, Spinner } from 'flowbite-svelte';
	import SubscriptionAddress from './SubscriptionAddress.svelte';
	import type { AddressFormData } from '$lib/types/address';
	import type { VoucherVerificationResult } from '$lib/types/voucher';
	import { PUBLIC_SUBSCRIPTIONS_ENABLED } from '$env/static/public';

	// Auth check
	let isSignedIn = $derived(page.data.user != null);

	// export let priceId: string;

	// Redirect if subscriptions are disabled
	let subscriptionsEnabled = $derived(PUBLIC_SUBSCRIPTIONS_ENABLED === 'true');

	// Flow state management
	let currentStep = $state(0);
	let isSubmitting = $state(false);
	let error = $state<string | null>(null);
	let formElement: HTMLFormElement;

	// Form data
	let babyBirthdate = $state('');
	let babyWeight = $state(0);
	// let wantNappyWraps = $state(false);
	let serviceLevel = $state('full-time'); // 'part-time' or 'full-time'
	let address = $state<AddressFormData>({} as AddressFormData);
	let selectedAddressJson = $state('');
	let selectedAddressId = $state<string | null>(null); // Track if using saved address
	let hasVoucher = $state<'yes' | 'no' | ''>('');
	let voucherCode = $state('');
	let voucherStatus = $state<'idle' | 'verifying' | 'verified' | 'failed'>('idle');
	let voucherResult = $state<VoucherVerificationResult | null>(null);
	let voucherFeedback = $state<string | null>(null);

	// Valid service area postcodes
	let serviceAreaPostcodes = $derived(page.data.serviceAreaPostcodes ?? []);

	function normalisePostcode(postcode: string | null | undefined): string {
		return postcode?.replace(/\s+/g, '').toUpperCase() ?? '';
	}

	function resetVoucherState(feedback: string | null = null) {
		voucherStatus = 'idle';
		voucherResult = null;
		voucherFeedback = feedback;
	}

	function selectVoucherChoice(choice: 'yes' | 'no') {
		hasVoucher = choice;
		voucherCode = '';
		resetVoucherState();
	}

	async function verifyVoucher() {
		if (!voucherCode.trim()) {
			voucherFeedback = 'Please enter your voucher code.';
			return;
		}

		if (!address.postcode || !isValidServiceArea(address.postcode)) {
			voucherFeedback = 'Please enter a valid delivery postcode before verifying your voucher.';
			return;
		}

		voucherStatus = 'verifying';
		voucherFeedback = null;

		try {
			const response = await fetch('/api/vouchers/verify', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					voucherCode: voucherCode.trim(),
					postcode: address.postcode
				})
			});

			const data = (await response.json()) as VoucherVerificationResult & {
				error?: string;
				detail?: string;
			};

			if (!response.ok) {
				voucherResult = null;
				voucherStatus = 'failed';
				voucherFeedback = data.error || data.detail || 'Failed to verify voucher.';
				return;
			}

			voucherResult = data;
			voucherStatus = data.eligible ? 'verified' : 'failed';
			voucherFeedback = data.message;
		} catch {
			voucherResult = null;
			voucherStatus = 'failed';
			voucherFeedback = 'Failed to verify voucher.';
		}
	}

	let appliedVoucher = $derived(
		voucherResult?.eligible &&
			voucherResult.code &&
			voucherResult.postcode &&
			voucherResult.discount_code
			? JSON.stringify({
					code: voucherResult.code,
					postcode: voucherResult.postcode,
					discount_code: voucherResult.discount_code,
					voucher_type: voucherResult.voucher_type ?? 'RNFL'
				})
			: ''
	);
	// Handle saved address selection
	$effect(() => {
		if (selectedAddressJson) {
			try {
				const parsedAddress = JSON.parse(selectedAddressJson);
				address = { ...parsedAddress };
				selectedAddressId = parsedAddress.id; // Track the saved address ID
			} catch {
				error = 'Failed to load selected address. Please try again.';
			}
		} else {
			// If no saved address selected, clear the ID so we create a new one
			selectedAddressId = null;
		}
	});

	// Watch for manual edits to address fields and clear saved address selection
	let lastSavedAddress = $state<string>('');
	$effect(() => {
		const currentAddressString = JSON.stringify(address);
		if (selectedAddressId && lastSavedAddress && currentAddressString !== lastSavedAddress) {
			// User manually edited the address, so clear the saved address ID
			selectedAddressId = null;
			selectedAddressJson = '';
		}
		if (selectedAddressJson) {
			lastSavedAddress = JSON.stringify(address);
		}
	});

	$effect(() => {
		if (
			voucherStatus === 'verified' &&
			voucherResult?.postcode &&
			normalisePostcode(voucherResult.postcode) !== normalisePostcode(address.postcode)
		) {
			resetVoucherState('Your delivery postcode changed, so please verify your voucher again.');
		}
	});

	// Format and validate postcode
	function isValidServiceArea(postcode: string): boolean {
		if (!postcode) return false;
		const formatted = postcode.replace(/\s+/g, '').toUpperCase();
		return serviceAreaPostcodes.some((pc: string) => formatted.startsWith(pc));
	}

	// Step validation
	let canProceed = $derived<Record<number, boolean>>({
		0: isSignedIn && subscriptionsEnabled, // Info step always valid
		1: isSignedIn && subscriptionsEnabled && Boolean(babyBirthdate) && babyWeight > 0,
		2: isSignedIn && subscriptionsEnabled, // Nappy wraps selection always valid
		3:
			isSignedIn &&
			subscriptionsEnabled &&
			Boolean(address.postcode) &&
			isValidServiceArea(address.postcode),
		4:
			isSignedIn &&
			subscriptionsEnabled &&
			(hasVoucher === 'no' || voucherStatus === 'verified' || voucherStatus === 'failed')
	});

	// Function to handle auth redirect
	function goToSignIn() {
		goto('/auth?redirect=/subscribe');
	}

	const steps = [
		{ title: '1. Welcome to Nappio', component: 'InfoStep' },
		{ title: '2. About Your Baby', component: 'BabyDetailsStep' },
		{ title: '3. Nappy Quantity', component: 'ServiceLevelStep' },
		{ title: '4. Delivery Address', component: 'AddressStep' },
		{ title: '5. Voucher', component: 'VoucherStep' }
	];

	const handleEnhanceSubmit: SubmitFunction = ({ cancel }) => {
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

	async function nextStep() {
		if (currentStep < steps.length - 1 && canProceed[currentStep]) {
			currentStep++;
			await tick();
			formElement?.scrollIntoView({ behavior: 'auto', block: 'start' });
		}
	}

	async function previousStep() {
		if (currentStep > 0) {
			currentStep--;
			await tick();
			formElement?.scrollIntoView({ behavior: 'auto', block: 'start' });
		}
	}
</script>

<form
	bind:this={formElement}
	method="POST"
	action="?/createSubscription"
	use:enhance={handleEnhanceSubmit}
	class="m-4 mx-auto max-w-3xl p-4"
>
	<input type="hidden" name="babyBirthdate" value={babyBirthdate} />
	<input type="hidden" name="babyWeight" value={babyWeight} />
	<input type="hidden" name="serviceLevel" value={serviceLevel} />
	<!-- <input type="hidden" name="wantNappyWraps" value={wantNappyWraps} /> -->
	<input type="hidden" name="address" value={JSON.stringify(address)} />
	<input type="hidden" name="addressId" value={selectedAddressId || ''} />
	<input type="hidden" name="voucher" value={appliedVoucher} />
	<!-- Progress indicator -->
	<div class="mb-8">
		<!-- Step titles - visible on md screens -->
		<div class="mb-2 hidden w-full justify-between md:flex">
			{#each steps as step, index (step.title)}
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
				<div class="bg-accent border-text-colour border-1 p-6">
					<span>
						<h2 class="font-ranchers text-4xl text-black">
							Welcome to
							<img
								src="/images/logos/Nappio-Colour-Text-NoTag.png"
								alt="Nappio"
								class="inline-block h-12 pb-0.5 align-bottom"
							/>
						</h2>
					</span>
				</div>

				<div
					class="border-text-colour h-75 border-r-1 border-l-1 bg-[url(/images/standing-wrap.webp)] bg-cover bg-bottom shadow-sm md:h-100"
				></div>
				<div class="bg-tertiary border-text-colour mb-8 border-1 p-6">
					<p>We're excited to get you started with our nappy service.</p>
				</div>
				<div class="bg-primary border-text-colour border-1 p-4 md:p-6">
					<h3 class="font-commissioner text-2xl">Our subscription includes</h3>
					<div class="grid grid-cols-1 gap-4 p-6 md:grid-cols-4">
						<div class="bg-background border-text-colour border-1 p-6 shadow-sm">
							<div class="flex flex-col items-center text-center">
								<i class="fa-solid fa-baby mb-4 text-3xl" style="color: #262625;"></i>
								<p class="font-medium">Enough cloth nappies to meet your weekly needs</p>
							</div>
						</div>

						<div class="bg-background border-text-colour border-1 p-6 shadow-sm">
							<div class="flex flex-col items-center text-center">
								<i class="fa-solid fa-bicycle mb-4 text-3xl" style="color: #262625;"></i>
								<p class="font-medium">Weekly drop and off and collection</p>
							</div>
						</div>

						<div class="bg-background border-text-colour border-1 p-6 shadow-sm">
							<div class="flex flex-col items-center text-center">
								<i class="fa-solid fa-soap mb-4 text-3xl" style="color: #262625;"></i>
								<p class="font-medium">Professional laundering</p>
							</div>
						</div>

						<div class="bg-background border-text-colour border-1 p-6 shadow-sm">
							<div class="flex flex-col items-center text-center">
								<i class="fa-solid fa-suitcase mb-4 text-3xl" style="color: #262625;"></i>
								<p class="font-medium">All extras you need to cloth nappy like a pro</p>
							</div>
						</div>
					</div>
				</div>

				<div class="bg-accent2 border-text-colour border-1 border-t-0 p-4 md:p-6">
					<h3 class="font-commissioner text-2xl">Pricing Details</h3>
					<div class="grid grid-cols-1 gap-4 p-6 pb-4 md:grid-cols-2">
						<div class="bg-background border-text-colour border-1 p-6 shadow-sm">
							<div class="flex flex-col items-center text-center">
								<h4 class="font-ranchers mb-2 text-xl">Getting started</h4>
								<p>
									There's a <strong>one-off £40 set-up fee</strong>, which covers all extras
									(laundry bags, smell-proof bin, waterproof covers and a dry bag) plus an at-home
									visit to show you how to use the nappies.
								</p>
								<p class="mt-4">
									The fee is taken at checkout when you confirm your subscription. We'll then
									contact you within 48 hours to arrange your home visit and get you started.
								</p>
							</div>
						</div>
						<div class="bg-background border-text-colour border-1 p-6 shadow-sm">
							<div class="flex flex-col items-center text-center">
								<h4 class="font-ranchers mb-2 text-xl">Subscription</h4>
								<p>
									After your home visit and once we've agreed your start date, your weekly
									subscription begins on the day your first batch of nappies is delivered.
								</p>
								<p class="mt-4">
									A part-time subscription (up to 25 nappies per week) is <strong
										>£16 per week</strong
									>, and a full-time subscription (usually around 40 nappies, or as many as you
									need) is <strong>£20 per week</strong>.
								</p>
							</div>
						</div>
					</div>
					<div class="bg-background border-text-colour m-6 mt-0 mb-0 border-1 p-6 shadow-sm">
						<div class="flex flex-col items-center text-center">
							<h4 class="font-ranchers mb-2 text-xl">Help with the set-up fee</h4>
							<p>
								You can apply for a voucher provided by <strong>Real Nappies For London</strong>
								which will cover the set-up fee.<br />

								<Button
									class="bg-tertiary! hover:bg-text-colour! text-text-colour! hover:text-tertiary! text-m mt-2 rounded-none border-none shadow-sm transition-colors duration-200"
									size="md"
									onclick={(e: MouseEvent) => {
										e.preventDefault();
										window.open('https://www.realnappiesforlondon.org.uk/apply/', '_blank');
									}}
								>
									Find out more and sign up for a voucher
								</Button>
							</p>
							<p class="mt-4">
								Once you have your voucher you'll be able to enter the voucher code just before the
								checkout step of this subscription process and your set-up fee will be waived.
							</p>
						</div>
					</div>
				</div>
				<div class="bg-secondary border-text-colour border-1 border-t-0 p-4 md:p-6">
					<h3 class="font-commissioner text-2xl">Service Area</h3>
					<div class="grid grid-cols-1 gap-4 p-6">
						<div class="bg-background border-text-colour mb-4 border-1 p-6 shadow-sm">
							<div class="flex flex-col items-center text-center">
								<p class="text-m font-medium">
									<i class="fa-solid fa-location-dot mr-2" style="color: #7cc4a7;"></i>
									Our service is currently available in:<br />
									<span class="font-ranchers">{serviceAreaPostcodes.join(', ')}</span>
								</p>
							</div>
						</div>
						<div class="bg-background border-text-colour border-1 p-6 shadow-sm">
							<div class="flex flex-col items-center text-center">
								<p>
									If your postcode is not yet covered, register your interest by signing up to our
									newsletter and we'll keep you updated as our service area expands.
								</p>
								<Button
									class="bg-tertiary! hover:bg-text-colour! text-text-colour! hover:text-tertiary! text-m mt-2 rounded-none border-none shadow-sm transition-colors duration-200"
									size="md"
									href="/newsletter"
								>
									My postcode isn't listed
								</Button>
							</div>
						</div>
					</div>
				</div>
				{#if !subscriptionsEnabled}
					<div class="p-8">
						<div class="bg-primary border-accent mt-4 border-2 p-6 shadow-md">
							<p class=" mb-2">
								We've been overwhelmed by demand and don't have capacity for new subscriptions at
								this time. Please sign up to our newsletter to be notified when we reopen
								subscriptions.
							</p>
						</div>
					</div>
				{:else if !isSignedIn}
					<div class="p-8">
						<div class="bg-primary border-accent mt-4 border-2 p-6 shadow-md">
							<p class=" mb-2">
								You'll need to sign in or set up your account with us before starting your
								subscription.
							</p>
						</div>
					</div>
				{/if}
			</div>
		{:else if currentStep === 1}
			<!-- Baby Details Step -->
			<div class="items-center text-center">
				<div class="bg-tertiary border-text-colour border-1 p-4 md:p-6">
					<h2 class="font-ranchers mb-4 text-4xl">Tell us about your baby</h2>
					<p class="mb-4">
						We use this information to make sure your baby gets the right size nappies.
					</p>
				</div>
				<div
					class="bg-primary border-text-colour mb-0 flex h-48 flex-col items-center justify-center gap-2 border-1 border-t-0 md:flex-row"
				>
					<Label
						class="font-commissioner text-bottom text-text-colour flex-1 pt-12 text-left text-xl md:pt-0 md:pl-6"
						for="birthdate">Baby's Birth Date</Label
					>
					<Input
						type="date"
						id="birthdate"
						bind:value={babyBirthdate}
						max={new Date().toISOString().split('T')[0]}
						required
						class="bg-secondary! text-text-colour mx-auto h-full flex-1 rounded-none border-none pl-6 text-left text-2xl"
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
						class="bg-secondary! text-text-colour mx-auto h-full flex-1 rounded-none border-none pl-6 text-left text-2xl [-moz-appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
					/>
				</div>
			</div>
		{:else if currentStep === 2}
			<!-- Service Level Step -->
			<div class="items-center text-center">
				<div class="bg-tertiary border-text-colour border-1 p-4 md:p-6">
					<h2 class="font-ranchers mb-4 text-4xl">
						Do you need a part-time or full-time subscription?
					</h2>
					<p>
						Every family is different! Choose the subscription type that best suits your needs based
						on our guidance below.
					</p>
				</div>
				<div class="bg-accent2 border-text-colour border-1 border-t-0 p-6 shadow-sm">
					<div class="grid grid-cols-1 gap-4 md:grid-cols-2">
						<div class="bg-background border-text-colour border-1 p-6 shadow-sm">
							<div class="flex flex-col items-center text-center">
								<span class="font-commissioner text-text-colour mb-4 text-2xl">
									<i class="fa-solid fa-calendar-day text-text-colour text-2xl"></i>
									Part-time use
								</span>
								<p>
									Part-timers get up to 25 nappies a week. This subscription works well for those
									who want to mix with some disposables or wash-at-home cloth nappies. Part-timers
									get 3 waterproof nappy covers.
								</p>
							</div>
						</div>
						<div class="bg-background border-text-colour border-1 p-6 shadow-sm">
							<div class="flex flex-col items-center text-center">
								<span class="font-commissioner text-text-colour mb-4 text-2xl">
									<i class="fa-solid fa-calendar-day text-text-colour text-2xl"></i>
									Full-time use
								</span>
								<p>
									Full-timers get as many nappies as they need - usually around 40 nappies. We
									recommend this option for people going all in with cloth and using it around the
									clock. Full-timers get 6 waterproof covers and boosters to add to nappies
									overnight.
								</p>
							</div>
						</div>
					</div>
				</div>
				<div class="bg-secondary border-text-colour space-y-4 border-1 border-t-0 p-4 md:p-6">
					<div class="bg-background border-text-colour border-1 p-6 shadow-sm">
						<p class="mb-4">Both subscriptions include all the extras you will need, including:</p>
						<ul class="list-inside list-disc text-left md:indent-36">
							<li><strong>smell-proof nappy bin</strong></li>
							<li><strong>laundry bag</strong></li>
							<li><strong>dry bag</strong> (for storing nappies outside on collection day)</li>
							<li><strong>waterproof covers.</strong></li>
						</ul>
					</div>
					<div class="bg-background border-text-colour border-1 p-6 shadow-sm">
						<p>
							You can switch between part and full-time any time you like. Most customers like to
							start with part-time and graduate to full-time as they become cloth nappy pros. Some
							switch back down to part-time when their baby starts nursery.
						</p>
					</div>
				</div>
				<div class="bg-accent border-text-colour mb-8 border-1 border-t-0 p-4 md:p-6">
					<div class="bg-background border-text-colour border-1 p-6 shadow-sm">
						<p>
							Not sure which subscription will work best for you? No problem. Email us at <a
								href="mailto:info@nappio.co.uk"
								class="text-accent!"
								onclick={(e) => {
									e.preventDefault();
									window.open('mailto:info@nappio.co.uk', '_blank');
								}}>info@nappio.co.uk</a
							> and we can help you make the right decision for you.
						</p>
					</div>
				</div>
				<div class="border-text-colour mx-auto grid max-w-4xl grid-cols-1 border-1 md:grid-cols-2">
					<Button
						class={`group p-6 ${serviceLevel === 'part-time' ? 'bg-tertiary border-accent2 border-6' : 'bg-primary border-primary hover:bg-accent2 hover:border-accent2 border-2'} flex min-h-[200px] flex-col items-center justify-center gap-4 rounded-none shadow-md transition-all hover:shadow-lg`}
						on:click={() => (serviceLevel = 'part-time')}
					>
						<!-- <div class="mb-4 h-75 w-full overflow-hidden">
							<img
								src="/images/image-banner-1/wraps-blue-bg.webp"
								alt="Nappy wraps with stars pattern"
								class="h-full w-full object-cover"
							/>
						</div> -->
						<span
							class={`font-commissioner text-text-colour ${serviceLevel === 'part-time' ? 'text-3xl' : 'text-3xl'}`}
						>
							<i class="fa-solid fa-calendar-day text-text-colour text-3xl"></i>
							Part-time use
						</span>
						<p class="text-text-colour mt-2 text-sm">£16/week</p>
					</Button>

					<Button
						class={`p-6 ${serviceLevel === 'full-time' ? 'bg-tertiary border-accent2 border-6 shadow-sm' : 'bg-primary border-primary hover:bg-accent2 hover:border-accent2 border-2 shadow-lg'} flex min-h-[200px] flex-col items-center justify-center gap-4 rounded-none transition-all hover:shadow-xl`}
						on:click={() => (serviceLevel = 'full-time')}
					>
						<!-- <div class="relative mb-4 h-75 w-full overflow-hidden">
							<img
								src="/images/image-banner-1/wraps-blue-bg.webp"
								alt="Nappy wraps with stars pattern"
								class="h-full w-full object-cover opacity-50 grayscale"
							/>
							<div class="absolute inset-0 flex items-center justify-center">
								<i class="fa-solid fa-ban fa-4x" style="color: #f7b6af;"></i>
							</div>
						</div> -->

						<span
							class={`font-commissioner text-text-colour ${serviceLevel === 'full-time' ? 'text-3xl' : 'text-3xl'}`}
						>
							<i class="fa-solid fa-calendar-week text-text-colour text-3xl"></i>
							Full-time use
						</span>
						<p class="text-text-colour mt-2 text-sm">£20/week</p>
					</Button>
				</div>
			</div>
			<!-- Marked for removal - leaving in as may reintroduce later -->
			<!-- {:else if currentStep === 2}
			Nappy Wraps Step
			<div class="items-center space-y-8 text-center">
				<h2 class="font-ranchers mb-4 text-4xl">Would you like to rent nappy wraps?</h2>
				<p class="mx-auto mb-4 max-w-2xl">
					Nappy wraps are the waterproof outer layer that keep your baby's clothes dry. We can
					include them in your subscription for <strong>£2 per week</strong>.
				</p>

				<div
					class="border-text-colour mx-auto grid max-w-4xl grid-cols-1 border-1 md:grid-cols-2"
				>
					<Button
						class={`group p-6 ${wantNappyWraps ? 'bg-tertiary border-accent2 border-6' : 'bg-primary border-primary hover:bg-accent2 hover:border-accent2 border-2'} flex min-h-[300px] flex-col items-center justify-center gap-4 rounded-none shadow-md transition-all hover:shadow-lg`}
						on:click={() => (wantNappyWraps = true)}
					>
						<div class="mb-4 h-75 w-full overflow-hidden">
							<img
								src="/images/image-banner-1/wraps-blue-bg.webp"
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
						<div class="relative mb-4 h-75 w-full overflow-hidden">
							<img
								src="/images/image-banner-1/wraps-blue-bg.webp"
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
			</div> -->
		{:else if currentStep === 3}
			<!-- Address Step -->
			<div class="items-center space-y-8 text-center">
				<div class="bg-tertiary border-text-colour border-1 p-4 md:p-6">
					<h2 class="font-ranchers mb-4 text-4xl">Where will we be delivering to?</h2>
					<p class="mx-auto mb-4 max-w-2xl">
						Let us know your main delivery address, this is where we'll hold your introductory
						session and your subsequent collections and deliveries.<br />You can also add notes
						about your delivery preferences.
					</p>
				</div>
			</div>
			{#if page.data.addresses && page.data.addresses.length > 0}
				<div class="bg-accent2 border-text-colour border-1 border-t-0 p-6 shadow-sm">
					<div class="mb-4 items-center text-center">
						<Label class="font-commissioner text-text-colour! mb-1 block text-xl">
							Select from your saved addresses
						</Label>
						<select
							bind:value={selectedAddressJson}
							class="bg-secondary! border-accent! text-text-colour! w-full rounded-none border-2 border-solid p-2 sm:w-96"
						>
							<option value="">Select an address</option>
							{#each page.data.addresses as savedAddress (savedAddress.id)}
								<option value={JSON.stringify(savedAddress)}>
									{savedAddress.address_line_1}, {savedAddress.city}, {savedAddress.postcode}
								</option>
							{/each}
						</select>
						<br /><br />
						<p class="text-text-colour! mb-4">Or enter a new delivery address below.</p>
					</div>
				</div>
			{/if}
			<div class="bg-accent2 border-text-colour space-y-4 border-1 border-t-0 p-4 md:p-6">
				<SubscriptionAddress bind:address {serviceAreaPostcodes} />
			</div>
		{:else if currentStep === 4}
			<div class="items-center space-y-8 text-center">
				<div class="bg-tertiary border-text-colour border-1 p-4 md:p-6">
					<h2 class="font-ranchers mb-4 text-4xl">Do you have a voucher?</h2>
					<p class="mx-auto mb-4 max-w-2xl">
						If you have a Real Nappies for London voucher, we can apply it before you continue to
						Stripe checkout.
					</p>
				</div>

				<div class="border-text-colour mx-auto grid max-w-4xl grid-cols-1 border-1 md:grid-cols-2">
					<Button
						type="button"
						class={`group p-6 ${hasVoucher === 'yes' ? 'bg-tertiary border-accent2 border-6' : 'bg-primary border-primary hover:bg-accent2 hover:border-accent2 border-2'} flex min-h-[180px] flex-col items-center justify-center gap-4 rounded-none shadow-md transition-all hover:shadow-lg`}
						on:click={() => selectVoucherChoice('yes')}
					>
						<span class="font-commissioner text-text-colour text-3xl">Yes</span>
						<p class="text-text-colour mt-2 text-sm">I have a voucher code to verify</p>
					</Button>

					<Button
						type="button"
						class={`p-6 ${hasVoucher === 'no' ? 'bg-tertiary border-accent2 border-6 shadow-sm' : 'bg-primary border-primary hover:bg-accent2 hover:border-accent2 border-2 shadow-lg'} flex min-h-[180px] flex-col items-center justify-center gap-4 rounded-none transition-all hover:shadow-xl`}
						on:click={() => selectVoucherChoice('no')}
					>
						<span class="font-commissioner text-text-colour text-3xl">No</span>
						<p class="text-text-colour mt-2 text-sm">Continue without a voucher discount</p>
					</Button>
				</div>

				{#if hasVoucher === 'yes'}
					<div class="bg-accent2 border-text-colour space-y-4 border-1 border-t-0 p-4 md:p-6">
						<div class="mx-auto max-w-md text-left">
							<Label
								for="voucher-code"
								class="font-commissioner text-text-colour! mb-1 block text-xl"
							>
								Voucher code
							</Label>
							<Input
								id="voucher-code"
								type="text"
								bind:value={voucherCode}
								on:input={() => {
									if (voucherStatus !== 'idle' || voucherResult) {
										resetVoucherState();
									}
								}}
								class="bg-secondary! border-accent! rounded-none border-2 border-solid"
								placeholder="Enter your voucher code"
							/>
						</div>

						<div class="flex justify-center">
							<Button
								type="button"
								on:click={verifyVoucher}
								disabled={voucherStatus === 'verifying'}
								class="bg-tertiary! hover:bg-accent! text-accent! hover:text-tertiary! font-commissioner rounded-none transition-colors duration-200"
							>
								{#if voucherStatus === 'verifying'}
									<Spinner class="mr-2" />
									Verifying...
								{:else}
									Verify voucher
								{/if}
							</Button>
						</div>
					</div>
				{:else if hasVoucher === 'no'}
					<div class="bg-accent2 border-text-colour space-y-4 border-1 border-t-0 p-4 md:p-6">
						<p>If you do not have a voucher yet, you can still continue to checkout now.</p>
						<div class="flex justify-center">
							<Button
								class="bg-tertiary! hover:bg-text-colour! text-text-colour! hover:text-tertiary! text-m rounded-none border-none shadow-sm transition-colors duration-200"
								size="md"
								href="https://www.realnappiesforlondon.org.uk/apply/"
								target="_blank"
								rel="noreferrer"
							>
								Apply for a voucher
							</Button>
						</div>
					</div>
				{/if}

				{#if voucherFeedback}
					<Alert color={voucherStatus === 'verified' ? 'green' : 'red'} class="mt-4">
						{voucherFeedback}
					</Alert>
				{/if}

				{#if voucherStatus === 'failed'}
					<div class="bg-primary border-accent mx-auto max-w-lg border-2 p-3 text-center shadow-md">
						<p class="text-sm font-medium">
							You can continue to checkout without a voucher discount, or leave the subscription
							journey for now.
						</p>
						<div class="mt-4 flex justify-center">
							<Button
								class="bg-tertiary! hover:bg-text-colour! text-text-colour! hover:text-tertiary! text-m rounded-none border-none shadow-sm transition-colors duration-200"
								size="md"
								href="/"
							>
								Leave for now
							</Button>
						</div>
					</div>
				{/if}
			</div>
		{/if}
	</div>

	{#if currentStep === 3 && !canProceed[currentStep]}
		<div class="mb-4 flex justify-center">
			<div class="bg-primary border-accent mx-auto max-w-lg border-2 p-3 text-center shadow-md">
				<p class="text-sm font-medium">
					{#if !isValidServiceArea(address.postcode)}
						<i class="fa-solid fa-location-dot mr-2" style="color: #7cc4a7;"></i>
						Our service is currently available in:
						<span class="font-ranchers">{serviceAreaPostcodes.join(', ')}</span>
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
						Continue to checkout
					{/if}
				</Button>
			</div>
		{:else if !subscriptionsEnabled}
			<Button
				class="bg-tertiary! hover:bg-text-colour! text-text-colour hover:text-tertiary font-commissioner rounded-none shadow-md transition-shadow hover:shadow-lg"
				href="/newsletter"
			>
				Sign up for updates
			</Button>
		{:else if !isSignedIn}
			<Button
				on:click={goToSignIn}
				class="bg-tertiary! hover:bg-text-colour! text-text-colour hover:text-tertiary font-commissioner rounded-none shadow-md transition-shadow hover:shadow-lg"
			>
				Sign in or sign up to continue
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
