<script lang="ts">
    import type { Plan } from '$lib/types/plans';
    import { Button } from 'flowbite-svelte';
    import { goto } from '$app/navigation';
    // import type { PageData } from './$types';
    import AddressForm from '$lib/components/AddressForm.svelte';

    // export let data: PageData;

    export let plans: Plan[] = [];
    export let error: string | null = null;

    //variable for loading state
    let isLoading = false;

    //variables for the details form
    let showDetailsForm = false;
    let selectedPlanId: string | null = null;
    let isSubmitting = false;

    let addressFormData = {}; // Collect address fields here


    // Called when user clicks Subscribe
    function openDetailsForm(planId: string | null) {
        if (!planId) {
            console.error('No plan ID provided');
            return;
        } else {
            selectedPlanId = planId;
            showDetailsForm = true;
        }
    }

    // // Called when user clicks "Continue to Checkout"
    // function handleContinueToCheckout() {
    //     // Create a form programmatically
    //     const form = document.createElement('form');
    //     form.method = 'POST';
    //     form.action = '?/subscribe';

    //     // Add hidden inputs for address fields
    //     for (const [key, value] of Object.entries(addressFormData)) {
    //         const input = document.createElement('input');
    //         input.type = 'hidden';
    //         input.name = key;
    //         input.value = value ?? '';
    //         form.appendChild(input);
    //     }

    //     // Add phone and priceId
    //     const phoneInput = document.createElement('input');
    //     phoneInput.type = 'hidden';
    //     phoneInput.name = 'phone';
    //     phoneInput.value = phone;
    //     form.appendChild(phoneInput);

    //     const priceIdInput = document.createElement('input');
    //     priceIdInput.type = 'hidden';
    //     priceIdInput.name = 'priceId';
    //     priceIdInput.value = selectedPlanId ?? '';
    //     form.appendChild(priceIdInput);

    //     document.body.appendChild(form);
    //     form.submit();
    //     document.body.removeChild(form);
    // }


    function handleSubscribe() {
        isLoading = true;
        return async ({ result }) => {
            try {
                if (result.type === 'success' && result.data.checkout_url) {
                    window.location.href = result.data.checkout_url;
                } else if (result.type === 'failure') {
                    error = result.data?.error || 'Failed to create checkout session';
                } else if (result.type === 'redirect') {
                    await goto(result.location);
                }
            } finally {
                isLoading = false;
            }
        };
    }

    function formatPrice(price: number): string {
        return `£${(price / 100).toFixed(2)}`;
    }
</script>

<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
    {#if error}
        <div class="col-span-full text-center text-red-500">
            Error: {error}
        </div>
    {:else if plans.length === 0}
        <div class="col-span-full text-center text-text-colour">
            No subscription plans are currently available.
        </div>
    {:else}
        <div class="col-span-full text-center text-text-colour mb-8">
            <div class="text-center text-text-colour mb-8">
                Choose a subscription plan that suits you best.
            </div>
            <div class="overflow-x-auto">
                <table class="w-full">
                    <thead>
                        <tr class="bg-gray-100">
                            <th class="p-4 text-left font-commissioner">Plan Name</th>
                            <th class="p-4 text-left font-commissioner">Description</th>
                            <th class="p-4 text-left font-commissioner">Price</th>
                            <th class="p-4"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {#each plans as plan (plan.id)}
                            <tr class="border-b hover:bg-gray-50">
                                <td class="p-4 font-commissioner text-text-colour">{plan.name}</td>
                                <td class="p-4 text-text-colour text-left">{plan.description}</td>
                                <td class="p-4">{formatPrice(plan.price)}</td>
                                <td class="p-4">
                                    <Button
                                        type="button"
                                        disabled={isLoading}
                                        class="bg-tertiary! hover:bg-accent! text-accent! hover:text-tertiary! font-commissioner rounded-none transition-colors duration-200"
                                        on:click={() => openDetailsForm(plan.stripe_price_id)}
                                    >
                                        Subscribe
                                    </Button>
                                    <!-- <Button
                                        type="button"
                                        disabled={isLoading}
                                        class="bg-tertiary! hover:bg-accent! text-accent! hover:text-tertiary! font-commissioner rounded-none transition-colors duration-200"
                                        on:click={handleSubscribe}
                                    >
                                        Subscribe
                                    </Button> -->
                                </td>
                            </tr>
                        {/each}
                        <!-- {#each plans as plan (plan.id)}
                            <tr class="border-b hover:bg-gray-50">
                                <td class="p-4 font-commissioner text-text-colour">{plan.name}</td>
                                <td class="p-4 text-text-colour text-left">{plan.description}</td>
                                <td class="p-4">{formatPrice(plan.price)}</td>
                                <td class="p-4">
                                    <form 
                                        action="?/subscribe" 
                                        method="POST" 
                                        use:enhance={handleSubscribe}
                                    >
                                        <input type="hidden" name="priceId" value={plan.stripe_price_id}>
                                        <Button
                                            type="submit"
                                            disabled={isLoading}
                                            class="bg-tertiary! hover:bg-accent! text-accent! hover:text-tertiary! font-commissioner rounded-none transition-colors duration-200"
                                        >
                                            {#if isLoading}
                                                Creating checkout...
                                            {:else}
                                                Subscribe
                                            {/if}
                                        </Button>
                                    </form>
                                </td>
                            </tr>
                        {/each} -->
                    </tbody>
                </table>
            </div>
        </div>
    {/if}
    {#if showDetailsForm}
        <div class="fixed inset-0 bg-neutral-500/50 flex flex-col items-center justify-center z-50">
            <div class="bg-background! rounded-lg shadow-lg w-full max-w-md">
                <div class="mt-4">
                    <AddressForm 
                        action='?/handleAddress' 
                        formSubmitButtonText={"Continue to Checkout"}
                        priceId={selectedPlanId}
                        useEnhance={true}
                        onSubmit={async (result) => {
                            console.log(result);
                            if (result.type === 'success' && result.data.checkout_url) {
                                window.location.href = result.data.checkout_url;
                            }
                        }}
                    />
                </div>
                <div class="flex gap-2 items-center justify-center">
                    <Button 
                        type="button"
                        on:click={handleSubscribe}
                        disabled={isSubmitting}
                        class="bg-tertiary! hover:bg-accent! text-accent! hover:text-tertiary! font-commissioner rounded-none transition-colors duration-200"
                    >
                        {#if isSubmitting}Submitting...{:else}Continue to Checkout{/if}
                    </Button>
                    <Button 
                        type="button"
                        class="bg-tertiary! hover:bg-accent! text-accent! hover:text-tertiary! font-commissioner rounded-none transition-colors duration-200"
                        on:click={() => showDetailsForm = false}
                    >
                        Cancel
                    </Button>
                </div>                
            </div>
        </div>
    {/if}
</div>