<script lang="ts">
    import { enhance } from '$app/forms';
    import AddressFields from './AddressFields.svelte';
    import { Button, Alert } from 'flowbite-svelte';
    import type { AddressFormData } from '$lib/types/address';

    export let initialAddress: AddressFormData | null = null;
    
    let address: AddressFormData = initialAddress || {
        address_line_1: '',
        address_line_2: '',
        city: '',
        country: '',
        postcode: '',
        address_notes: '',
        error: '',
        message: ''
    };

    let isSubmitting = false;

    async function handleSubmit() {
        isSubmitting = true;
        // Your dashboard address save logic
    }
</script>

<form 
    class="w-full max-w-md mx-auto"
    method="POST"
    action="?/saveAddress"
    use:enhance={handleSubmit}
>
    <AddressFields bind:address disabled={isSubmitting} />
    
    <div class="mt-6">
        <Button 
            type="submit"
            disabled={isSubmitting}
            class="w-full bg-tertiary! hover:bg-accent! text-accent! hover:text-tertiary! rounded-none"
        >
            Save Address
        </Button>
    </div>
</form>