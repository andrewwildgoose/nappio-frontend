<script lang="ts">
	import AddressFields from './AddressFields.svelte';
	import type { AddressFormData } from '$lib/types/address';

	export let address: AddressFormData;
</script>

<div class="mx-auto w-full max-w-md">
	<AddressFields bind:address mode="order" />
</div>
