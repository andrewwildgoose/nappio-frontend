<script lang="ts">
    import { enhance } from '$app/forms';
    import { Button, Label, Input, Textarea, Alert, Spinner } from 'flowbite-svelte';
    import type { AddressFormData } from '$lib/types/address';
    
    let { 
        action,
        showSaveButton = true,
        formSubmitButtonText = 'Save Address',
        priceId = null, // Plan ID for context
        initialAddress = null, // Address to pre-populate
        onSubmit = undefined,
        useEnhance = false
    } = $props();

    // let form: AddressFormData;

    let isSubmitting = $state(false);

    const validPostcodes = ['SW2', 'SW4', 'SW8', 'SW9'];

    function handleSubmit() {
        isSubmitting = true;
        return async ({ result }) => {
            if (onSubmit) {
                await onSubmit(result);
            }
            isSubmitting = false;
        };
    }

    // Pre-populate form with address data if provided
    let form: AddressFormData = $state({
        error: '',
        message: '',
        address_line_1: initialAddress?.address_line_1 ?? '',
        address_line_2: initialAddress?.address_line_2 ?? '',
        city: initialAddress?.city ?? '',
        country: initialAddress?.country ?? '',
        postcode: initialAddress?.postcode ?? '',
        address_notes: initialAddress?.address_notes ?? '',
        priceId: priceId
    });

</script>

<div class="flex flex-col space-y-4 w-full max-w-md mx-auto p-2 md:p-8">
    <form 
        class="space-y-4"
        method="POST"
        action="{action}"
        use:enhance={useEnhance ? handleSubmit : undefined}
    >
        <div class="w-full sm:w-96 mb-4 px-0">
            <input type="hidden" name="action" value={initialAddress?.id ? 'delete' : 'add'} />
            <input type="hidden" name="priceId" value={priceId ?? ''} />
            <Label for="address-line1" class="block mb-1 font-commissioner text-xl text-text-colour!">
                Address Line 1
            </Label>
            <Input
                id="address-line1"
                name="address_line1"
                type="text"
                required
                bind:value={form.address_line_1}
                class="bg-secondary! border-solid border-2 border-accent! rounded-none" 
                disabled={isSubmitting}
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
                bind:value={form.address_line_2}
                class="bg-secondary! border-solid border-2 border-accent! rounded-none" 
                disabled={isSubmitting}
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
                bind:value={form.city}
                class="bg-secondary! border-solid border-2 border-accent! rounded-none" 
                disabled={isSubmitting}
                placeholder="London"
            />
        </div>

        <div class="w-full sm:w-96 mb-4 px-0">
            <Label for="county" class="block mb-1 font-commissioner text-xl text-text-colour!">
                Country
            </Label>
            <Input
                id="country"
                name="country"
                type="text"
                required
                bind:value={form.country}
                class="bg-secondary! border-solid border-2 border-accent! rounded-none" 
                disabled={isSubmitting}
                placeholder="United Kingdom"
            />
        </div>

        <div class="w-full sm:w-96 mb-4 px-0">
            {#if 
                form.postcode.length > 2
                && !validPostcodes.some(pc => (form.postcode).toUpperCase().startsWith(pc))}
                <p class="text-red-500 mb-2">We don't currently operate in your postcode, our current areas are {validPostcodes.join(', ')}.</p>
            {/if}
            <Label for="postcode" class="block mb-1 font-commissioner text-xl text-text-colour!">
                Postcode
            </Label>
            <Input
                id="postcode"
                name="postcode"
                type="text"
                bind:value={form.postcode}
                required
                class="bg-secondary! border-solid border-2 border-accent! rounded-none" 
                disabled={isSubmitting}
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
                bind:value={form.address_notes}
                class="bg-secondary! border-solid border-2 border-accent! rounded-none" 
                disabled={isSubmitting}
                placeholder="Delivery instructions, gate codes, or other helpful notes..."
            />
        </div>
        {#if showSaveButton}
            <div class="flex justify-center">
                <Button
                    type="submit"
                    class="bg-tertiary! hover:bg-accent! text-accent! hover:text-tertiary! font-commissioner text-3xl rounded-none transition-colors duration-200" 
                    size="lg"
                    disabled={isSubmitting}
                >
                    {#if isSubmitting}
                        <Spinner class="mr-3" /> Loading...
                    {:else}
                        {formSubmitButtonText}
                    {/if}
                </Button>
            </div>
        {/if}
    </form>

    {#if form?.error}
        <Alert color="red" class="flex justify-center mb-4">
            {form.error}
        </Alert>
    {/if}
    
    {#if form?.message}
        <Alert color="green" class="flex justify-center mb-4">
            {form.message}
        </Alert>
    {/if}
</div>