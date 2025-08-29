<script lang="ts">
    import type { PageData } from './$types';
    import { Button } from 'flowbite-svelte';
    import { slide } from 'svelte/transition';
    import { cubicInOut } from 'svelte/easing';
    // import { enhance } from '$app/forms';
    // import { goto } from '$app/navigation';
    import SignOutForm from '$lib/components/SignOutForm.svelte';
    import AddressForm from '$lib/components/AddressForm.svelte';
    // import { addAddress, assignAddress } from '$lib/api/address.server';

    export let data: PageData;
    let showAddressForm = false;
    let isAddressesExpanded = false;
    let isSubscriptionsExpanded = false;

    let selectedAddress: typeof data.addresses[0] | null = null;

    // State for address selection
    let selectingAddressFor: typeof data.subscriptions[0] | null = null;

    function handleAddressDelete(address: typeof data.addresses[0]) {
        // Create and submit form programmatically
        const form = document.createElement('form');
        form.method = 'POST';
        form.action = '?/addressDelete';

        const actionInput = document.createElement('input');
        actionInput.type = 'hidden';
        actionInput.name = 'action';
        actionInput.value = 'delete';

        const idInput = document.createElement('input');
        idInput.type = 'hidden';
        idInput.name = 'id';
        idInput.value = address.id;

        form.appendChild(actionInput);
        form.appendChild(idInput);
        document.body.appendChild(form);
        form.submit();
        document.body.removeChild(form);
    }

    // Helper function to format date
    function formatDate(dateString: string) {
        return new Date(dateString).toLocaleDateString('en-GB');
    }

    // Helper function to format currency
    function formatCurrency(amount: number) {
        return new Intl.NumberFormat('en-GB', { 
            style: 'currency', 
            currency: 'GBP' 
        }).format(amount);
    }

    function handleAddressAssign(subscription: typeof data.subscriptions[0], address: typeof data.addresses[0]) {
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
        selectingAddressFor = null;
    }
</script>

<div class="flex flex-col items-center justify-top min-h-screen p-4">
    <div class="border p-8 rounded-lg shadow-lg max-w-2xl bg-background w-full">
        <h1 class="text-3xl font-ranchers mb-6">Welcome, {data.user.first_name}!</h1>
        <div class="space-y-4">
            <div class="border-b pb-4">
                <h2 class="text-xl font-commissioner mb-2">Your Profile</h2>
                <p><strong>Email:</strong> {data.user.email}</p>
                <p><strong>Name:</strong> {data.user.first_name} {data.user.surname}</p>
                <!-- <p><strong>Postcode:</strong> {data.user.postcode}</p> -->
            </div>
            <!-- Add address section here -->
            <div class="mt-4 border-b">
                <div class="mb-4">
                    <button
                        type="button"
                        class="flex justify-between items-center w-full"
                        on:click={() => isAddressesExpanded = !isAddressesExpanded}
                        on:keydown={(e) => e.key === 'Enter' && (isAddressesExpanded = !isAddressesExpanded)}
                        aria-expanded={isAddressesExpanded}
                    >
                        <strong class="text-xl font-commissioner mb-2">Addresses</strong>
                        <i class={isAddressesExpanded ? "fa-solid fa-minus fa-lg" : "fa-solid fa-plus fa-lg"} style="color: #262625;"></i>
                    </button>
                    {#if isAddressesExpanded}
                        <div transition:slide={{ duration: 500, easing: cubicInOut }}>
                            <div class="flex justify-end mt-4">
                                <Button
                                    color="light"
                                    class="bg-tertiary! hover:bg-accent! text-accent! hover:text-tertiary! font-commissioner text-l rounded-none transition-colors duration-200"
                                    on:click={() => {
                                        selectedAddress = null;
                                        showAddressForm = !showAddressForm;
                                    }}
                                >
                                    {showAddressForm ? 'Cancel' : 'Add New Address'}
                                </Button>
                            </div>
                            {#if showAddressForm}
                                <div class="mt-4">
                                    <AddressForm  action="?/submitAddress" initialAddress={selectedAddress} />
                                </div>
                            {/if}
                            {#if data.addresses && data.addresses.length > 0}
                                <div class="space-y-4 mt-2">
                                    {#each data.addresses as address}
                                        <div class="border rounded-lg p-4 bg-background">
                                            <div class="flex justify-between">
                                                <div>
                                                    <p>{address.address_line_1}</p>
                                                    {#if address.address_line_2}
                                                        <p>{address.address_line_2}</p>
                                                    {/if}
                                                    <p>{address.city}</p>
                                                    <p>{address.country}</p>
                                                    <p>{address.postcode}</p>
                                                    {#if address.address_notes}
                                                        <p class="mt-2 text-sm italic">{address.address_notes}</p>
                                                    {/if}
                                                </div>
                                                <Button
                                                    color="light"
                                                    class="bg-accent! hover:bg-tertiary! text-text-colour! hover:text-accent! font-commissioner text-l rounded-none transition-colors duration-200 h-fit"
                                                    on:click={() => handleAddressDelete(address)}
                                                >
                                                    Delete
                                                </Button>
                                            </div>
                                        </div>
                                    {/each}
                                </div>
                            {:else}
                                <p class="text-gray-600">No address added</p>
                            {/if}
                        </div>
                    {/if}
                </div>
            </div>

            <div class="border-b pb-4">
                <button
                    type="button"
                    class="flex justify-between items-center w-full"
                    on:click={() => isSubscriptionsExpanded = !isSubscriptionsExpanded}
                    on:keydown={(e) => e.key === 'Enter' && (isSubscriptionsExpanded = !isSubscriptionsExpanded)}
                    aria-expanded={isSubscriptionsExpanded}
                >
                    <strong class="text-xl font-commissioner mb-2">Your Subscriptions</strong>
                    <i class={isAddressesExpanded ? "fa-solid fa-minus fa-lg" : "fa-solid fa-plus fa-lg"} style="color: #262625;"></i>
                </button>
                {#if isSubscriptionsExpanded}
                    <div transition:slide={{ duration: 500, easing: cubicInOut }}>
                        {#if data.subscriptions && data.subscriptions.length > 0}
                            <div class="space-y-4">
                                {#each data.subscriptions as subscription}
                                    <div class="border rounded-lg p-4 bg-background">
                                        <div class="flex justify-between">
                                            <div class="w-full">
                                                <p><strong>Plan:</strong> {subscription.plan_name}</p>
                                                <p><strong>Status:</strong> {subscription.status}</p>
                                                <p><strong>Cost:</strong> {formatCurrency(subscription.monthly_cost)}</p>
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
                                                            class="mt-2 bg-tertiary! hover:bg-accent! text-accent! hover:text-tertiary! font-commissioner text-l rounded-none transition-colors duration-200"
                                                            on:click={() => selectingAddressFor = subscription}
                                                        >
                                                            Change Address
                                                        </Button>
                                                    </div>
                                                {:else}
                                                    <div class="mt-2">
                                                        <p class="text-sm italic mb-2">No delivery address specified</p>
                                                        <Button
                                                            color="light"
                                                            class="bg-accent! hover:bg-tertiary! text-text-colour! hover:text-accent! font-commissioner text-l rounded-none transition-colors duration-200"
                                                            on:click={() => selectingAddressFor = subscription}
                                                        >
                                                            Select Address
                                                        </Button>
                                                    </div>
                                                {/if}

                                                {#if selectingAddressFor?.id === subscription.id}
                                                    <div class="mt-4 border-t pt-4">
                                                        <p class="font-commissioner mb-2">Select a delivery address:</p>
                                                        <div class="space-y-2">
                                                            {#each data.addresses as address}
                                                                <button
                                                                    class="w-full p-2 text-left border rounded hover:bg-accent hover:text-text-colour transition-colors duration-200"
                                                                    on:click={() => handleAddressAssign(subscription, address)}
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
                                                            class="mt-2 w-full bg-gray-200 hover:bg-gray-300 text-gray-700 font-commissioner text-l rounded-none"
                                                            on:click={() => selectingAddressFor = null}
                                                        >
                                                            Cancel
                                                        </Button>
                                                    </div>
                                                {/if}
                                            </div>
                                        </div>
                                    </div>
                                {/each}
                            </div>
                        {:else}
                            <div class="text-center py-4">
                                <p class="text-gray-600 mb-4">You don't have any active subscriptions.</p>
                                <Button 
                                    href="/subscribe"
                                    class="bg-primary! hover:bg-accent! text-text-colour! hover:text-primary! font-commissioner text-l rounded-none transition-colors duration-200"
                                >
                                    Start a subscription
                                </Button>
                            </div>
                        {/if}
                    </div>
                {/if}
            </div>

            <div class="flex justify-end">
                <SignOutForm />
            </div>
        </div>
    </div>
</div>