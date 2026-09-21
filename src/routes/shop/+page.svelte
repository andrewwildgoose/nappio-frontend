<script lang="ts">
	import type { ActionData, PageData } from './$types';

	let { data, form } = $props<{ data: PageData; form?: ActionData }>();

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
			<h1 class="font-ranchers mb-2 text-5xl text-text-colour">Shop</h1>
			<p class="font-commissioner text-lg text-text-colour">Browse products and checkout securely.</p>
		</div>

		{#if data.loadError}
			<div class="mb-6 border border-red-400 bg-red-100 p-4 text-red-700">{data.loadError}</div>
		{/if}

		{#if form?.error}
			<div class="mb-6 border border-red-400 bg-red-100 p-4 text-red-700">{form.error}</div>
		{/if}

		{#if data.products.length === 0}
			<div class="border bg-background p-8 text-center text-text-colour">
				No products are currently available.
			</div>
		{:else}
			<form method="POST" action="?/checkout" class="space-y-8">
				<section>
					<h2 class="font-commissioner mb-4 text-2xl text-text-colour">Products</h2>
					<div class="grid gap-4 md:grid-cols-2">
						{#each data.products as product (product.id)}
							<div class="flex flex-col justify-between border bg-background p-4">
								<div>
									<h3 class="font-commissioner text-xl text-text-colour">{getProductName(product)}</h3>
									{#if getProductDescription(product)}
										<p class="mt-2 text-text-colour">{getProductDescription(product)}</p>
									{/if}
								</div>
								<div class="mt-4 flex items-end justify-between gap-3">
									<p class="font-bold text-text-colour">{formatCurrency(product)}</p>
									<div>
										<label class="mb-1 block text-sm text-text-colour" for={`qty_${product.id}`}>
											Qty
										</label>
										<input
											id={`qty_${product.id}`}
											name={`qty_${product.id}`}
											type="number"
											min="0"
											max="99"
											value="0"
											class="w-20 border border-accent bg-secondary p-2 text-text-colour"
										/>
									</div>
								</div>
							</div>
						{/each}
					</div>
				</section>

				<section class="border bg-background p-6">
					<h2 class="font-commissioner mb-4 text-2xl text-text-colour">Checkout details</h2>

					{#if data.isSignedIn}
						<p class="mb-4 text-text-colour">Signed in as <strong>{data.userEmail}</strong></p>
						{#if data.addresses.length > 0}
							<div class="mb-4">
								<label class="mb-2 block font-semibold text-text-colour" for="addressId">
									Select a saved address
								</label>
								<select
									id="addressId"
									name="addressId"
									class="w-full border border-accent bg-secondary p-2 text-text-colour"
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
							<label class="mb-2 block font-semibold text-text-colour" for="guest_email">
								Email address
							</label>
							<input
								id="guest_email"
								name="guest_email"
								type="email"
								required
								class="w-full border border-accent bg-secondary p-2 text-text-colour"
								placeholder="you@example.com"
							/>
						</div>
					{/if}

					<h3 class="font-commissioner mb-3 text-xl text-text-colour">Delivery address</h3>
					<div class="grid gap-4 md:grid-cols-2">
						<div>
							<label class="mb-1 block text-text-colour" for="address_line_1">Address line 1</label>
							<input
								id="address_line_1"
								name="address_line_1"
								type="text"
								required={!data.isSignedIn}
								class="w-full border border-accent bg-secondary p-2 text-text-colour"
							/>
						</div>
						<div>
							<label class="mb-1 block text-text-colour" for="address_line_2">Address line 2 (optional)</label>
							<input
								id="address_line_2"
								name="address_line_2"
								type="text"
								class="w-full border border-accent bg-secondary p-2 text-text-colour"
							/>
						</div>
						<div>
							<label class="mb-1 block text-text-colour" for="city">City</label>
							<input
								id="city"
								name="city"
								type="text"
								required={!data.isSignedIn}
								class="w-full border border-accent bg-secondary p-2 text-text-colour"
							/>
						</div>
						<div>
							<label class="mb-1 block text-text-colour" for="postcode">Postcode</label>
							<input
								id="postcode"
								name="postcode"
								type="text"
								required={!data.isSignedIn}
								class="w-full border border-accent bg-secondary p-2 text-text-colour"
							/>
						</div>
						<div>
							<label class="mb-1 block text-text-colour" for="country">Country</label>
							<input
								id="country"
								name="country"
								type="text"
								required={!data.isSignedIn}
								placeholder="United Kingdom"
								class="w-full border border-accent bg-secondary p-2 text-text-colour"
							/>
						</div>
						<div class="md:col-span-2">
							<label class="mb-1 block text-text-colour" for="address_notes">Address notes (optional)</label>
							<textarea
								id="address_notes"
								name="address_notes"
								rows="3"
								class="w-full border border-accent bg-secondary p-2 text-text-colour"
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
