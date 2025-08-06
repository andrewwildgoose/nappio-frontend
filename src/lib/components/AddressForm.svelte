<script lang="ts">
    import { enhance } from '$app/forms';
    import { Button, Label, Input, Textarea, Alert, Spinner } from 'flowbite-svelte';

    interface AddressFormData {
        error?: string;
        message?: string;
        address_line_1?: string;
        address_line_2?: string;
        city?: string;
        country?: string;
        postcode?: string;
        address_notes?: string;
        success?: boolean;
        data?: {
            success: boolean;
            message?: string;
        };
    }
    
    export let showSaveButton: boolean = true; // Whether to show the Save Address button
    export let form: AddressFormData | null = null;
    export let address: any = null; // Address to update, if any
    let isSubmitting = false;

    const validPostcodes = ['SW12', 'SW9', 'SW2'];

    // Pre-populate form with address data if provided
    $: if (address) {
        form = {
            ...form,
            address_line_1: address.address_line_1,
            address_line_2: address.address_line_2,
            city: address.city,
            country: address.country,
            postcode: address.postcode,
            address_notes: address.address_notes
        };
    }

    let postcode: string = form?.postcode || '';

    function handleSubmit() {
        isSubmitting = true;
        return async ({ result }) => {
            try {
                if (result.type === 'redirect') {
                    return; // Let SvelteKit handle the redirect
                }
                
                if (result.type === 'success' && result.data?.success) {
                    if (result.data.message) {
                        form = result.data;
                    } else {
                        window.location.reload(); // Reload to show updated address
                    }
                } else if (result.type === 'failure') {
                    form = {
                        error: result.data?.error || 'Failed to add address',
                        ...result.data
                    };
                }
            } finally {
                isSubmitting = false;
            }
        };
    }
</script>

<div class="flex flex-col space-y-4 w-full max-w-md mx-auto p-2 md:p-8">
    <form 
        method="POST" 
        action="?/address" 
        class="space-y-4" 
        use:enhance={handleSubmit}
    >
        <div class="w-full sm:w-96 mb-6 px-0">
            <input type="hidden" name="action" value={address?.id ? 'delete' : 'add'} />
            <Label for="address-line1" class="block mb-2 font-commissioner text-xl text-text-colour!">
                Address Line 1
            </Label>
            <Input
                id="address-line1"
                name="address_line1"
                type="text"
                required
                value={form?.address_line_1 ?? ''}
                class="bg-secondary! border-solid border-2 border-accent! rounded-none" 
                disabled={isSubmitting}
                placeholder="123 Example Street"
            />
        </div>

        <div class="w-full sm:w-96 mb-6 px-0">
            <Label for="address-line2" class="block mb-2 font-commissioner text-xl text-text-colour!">
                Address Line 2 (Optional)
            </Label>
            <Input
                id="address-line2"
                name="address_line2"
                type="text"
                value={form?.address_line_2 ?? ''}
                class="bg-secondary! border-solid border-2 border-accent! rounded-none" 
                disabled={isSubmitting}
                placeholder="Apartment, suite, etc."
            />
        </div>

        <div class="w-full sm:w-96 mb-6 px-0">
            <Label for="city" class="block mb-2 font-commissioner text-xl text-text-colour!">
                City
            </Label>
            <Input
                id="city"
                name="city"
                type="text"
                required
                value={form?.city ?? ''}
                class="bg-secondary! border-solid border-2 border-accent! rounded-none" 
                disabled={isSubmitting}
                placeholder="London"
            />
        </div>

        <div class="w-full sm:w-96 mb-6 px-0">
            <Label for="county" class="block mb-2 font-commissioner text-xl text-text-colour!">
                Country
            </Label>
            <Input
                id="country"
                name="country"
                type="text"
                required
                value={form?.country ?? ''}
                class="bg-secondary! border-solid border-2 border-accent! rounded-none" 
                disabled={isSubmitting}
                placeholder="United Kingdom"
            />
        </div>

        <div class="w-full sm:w-96 mb-6 px-0">
            {#if 
                postcode.length > 2
                && !validPostcodes.some(pc => postcode.toUpperCase().startsWith(pc))}
                <p class="text-red-500 mb-2">We don't currently operate in your postcode, our current areas are {validPostcodes.join(', ')}.</p>
            {/if}
            <Label for="postcode" class="block mb-2 font-commissioner text-xl text-text-colour!">
                Postcode
            </Label>
            <Input
                id="postcode"
                name="postcode"
                type="text"
                required
                bind:value={postcode}
                class="bg-secondary! border-solid border-2 border-accent! rounded-none" 
                disabled={isSubmitting}
                placeholder="SW9 ... or SW12 ... or SW2 ..."
            />
        </div>

        <div class="w-full sm:w-96 mb-6 px-0">
            <Label for="address-notes" class="block mb-2 font-commissioner text-xl text-text-colour!">
                Address Notes (Optional)
            </Label>
            <Textarea
                id="address-notes"
                name="address_notes"
                rows={4}
                value={form?.address_notes ?? ''}
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
                        Save Address
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