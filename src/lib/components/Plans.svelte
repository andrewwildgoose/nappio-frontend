<script lang="ts">
    import { page } from "$app/state";
    import type { Plan } from '$lib/types/plans';
    import { Button } from 'flowbite-svelte';
    import { goto } from '$app/navigation';
    // import type { PageData } from './$types';
    import AddressForm from '$lib/components/AddressForm.svelte';
    
    $: isSignedIn = page.data.user != null;

    // export let data: PageData;

    export let plans: Plan[] = [];
    export let error: string | null = null;

    //variable for loading state
    let isLoading = false;

    //variables for the details form
    let showDetailsForm = false;
    let selectedPlanId: string | null = null;
    let isSubmitting = false;


    // Called when user clicks Subscribe
    function openDetailsForm(planId: string | null) {
        if (!isSignedIn) {
            console.error('User is not signed in');
            goto('/signin');
        } else {
            if (!planId) {
                console.error('No plan ID provided');
                return;
            } else {
                selectedPlanId = planId;
                showDetailsForm = true;
            };          
        };
    };

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
        <div class="col-span-full font-ranchers text-center text-text-colour text-4xl">
            No subscription plans are currently available.
        </div>
    {:else}
        <div class="col-span-full text-center text-text-colour mb-8">
            <div class="text-center font-ranchers text-text-colour text-4xl mb-8">
                Choose a subscription plan that suits you best.
            </div>
            <div class="overflow-x-auto shadow-sm">
                <table class="w-full">
                    <thead>
                        <tr class="bg-primary">
                            <th class="p-4 text-left font-commissioner">Plan Name</th>
                            <th class="p-4 text-left font-commissioner">Description</th>
                            <th class="p-4 text-left font-commissioner">Price</th>
                            <th class="p-4"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {#each plans as plan (plan.id)}
                            <tr class="border-b hover:bg-secondary/50">
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
                                        Choose Plan
                                    </Button>
                                </td>
                            </tr>
                        {/each}
                    </tbody>
                </table>
            </div>
        </div>
    {/if}
    {#if showDetailsForm}
        <div 
            class="fixed inset-0 bg-neutral-500/50 flex flex-col items-center justify-center z-50"
            on:click={() => showDetailsForm = false}
            on:keydown={(e) => e.key === 'Escape' && (showDetailsForm = false)}
            role="dialog"
            aria-modal="true"
            tabindex="-1"
        >
            <div 
                class="bg-background! shadow-lg w-full max-w-md flex flex-col overflow-y-auto"
                on:click|stopPropagation={() => {}}
                on:keydown|stopPropagation={() => {}}
                role="dialog"
                tabindex="0"
            >
                <div class="p-2 md:pr-8 md:pl-8 mt-4 flex flex-col items-center justify-center">
                    <h3 class="pb-2 font-ranchers text-2xl text-black">We're excited to get you started on your 
                        <span>
                            <img 
                                src="/images/logos/Nappio-Colour-Text-NoTag.png" 
                                alt="Nappio"
                                class="h-6 mb-2 inline-block"
                            />
                        </span> 
                    journey!</h3>

                    <p>Before we proceed, please provide your address details for where you want the deliveries and pick ups to be made.</p>
                </div>
                
                <div class="flex">
                    
                    <AddressForm 
                        action='?/handleAddress' 
                        formSubmitButtonText={"Continue to Checkout"}
                        priceId={selectedPlanId}
                        onSubmit={async (result: { type: string; data: { checkout_url?: string } }) => {
                            console.log(result);
                            if (result.type === 'success' && result.data.checkout_url) {
                                window.location.href = result.data.checkout_url;
                            }
                        }}
                    />
                </div>
                <div class="flex gap-2 items-center justify-center mb-4">
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