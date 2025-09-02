<script lang="ts">
    import { page } from "$app/state";
    import { goto } from '$app/navigation';
    import { enhance, applyAction } from '$app/forms';
    import type { ActionResult, SubmitFunction } from '@sveltejs/kit';
    import { Button, Input, Label, Alert, Spinner } from 'flowbite-svelte';
    import SubscriptionAddress from './SubscriptionAddress.svelte';
    import type { AddressFormData } from '$lib/types/address';

    // Auth check
    let isSignedIn = $derived(() => page.data.user != null);

    console.log('User data in Subscription Flow:', page.data.user != null);

    // export let priceId: string;
    
    // Flow state management
    let currentStep = $state(0);
    let isSubmitting = $state(false);
    let error = $state<string | null>(null);

    // Form data
    let babyBirthdate = $state('');
    let babyWeight = $state(0);
    let wantNappyWraps = $state(false);
    let address = $state<AddressFormData>({} as AddressFormData);

    // Step validation
    let canProceed = $derived<Record<number, boolean>>({
        0: isSignedIn(), // Info step always valid
        1: isSignedIn() && Boolean(babyBirthdate) && babyWeight > 0,
        2: isSignedIn(), // Nappy wraps selection always valid
        3: isSignedIn() && Boolean(address.postcode) // Address validation handled by AddressForm
    });

    // Function to handle auth redirect
    function goToSignIn() {
        goto('/signin?redirect=/subscription');
    }

    const steps = [
        { title: 'Welcome to Nappio', component: 'InfoStep' },
        { title: 'About Your Baby', component: 'BabyDetailsStep' },
        { title: 'Additional Items', component: 'NappyWrapStep' },
        { title: 'Delivery Address', component: 'AddressStep' }
    ];

    const handleEnhanceSubmit: SubmitFunction = ({ formElement, formData, action, cancel }) => {
        // Validate before submission
        if (!canProceed[currentStep]) {
            cancel();
            error = 'Please complete all required fields';
            return;
        }

        isSubmitting = true;
        error = null;

        return async ({ result }) => {
            try {
                if (result.type === 'success' && result.data) {
                    const { checkout_url } = result.data;
                    if (checkout_url) {
                        window.location.href = checkout_url;
                        return;
                    }
                } else if (result.type === 'error') {
                    error = result.error.message;
                } else if (result.type === 'failure') {
                    error = result.data?.error || 'Subscription creation failed';
                }
                
                // Apply the action result to update the form state
                await applyAction(result);
            } catch (e) {
                error = e instanceof Error ? e.message : 'An unexpected error occurred';
            } finally {
                isSubmitting = false;
            }
        };
    };

    function nextStep() {
        if (currentStep < steps.length - 1 && canProceed[currentStep]) {
            currentStep++;
        }
    }

    function previousStep() {
        if (currentStep > 0) {
            currentStep--;
        }
    }
</script>

<form
    method="POST"
    action="?/createSubscription"
    use:enhance={handleEnhanceSubmit}
    class="max-w-2xl mx-auto p-4">
    <input type="hidden" name="babyBirthdate" value={babyBirthdate}>
    <input type="hidden" name="babyWeight" value={babyWeight}>
    <input type="hidden" name="wantNappyWraps" value={wantNappyWraps}>
    <input type="hidden" name="address" value={JSON.stringify(address)}>
    <!-- Progress indicator -->
    <div class="mb-8">
        <div class="flex justify-between">
            {#each steps as step, index}
                <div class="flex flex-col items-center">
                    <div class={`w-8 h-8 rounded-full flex items-center justify-center 
                        ${index <= currentStep ? 'bg-tertiary text-accent' : 'bg-gray-200'}`}>
                        {index + 1}
                    </div>
                    <span class="text-sm mt-2">{step.title}</span>
                </div>
            {/each}
        </div>
    </div>

    <!-- Step content -->
    <div class="mb-8">
        {#if currentStep === 0}
            <!-- Info Step -->
            <div class="text-center">
                <h2 class="text-3xl font-ranchers mb-4">Welcome to Nappio!</h2>
                <p class="mb-4">We're excited to get you started with our eco-friendly nappy service.</p>
                <p>Our subscription includes:</p>
                <ul class="list-disc text-left pl-8 mb-4">
                    <li>Weekly delivery of clean nappies</li>
                    <li>Collection of used nappies</li>
                    <li>Professional cleaning service</li>
                    <li>Environmentally friendly solution</li>
                </ul>
                <p class="mb-4">
                    To get started, there's a one-off setup cost of <strong>£50</strong>, which covers everything you need to get started.
                    <br>
                    After that, it's just <strong>£20 per week</strong>, paid on our collection/delivery day (Tuesday) — less than the cost of a night out!
                </p>
                {#if !isSignedIn()}
                    <div class="mt-8 p-4 bg-secondary border-2 border-accent">
                        <p class="text-lg mb-2">
                            You'll need to set up your account with us before starting your subscription.
                        </p>
                        <Button
                            on:click={goToSignIn}
                            class="bg-tertiary! hover:bg-accent! text-accent! hover:text-tertiary! rounded-none"
                        >
                            Sign in or Register
                        </Button>
                    </div>
                {/if}
            </div>

        {:else if currentStep === 1}
            <!-- Baby Details Step -->
            <div class="space-y-4">
                <h2 class="text-2xl font-ranchers mb-4">Tell us about your baby</h2>
                <p class="mb-4">We use this information to make sure your baby gets the most appropriate size of nappies and to help identify when they outgrow them.</p>

                <div>
                    <Label for="birthdate">Baby's Birth Date</Label>
                    <Input
                        type="date"
                        id="birthdate"
                        bind:value={babyBirthdate}
                        required
                        class="bg-secondary! border-solid border-2 border-accent! rounded-none"
                    />
                </div>

                <div>
                    <Label for="weight">Approximate Weight (kg)</Label>
                    <Input
                        type="number"
                        id="weight"
                        bind:value={babyWeight}
                        min="0"
                        step="0.1"
                        required
                        class="bg-secondary! border-solid border-2 border-accent! rounded-none"
                    />
                </div>
            </div>

        {:else if currentStep === 2}
            <!-- Nappy Wraps Step -->
            <div>
                <h2 class="text-2xl font-ranchers mb-4">Would you like to rent nappy wraps?</h2>
                <p class="mb-4">Nappy wraps are the waterproof outer layer that keep your baby's clothes dry. We can include them in your subscription for <strong>£2 per week</strong> .</p>

                <div class="flex gap-4 justify-center">
                    <Button
                        class={`${wantNappyWraps ? 'bg-tertiary! text-accent!' : 'bg-gray-200'}`}
                        on:click={() => wantNappyWraps = true}
                    >
                        Yes, include wraps
                    </Button>
                    <Button
                        class={`${!wantNappyWraps ? 'bg-tertiary! text-accent!' : 'bg-gray-200'}`}
                        on:click={() => wantNappyWraps = false}
                    >
                        No, thanks
                    </Button>
                </div>
            </div>

        {:else if currentStep === 3}
            <!-- Address Step -->
            <SubscriptionAddress bind:address />
        {/if}
    </div>

    <!-- Navigation buttons -->
    <div class="flex justify-between mt-8">
        <Button
            on:click={previousStep}
            disabled={currentStep === 0}
            class="bg-tertiary! hover:bg-accent! text-accent! hover:text-tertiary! rounded-none"
        >
            Previous
        </Button>

        {#if currentStep === steps.length - 1}
            <Button
                type="submit"
                disabled={isSubmitting || !canProceed[currentStep]}
                class="bg-tertiary! hover:bg-accent! text-accent! hover:text-tertiary! rounded-none"
            >
                {#if isSubmitting}
                    <Spinner class="mr-2" />
                    Processing...
                {:else}
                    Complete Subscription
                {/if}
            </Button>
        {:else}
            {#if !isSignedIn()}
                <Button
                    on:click={goToSignIn}
                    class="bg-tertiary! hover:bg-accent! text-accent! hover:text-tertiary! rounded-none"
                >
                    Sign in to Continue
                </Button>
            {:else}
                <Button
                    on:click={nextStep}
                    disabled={!canProceed[currentStep]}
                    class="bg-tertiary! hover:bg-accent! text-accent! hover:text-tertiary! rounded-none"
                >
                    Next
                </Button>
            {/if}
        {/if}
    </div>

    {#if error}
        <Alert color="red" class="mt-4">
            {error}
        </Alert>
    {/if}
</form>