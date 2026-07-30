<script lang="ts">
	import AddressFields from './AddressFields.svelte';
	import type { AddressFormData } from '$lib/types/address';

	export let address: AddressFormData;
	export let serviceAreaPostcodes: string[] = [];
</script>

<div class="mx-auto flex w-full max-w-md justify-center">
	<AddressFields bind:address mode="subscription" {serviceAreaPostcodes} />
</div>
