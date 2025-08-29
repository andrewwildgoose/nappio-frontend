<script lang="ts">
    import AddressFields from './AddressFields.svelte';
    import type { AddressFormData } from '$lib/types/address';

    export let address: AddressFormData;
</script>

<div class="w-full max-w-md mx-auto">
    <AddressFields 
        bind:address
        mode="subscription"
    />
</div>