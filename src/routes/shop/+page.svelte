<script lang="ts">
	import type { ActionData, PageData } from './$types';

	let { data, form } = $props<{ data: PageData; form?: ActionData }>();
	let selectedAddressId = $state('');

	function getProductName(product: PageData['products'][number]) {
		return product.name?.trim() || 'Product';
	}

	function getProductDescription(product: PageData['products'][number]) {
		return product.description?.trim() || '';
	}

	function formatCurrency(product: PageData['products'][number]) {
		const amount =
			typeof product.price === 'number'
				? product.price
				: typeof product.unit_amount === 'number'
					? product.unit_amount / 100
					: null;

		if (amount === null) {
			return 'Price shown at checkout';
		}

		return new Intl.NumberFormat('en-GB', {
			style: 'currency',
			currency: (product.currency || 'GBP').toUpperCase()
		}).format(amount);
	}
</script>

<svelte:head>
	<title>Shop - Nappio</title>
	<meta name="description" content="Browse and buy Nappio products" />
</svelte:head>

<div class="min-h-screen px-4 py-8">
	<div class="mx-auto w-full max-w-5xl">
		<div class="mb-8 text-center">
			<h1 class="font-ranchers text-text-colour mb-2 text-5xl">Shop</h1>
			<p class="font-commissioner text-text-colour text-lg">
				Browse products and checkout securely.
			</p>
		</div>

		{#if data.loadError}
			<div class="mb-6 border border-red-400 bg-red-100 p-4 text-red-700">{data.loadError}</div>
		{/if}

		{#if form?.error}
			<div class="mb-6 border border-red-400 bg-red-100 p-4 text-red-700">{form.error}</div>
		{/if}

		{#if data.products.length === 0}
			<div class="bg-background text-text-colour border p-8 text-center">
				No products are currently available.
			</div>
		{:else}
			<form method="POST" action="?/checkout" class="space-y-8">
				<section>
					<h2 class="font-commissioner text-text-colour mb-4 text-2xl">Products</h2>
					<div class="grid gap-4 md:grid-cols-2">
						{#each data.products as product (product.id)}
							<div class="bg-background flex flex-col justify-between border p-4">
								<div>
									<h3 class="font-commissioner text-text-colour text-xl">
										{getProductName(product)}
									</h3>
									{#if getProductDescription(product)}
										<p class="text-text-colour mt-2">{getProductDescription(product)}</p>
									{/if}
								</div>
								<div class="mt-4 flex items-end justify-between gap-3">
									<p class="text-text-colour font-bold">{formatCurrency(product)}</p>
									<div>
										<label class="text-text-colour mb-1 block text-sm" for={`qty_${product.id}`}>
											Qty
										</label>
										<input
											id={`qty_${product.id}`}
											name={`qty_${product.id}`}
											type="number"
											min="0"
											max="99"
											value="0"
											class="border-accent bg-secondary text-text-colour w-20 border p-2"
										/>
									</div>
								</div>
							</div>
						{/each}
					</div>
				</section>

				<section class="bg-background border p-6">
					<h2 class="font-commissioner text-text-colour mb-4 text-2xl">Checkout details</h2>

					{#if data.isSignedIn}
						<p class="text-text-colour mb-4">Signed in as <strong>{data.userEmail}</strong></p>
						{#if data.addresses.length > 0}
							<div class="mb-4">
								<label class="text-text-colour mb-2 block font-semibold" for="addressId">
									Select a saved address
								</label>
								<select
									id="addressId"
									name="addressId"
									bind:value={selectedAddressId}
									class="border-accent bg-secondary text-text-colour w-full border p-2"
								>
									<option value="">Use a new address</option>
									{#each data.addresses as address (address.id)}
										<option value={address.id}>
											{address.address_line_1}, {address.city}, {address.postcode}
										</option>
									{/each}
								</select>
							</div>
						{/if}
					{:else}
						<div class="mb-4">
							<label class="text-text-colour mb-2 block font-semibold" for="guest_email">
								Email address
							</label>
							<input
								id="guest_email"
								name="guest_email"
								type="email"
								required
								class="border-accent bg-secondary text-text-colour w-full border p-2"
								placeholder="you@example.com"
							/>
						</div>
					{/if}

					<h3 class="font-commissioner text-text-colour mb-3 text-xl">Delivery address</h3>
					<div class="grid gap-4 md:grid-cols-2">
						<div>
							<label class="text-text-colour mb-1 block" for="address_line_1">Address line 1</label>
							<input
								id="address_line_1"
								name="address_line_1"
								type="text"
								required={!data.isSignedIn || selectedAddressId === ''}
								class="border-accent bg-secondary text-text-colour w-full border p-2"
							/>
						</div>
						<div>
							<label class="text-text-colour mb-1 block" for="address_line_2"
								>Address line 2 (optional)</label
							>
							<input
								id="address_line_2"
								name="address_line_2"
								type="text"
								class="border-accent bg-secondary text-text-colour w-full border p-2"
							/>
						</div>
						<div>
							<label class="text-text-colour mb-1 block" for="city">City</label>
							<input
								id="city"
								name="city"
								type="text"
								required={!data.isSignedIn || selectedAddressId === ''}
								class="border-accent bg-secondary text-text-colour w-full border p-2"
							/>
						</div>
						<div>
							<label class="text-text-colour mb-1 block" for="postcode">Postcode</label>
							<input
								id="postcode"
								name="postcode"
								type="text"
								required={!data.isSignedIn || selectedAddressId === ''}
								class="border-accent bg-secondary text-text-colour w-full border p-2"
							/>
						</div>
						<div>
							<label class="text-text-colour mb-1 block" for="country">Country</label>
							<input
								id="country"
								name="country"
								type="text"
								required={!data.isSignedIn || selectedAddressId === ''}
								placeholder="United Kingdom"
								class="border-accent bg-secondary text-text-colour w-full border p-2"
							/>
						</div>
						<div class="md:col-span-2">
							<label class="text-text-colour mb-1 block" for="address_notes"
								>Address notes (optional)</label
							>
							<textarea
								id="address_notes"
								name="address_notes"
								rows="3"
								class="border-accent bg-secondary text-text-colour w-full border p-2"
							></textarea>
						</div>
					</div>
				</section>

				<div class="flex justify-center">
					<button
						type="submit"
						class="bg-tertiary hover:bg-accent font-commissioner text-accent hover:text-tertiary rounded-none px-8 py-3 text-xl transition-colors duration-200"
					>
						Continue to checkout
					</button>
				</div>
			</form>
		{/if}
	</div>
</div>
