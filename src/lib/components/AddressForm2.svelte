<script lang="ts">
    import { enhance } from '$app/forms';
    import { Button, Label, Input, Alert, Spinner } from 'flowbite-svelte';
    import type { AddressFormData } from '$lib/types/address';
    
    const { 
        mode = 'dashboard',
        action = null,
        showSaveButton = true,
        formSubmitButtonText,
        priceId = null,
        initialAddress = null,
        onSubmit = undefined,
        useEnhance = false
    } = $props<{
        mode?: 'subscription' | 'order' | 'dashboard',
        action?: string | null,
        showSaveButton?: boolean,
        formSubmitButtonText?: string,
        priceId?: string | null,
        initialAddress?: AddressFormData | null,
        onSubmit?: ((result: any) => Promise<void>) | undefined,
        useEnhance?: boolean
    }>();

    // Create bindable form state
    let formData = $state<AddressFormData>({
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

    let isSubmitting = $state(false);
    const validPostcodes = ['SW2', 'SW4', 'SW8', 'SW9'];
    
    // Update form when initialAddress changes
    $effect(() => {
        if (initialAddress) {
            formData = {
                ...formData,
                address_line_1: initialAddress.address_line_1,
                address_line_2: initialAddress.address_line_2,
                city: initialAddress.city,
                country: initialAddress.country,
                postcode: initialAddress.postcode,
                address_notes: initialAddress.address_notes
            };
        }
    });

    // Expose formData to parent components
    export { formData as form };

    // Different behavior based on mode
    let submitButtonText = $derived({
        subscription: 'Continue with Subscription',
        order: 'Continue to Payment',
        dashboard: formSubmitButtonText || 'Save Address'
    }[mode as 'subscription' | 'order' | 'dashboard']);

    // let isPostcodeValidationStrict = $derived(
    //     mode === 'subscription' || mode === 'order'
    // );

    // Handle form submission based on mode
    function handleSubmit() {
        isSubmitting = true;
        return async ({ result }) => {
            try {
                if (onSubmit) {
                    await onSubmit(result);
                }
            } finally {
                isSubmitting = false;
            }
        };
    }

    // Validate postcode based on mode
    let isValidPostcode = $derived(mode === 'dashboard' || 
        !formData.postcode || 
        validPostcodes.some(pc => formData.postcode.toUpperCase().startsWith(pc)));
</script>

<div class="flex flex-col space-y-4 w-full max-w-md mx-auto p-2 md:p-8">
    <!-- Use form element only if action is provided -->
    {#if action}
        <form 
            class="space-y-4"
            method="POST"
            {action}
            use:enhance={useEnhance ? handleSubmit : undefined}
        >
            <!-- Address form fields -->
            <div class="w-full sm:w-96 mb-4 px-0">
                <Label for="address-line1" class="block mb-1 font-commissioner text-xl text-text-colour!">
                    Address Line 1
                </Label>
                <Input
                    id="address-line1"
                    name="address_line1"
                    type="text"
                    required
                    bind:value={formData.address_line_1}
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
                    bind:value={formData.address_line_2}
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
                    bind:value={formData.city}
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
                    bind:value={formData.country}
                    class="bg-secondary! border-solid border-2 border-accent! rounded-none" 
                    disabled={isSubmitting}
                    placeholder="United Kingdom"
                />
            </div>

            <div class="w-full sm:w-96 mb-4 px-0">
                        {#if formData.postcode && !isValidPostcode}
                            <p class="text-red-500 mb-2">
                                {#if mode === 'subscription' || mode === 'order'}
                                    We don't currently operate in your postcode. Our current areas are {validPostcodes.join(', ')}.
                                {:else}
                                    Note: This address is outside our delivery area ({validPostcodes.join(', ')}).
                                {/if}
                            </p>
                        {/if}
                        <Label for="postcode">Postcode</Label>
                        <Input
                            id="postcode"
                            name="postcode"
                            type="text"
                            bind:value={formData.postcode}
                            required
                            class="bg-secondary! border-solid border-2 border-accent! rounded-none" 
                            disabled={isSubmitting}
                            placeholder="We currently serve SW2, SW4, SW8 and SW9"
                        />
                    </div>

                    <!-- Submit button -->
                    {#if showSaveButton}
                        <div class="flex justify-center">
                            <Button
                                type="submit"
                                disabled={isSubmitting || (mode !== 'dashboard' && !isValidPostcode)}
                                class="bg-tertiary! hover:bg-accent! text-accent! hover:text-tertiary! font-commissioner text-3xl rounded-none transition-colors duration-200" 
                                size="lg"
                            >
                                {#if isSubmitting}
                                    <Spinner class="mr-3" /> Loading...
                                {:else}
                                    {formSubmitButtonText || submitButtonText}
                                {/if}
                            </Button>
                        </div>
                    {/if}
            </form>
    {:else}
        <div class="space-y-4">
            <!-- Address form fields without form wrapper -->
            <div class="w-full sm:w-96 mb-4 px-0">
                <Label for="address-line1" class="block mb-1 font-commissioner text-xl text-text-colour!">
                    Address Line 1
                </Label>
                <Input
                    id="address-line1"
                    name="address_line1"
                    type="text"
                    required
                    bind:value={formData.address_line_1}
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
                    bind:value={formData.address_line_2}
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
                    bind:value={formData.city}
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
                    bind:value={formData.country}
                    class="bg-secondary! border-solid border-2 border-accent! rounded-none" 
                    disabled={isSubmitting}
                    placeholder="United Kingdom"
                />
            </div>

            <div class="w-full sm:w-96 mb-4 px-0">
                        {#if formData.postcode && !isValidPostcode}
                            <p class="text-red-500 mb-2">
                                {#if mode === 'subscription' || mode === 'order'}
                                    We don't currently operate in your postcode. Our current areas are {validPostcodes.join(', ')}.
                                {:else}
                                    Note: This address is outside our delivery area ({validPostcodes.join(', ')}).
                                {/if}
                            </p>
                        {/if}
                        <Label for="postcode">Postcode</Label>
                        <Input
                            id="postcode"
                            name="postcode"
                            type="text"
                            bind:value={formData.postcode}
                            required
                            class="bg-secondary! border-solid border-2 border-accent! rounded-none" 
                            disabled={isSubmitting}
                            placeholder="We currently serve SW2, SW4, SW8 and SW9"
                        />
                    </div>
        </div>
    {/if}

    <!-- Error and success messages -->
    {#if formData?.error}
        <Alert color="red" class="flex justify-center mb-4">
            {formData.error}
        </Alert>
    {/if}
    
    {#if formData?.message}
        <Alert color="green" class="flex justify-center mb-4">
            {formData.message}
        </Alert>
    {/if}
</div>