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
        return validPostcodes.some(validCode => 
            formattedPostcode.startsWith(validCode.replace(/\s+/g, ''))
        );
    }
    
    // Validate postcode based on mode
    $: isValidPostcode = mode === 'dashboard' || !address.postcode || isValidServiceArea(address.postcode);

    // Export validation status
    export let isValid = true;
    
    // Update validation status when postcode changes
    $: {
        isValid = isValidPostcode;
    }
</script>

<div class="space-y-4">
    <div class="w-full sm:w-96 mb-4 px-0">
        <Label for="address-line1" class="block mb-1 font-commissioner text-xl text-text-colour!">
            Address Line 1
        </Label>
        <Input
            id="address-line1"
            name="address_line1"
            type="text"
            required
            bind:value={address.address_line_1}
            {disabled}
            class="bg-secondary! border-solid border-2 border-accent! rounded-none"
            placeholder="123 Example Street"
        />
    </div>

    <div class="w-full sm:w-96 mb-4 px-0">
        <Label for="address-line2" class="block mb-1 font-commissioner text-xl text-text-colour!">
            Address Line 2 (Optional)
        </Label>
        <Input
            id="address-line2"
            name="address_line2"
            type="text"
            bind:value={address.address_line_2}
            {disabled}
            class="bg-secondary! border-solid border-2 border-accent! rounded-none"
            placeholder="Apartment, suite, etc."
        />
    </div>

    <div class="w-full sm:w-96 mb-4 px-0">
        <Label for="city" class="block mb-1 font-commissioner text-xl text-text-colour!">
            City
        </Label>
        <Input
            id="city"
            name="city"
            type="text"
            required
            bind:value={address.city}
            {disabled}
            class="bg-secondary! border-solid border-2 border-accent! rounded-none"
            placeholder="London"
        />
    </div>

    <div class="w-full sm:w-96 mb-4 px-0">
        <Label for="country" class="block mb-1 font-commissioner text-xl text-text-colour!">
            Country
        </Label>
        <Input
            id="country"
            name="country"
            type="text"
            required
            bind:value={address.country}
            {disabled}
            class="bg-secondary! border-solid border-2 border-accent! rounded-none"
            placeholder="United Kingdom"
        />
    </div>

    <div class="w-full sm:w-96 mb-4 px-0">
        {#if address.postcode && !isValidPostcode}
            <div class="bg-primary p-3 border-2 border-accent shadow-md mt-2">
                <p class="text-sm font-medium mb-2">
                    {#if mode === 'subscription' || mode === 'order'}
                        <i class="fa-solid fa-location-dot mr-2" style="color: #7cc4a7;"></i>
                        Our service is currently available in: <span class="font-ranchers">{validPostcodes.join(', ')}</span>
                    {:else}
                        Note: This address is outside our delivery area ({validPostcodes.join(', ')}).
                    {/if}
                </p>            
            </div>
        {/if}
        <Label for="postcode" class="block mb-1 font-commissioner text-xl text-text-colour!">
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
            class="bg-secondary! border-solid border-2 border-accent! rounded-none"
            placeholder="We currently serve SW2, SW4, SW8 and SW9"
        />
    </div>
    <div class="w-full sm:w-96 mb-4 px-0">
        <Label for="address-notes" class="block mb-1 font-commissioner text-xl text-text-colour!">
            Address Notes (Optional)
        </Label>
        <Textarea
            id="address-notes"
            name="address_notes"
            rows={4}
            bind:value={address.address_notes}
            class="bg-secondary! border-solid border-2 border-accent! rounded-none" 
            {disabled}
            placeholder="Delivery instructions, gate codes, or other helpful notes..."
        />
    </div>
</div>