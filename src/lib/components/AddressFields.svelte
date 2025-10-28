<script lang="ts">
	import { Label, Input, Textarea } from 'flowbite-svelte';
	import type { AddressFormData } from '$lib/types/address';

	// Make address bindable with explicit type
	export let address: AddressFormData;
	export let disabled = false;
	export let mode: 'subscription' | 'order' | 'dashboard' = 'dashboard';

	const validPostcodes = ['SW2', 'SW4', 'SW8', 'SW9'];

	// Format postcode by removing spaces and converting to uppercase
	function formatPostcode(postcode: string): string {
		return postcode.replace(/\s+/g, '').toUpperCase();
	}

	// Check if postcode is in valid service area
	function isValidServiceArea(postcode: string): boolean {
		if (!postcode) return true;
		if (postcode.length < 3) return true;
		const formattedPostcode = formatPostcode(postcode);
		return validPostcodes.some((validCode) =>
			formattedPostcode.startsWith(validCode.replace(/\s+/g, ''))
		);
	}

	// Validate postcode based on mode
	$: isValidPostcode =
		mode === 'dashboard' || !address.postcode || isValidServiceArea(address.postcode);

	// Export validation status
	export let isValid = true;

	// Update validation status when postcode changes
	$: {
		isValid = isValidPostcode;
	}
</script>

<div class="space-y-4">
	<div class="mb-4 w-full px-0 sm:w-96">
		<Label for="address-line1" class="font-commissioner text-text-colour! mb-1 block text-xl">
			Address Line 1
		</Label>
		<Input
			id="address-line1"
			name="address_line1"
			type="text"
			required
			bind:value={address.address_line_1}
			{disabled}
			class="bg-secondary! border-accent! rounded-none border-2 border-solid"
			placeholder="123 Example Street"
		/>
	</div>

	<div class="mb-4 w-full px-0 sm:w-96">
		<Label for="address-line2" class="font-commissioner text-text-colour! mb-1 block text-xl">
			Address Line 2 (Optional)
		</Label>
		<Input
			id="address-line2"
			name="address_line2"
			type="text"
			bind:value={address.address_line_2}
			{disabled}
			class="bg-secondary! border-accent! rounded-none border-2 border-solid"
			placeholder="Apartment, suite, etc."
		/>
	</div>

	<div class="mb-4 w-full px-0 sm:w-96">
		<Label for="city" class="font-commissioner text-text-colour! mb-1 block text-xl">City</Label>
		<Input
			id="city"
			name="city"
			type="text"
			required
			bind:value={address.city}
			{disabled}
			class="bg-secondary! border-accent! rounded-none border-2 border-solid"
			placeholder="London"
		/>
	</div>

	<div class="mb-4 w-full px-0 sm:w-96">
		<Label for="country" class="font-commissioner text-text-colour! mb-1 block text-xl">
			Country
		</Label>
		<Input
			id="country"
			name="country"
			type="text"
			required
			bind:value={address.country}
			{disabled}
			class="bg-secondary! border-accent! rounded-none border-2 border-solid"
			placeholder="United Kingdom"
		/>
	</div>

	<div class="mb-4 w-full px-0 sm:w-96">
		{#if address.postcode && !isValidPostcode}
			<div class="bg-primary border-accent mt-2 border-2 p-3 shadow-md">
				<p class="mb-2 text-sm font-medium">
					{#if mode === 'subscription' || mode === 'order'}
						<i class="fa-solid fa-location-dot mr-2" style="color: #7cc4a7;"></i>
						Our service is currently available in:
						<span class="font-ranchers">{validPostcodes.join(', ')}</span>
					{:else}
						Note: This address is outside our delivery area ({validPostcodes.join(', ')}).
					{/if}
				</p>
			</div>
		{/if}
		<Label for="postcode" class="font-commissioner text-text-colour! mb-1 block text-xl">
			Postcode
		</Label>
		<Input
			id="postcode"
			name="postcode"
			type="text"
			required
			minlength={4}
			bind:value={address.postcode}
			{disabled}
			class="bg-secondary! border-accent! rounded-none border-2 border-solid"
			placeholder="We currently serve SW2, SW4, SW8 and SW9"
		/>
	</div>
	<div class="mb-4 w-full px-0 sm:w-96">
		<Label for="address-notes" class="font-commissioner text-text-colour! mb-1 block text-xl">
			Address Notes (Optional)
		</Label>
		<Textarea
			id="address-notes"
			name="address_notes"
			rows={4}
			bind:value={address.address_notes}
			class="bg-secondary! border-accent! rounded-none border-2 border-solid"
			{disabled}
			placeholder="Delivery instructions, gate codes, or other helpful notes..."
		/>
	</div>
</div>
