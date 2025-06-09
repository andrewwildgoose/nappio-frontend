<script lang="ts">
    import type { PageData } from './$types';
    import { Button } from 'flowbite-svelte';
    import { enhance } from '$app/forms';
    import { goto } from '$app/navigation';
    import { handleSignOut } from '$lib/stores/auth';
    import AddressForm from '$lib/components/AddressForm.svelte';

    export let data: PageData;
    let showAddressForm = false;
    let selectedAddress: typeof data.addresses[0] | null = null;

    function handleAddressEdit(address: typeof data.addresses[0]) {
        selectedAddress = address;
        showAddressForm = true;
    }

    async function handleSignoutSubmit() {
        return async () => {
            console.log('Client: Starting signout process');
            try {
                await handleSignOut();
                console.log('Client: Signout successful, redirecting');
                await goto('/signin');
            } catch (error) {
                console.error('Client: Signout error:', error);
            }
        };
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
</script>

<div class="flex flex-col items-center justify-center min-h-screen bg-background p-4">
    <div class="bg-white p-8 rounded-lg shadow-lg max-w-2xl w-full">
        <h1 class="text-3xl font-commissioner mb-6">Welcome, {data.user.first_name}!</h1>
        <div class="space-y-4">
            <div class="border-b pb-4">
                <h2 class="text-xl font-commissioner mb-2">Your Profile</h2>
                <p><strong>Email:</strong> {data.user.email}</p>
                <p><strong>Name:</strong> {data.user.first_name} {data.user.surname}</p>
                <p><strong>Postcode:</strong> {data.user.postcode}</p>
                
                <!-- Add address section here -->
                <div class="mt-4">
                    <div>
                        <strong class="text-xl font-commissioner mb-2">Addresses</strong>
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
                                <AddressForm form={data.form} address={selectedAddress} />
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
                                                on:click={() => handleAddressEdit(address)}
                                            >
                                                Update
                                            </Button>
                                        </div>
                                    </div>
                                {/each}
                            </div>
                        {:else}
                            <p class="text-gray-600">No address added</p>
                        {/if}
                    </div>
                </div>
            </div>

            <div class="border-b pb-4">
                <h2 class="text-xl font-commissioner mb-2">Your Subscriptions</h2>
                {#if data.subscriptions && data.subscriptions.length > 0}
                    <div class="space-y-4">
                        {#each data.subscriptions as subscription}
                            <div class="border rounded-lg p-4 bg-background">
                                <div class="flex justify-between items-center mb-2">
                                    <h3 class="text-lg font-commissioner">{subscription.plan_name}</h3>
                                    <span class="px-3 py-1 rounded-full {subscription.status === 'active' ? 'bg-tertiary text-white' : 'bg-accent text-text-colour'}">
                                        {subscription.status}
                                    </span>
                                </div>
                                <p><strong>Monthly Cost:</strong> {formatCurrency(subscription.monthly_cost)}</p>
                                <p><strong>Start Date:</strong> {formatDate(subscription.start_date)}</p>
                                {#if subscription.next_payment_date}
                                    <p><strong>Next Payment Date:</strong> {formatDate(subscription.next_payment_date)}</p>
                                {/if}
                                {#if subscription.end_date}
                                    <p><strong>End Date:</strong> {formatDate(subscription.end_date)}</p>
                                {/if}
                            </div>
                        {/each}
                    </div>
                {:else}
                    <div class="text-center py-4">
                        <p class="text-gray-600 mb-4">You don't have any active subscriptions.</p>
                        <Button 
                            href="/plans"
                            class="bg-primary! hover:bg-accent! text-text-colour! hover:text-primary! font-commissioner text-l rounded-none transition-colors duration-200"
                        >
                            View Available Plans
                        </Button>
                    </div>
                {/if}
            </div>

            <div class="flex justify-end">
                <form 
                    action="/signin?/auth" 
                    method="POST" 
                    use:enhance={handleSignoutSubmit}
                >
                    <input type="hidden" name="type" value="signout">
                    <Button 
                        type="submit"
                        class="bg-tertiary! hover:bg-accent! text-accent! hover:text-tertiary! font-commissioner text-xl rounded-none transition-colors duration-200"
                    >
                        Sign Out
                    </Button>
                </form>
            </div>
        </div>
    </div>
</div>