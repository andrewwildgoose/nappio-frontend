<script lang="ts">
	import { Button } from 'flowbite-svelte';

	export let subscription: any;
	export let addresses: any[];

    // State for subscription management
    let managingSubscription = false;

	// State for address selection
	let selectingAddress = false;

    // State for pause subscription
    let pausingSubscription = false;
    let pauseUntilDate = '';

	// Helper function to format currency
	function formatCurrency(amount: number) {
		return new Intl.NumberFormat('en-GB', {
			style: 'currency',
			currency: 'GBP'
		}).format(amount);
	}

    // Helper function to format date with ordinal suffix
    function formatDate(dateString: string) {
        const date = new Date(dateString);
        const dayName = date.toLocaleDateString('en-GB', { weekday: 'long' });
        const day = date.getDate();
        const month = date.toLocaleDateString('en-GB', { month: 'long' });
        
        // Add ordinal suffix (st, nd, rd, th)
        const getOrdinal = (n: number) => {
            const s = ['th', 'st', 'nd', 'rd'];
            const v = n % 100;
            return n + (s[(v - 20) % 10] || s[v] || s[0]);
        };
        
        return `${dayName} ${getOrdinal(day)} ${month}`;
    }

	function handleAddressAssign(address: any) {
		// Create and submit form programmatically
		const form = document.createElement('form');
		form.method = 'POST';
		form.action = '?/assignAddress';

		const actionInput = document.createElement('input');
		actionInput.type = 'hidden';
		actionInput.name = 'action';
		actionInput.value = 'assign';

		const addressInput = document.createElement('input');
		addressInput.type = 'hidden';
		addressInput.name = 'address_id';
		addressInput.value = address.id;

		const subscriptionInput = document.createElement('input');
		subscriptionInput.type = 'hidden';
		subscriptionInput.name = 'subscription_id';
		subscriptionInput.value = subscription.id;

		form.appendChild(actionInput);
		form.appendChild(addressInput);
		form.appendChild(subscriptionInput);
		document.body.appendChild(form);
		form.submit();
		document.body.removeChild(form);

		// Reset selection state
		selectingAddress = false;
	}

    function handlePauseSubscription() {
        // Create and submit form programmatically
        const form = document.createElement('form');
        form.method = 'POST';
        form.action = '?/pauseSubscription';

        const subscriptionInput = document.createElement('input');
        subscriptionInput.type = 'hidden';
        subscriptionInput.name = 'id';
        subscriptionInput.value = subscription.id;

        // Add pause_until date if provided
        if (pauseUntilDate) {
            const pauseUntilInput = document.createElement('input');
            pauseUntilInput.type = 'hidden';
            pauseUntilInput.name = 'pause_until';
            pauseUntilInput.value = pauseUntilDate;
            form.appendChild(pauseUntilInput);
        }

        form.appendChild(subscriptionInput);
        document.body.appendChild(form);
        form.submit();
        document.body.removeChild(form);
    }

</script>

<div class="bg-background border p-4 shadow-sm">
	<div class="flex justify-between">
		<div class="w-full">
			<p class="font-commissioner mb-2">
				<strong>Next collection/drop-off: </strong>
				{formatDate(subscription.next_payment_date)}
			</p>
            <p class="font-commissioner mb-2">
				<strong>Status: </strong>
				{subscription.status}
			</p>
			<!-- Subscription Items -->
			{#if subscription.items && subscription.items.length > 0}
				<div class="bg-tertiary/10 mt-3 rounded p-2">
					<!-- <p class="font-commissioner mb-2"><strong>Included Items:</strong></p> -->
					<ul class="space-y-1">
						{#each subscription.items as item}
							<li class="flex justify-between text-sm">
								<span>{item.name}</span>
								<span>{formatCurrency(item.price)}</span>
							</li>
						{/each}
					</ul>
				</div>
			{/if}

            <!-- Subscription Management -->
            <div class="mt-2">
                <Button
                    color="light"
                    class="bg-tertiary! hover:bg-accent! text-text-colour! font-commissioner text-l mt-2 rounded-none border-none transition-colors duration-200"
                    onclick={() => (managingSubscription = !managingSubscription)}
                >
                    {#if !managingSubscription}
                        Manage Subscription
                    {:else}
                        Collapse
                    {/if}
                </Button>
            </div>

            {#if managingSubscription}
                {#if subscription.address}
                    <div class="mt-2">
                        <p><strong>Delivery Address:</strong></p>
                        <p>{subscription.address.address_line_1}</p>
                        {#if subscription.address.address_line_2}
                            <p>{subscription.address.address_line_2}</p>
                        {/if}
                        <p>{subscription.address.city}</p>
                        <p>{subscription.address.postcode}</p>
                        <Button
                            color="light"
                            class="bg-tertiary! hover:bg-accent! text-text-colour! font-commissioner text-l mt-2 rounded-none border-none transition-colors duration-200"
                            onclick={() => (selectingAddress = true)}
                        >
                            Change Address
                        </Button>
                    </div>
                {:else}
                    <div class="mt-2">
                        <p class="mb-2 text-sm italic">No delivery address specified</p>
                        <Button
                            color="light"
                            class="bg-accent! hover:bg-tertiary! text-text-colour! hover:text-accent! font-commissioner text-l rounded-none transition-colors duration-200"
                            onclick={() => (selectingAddress = true)}
                        >
                            Select Address
                        </Button>
                    </div>
                {/if}

                {#if selectingAddress}
                    <div class="mt-4 border-t pt-4">
                        <p class="font-commissioner mb-2">Select a delivery address:</p>
                        <div class="space-y-2">
                            {#each addresses as address}
                                <button
                                    class="hover:bg-accent hover:text-text-colour w-full rounded border p-2 text-left transition-colors duration-200"
                                    onclick={() => handleAddressAssign(address)}
                                >
                                    <p class="font-bold">{address.address_line_1}</p>
                                    {#if address.address_line_2}
                                        <p>{address.address_line_2}</p>
                                    {/if}
                                    <p>{address.city}, {address.postcode}</p>
                                </button>
                            {/each}
                        </div>
                        <Button
                            color="light"
                            class="font-commissioner text-l mt-2 w-full rounded-none bg-gray-200 text-gray-700 hover:bg-gray-300"
                            onclick={() => (selectingAddress = false)}
                        >
                            Cancel
                        </Button>
                    </div>
                {/if}
                {#if !pausingSubscription}
                    <Button
                        color="light"
                        class="bg-accent! hover:bg-tertiary! text-text-colour! hover:text-accent! font-commissioner text-l mt-4 rounded-none transition-colors duration-200"
                        onclick={() => (pausingSubscription = true)}
                    >
                        Pause subscription
                    </Button>
                {:else}
                    <div class="mt-4 border-t pt-4">
                        <p class="font-commissioner mb-2">Pause subscription until:</p>
                        <input
                            type="date"
                            bind:value={pauseUntilDate}
                            min={new Date().toISOString().split('T')[0]}
                            class="mb-3 w-full rounded border p-2"
                        />
                        <div class="flex gap-2">
                            <Button
                                color="light"
                                class="bg-accent! hover:bg-tertiary! text-text-colour! hover:text-accent! font-commissioner text-l flex-1 rounded-none transition-colors duration-200"
                                onclick={handlePauseSubscription}
                            >
                                Confirm Pause
                            </Button>
                            <Button
                                color="light"
                                class="font-commissioner text-l flex-1 rounded-none bg-gray-200 text-gray-700 hover:bg-gray-300"
                                onclick={() => {
                                    pausingSubscription = false;
                                    pauseUntilDate = '';
                                }}
                            >
                                Cancel
                            </Button>
                        </div>
                    </div>
                {/if}
            {/if}
		</div>
	</div>
</div>
