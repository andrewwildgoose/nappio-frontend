<script lang="ts">
    import { page } from "$app/state";
    import { goto } from '$app/navigation';
    import { enhance, applyAction } from '$app/forms';
    import type { SubmitFunction } from '@sveltejs/kit';
    import { Button, Input, Label, Alert, Spinner, P } from 'flowbite-svelte';
    import SubscriptionAddress from './SubscriptionAddress.svelte';
    import type { AddressFormData } from '$lib/types/address';

    // Auth check
    let isSignedIn = $derived(() => page.data.user != null);

    console.log('User data in Subscription Flow:', page.data.user != null);

    // export let priceId: string;
    
    // Flow state management
    let currentStep = $state(0);
    let previousStepValue = $state(0);
    let isSubmitting = $state(false);
    let error = $state<string | null>(null);

    // Track direction for animation
    $effect(() => {
        previousStepValue = currentStep;
    });

    // Form data
    let babyBirthdate = $state('');
    let babyWeight = $state(0);
    let wantNappyWraps = $state(false);
    let address = $state<AddressFormData>({} as AddressFormData);

    // Valid service area postcodes
    const validPostcodes = ['SW2', 'SW4', 'SW8', 'SW9'];
    
    // Format and validate postcode
    function isValidServiceArea(postcode: string): boolean {
        if (!postcode) return false;
        const formattedPostcode = postcode.replace(/\s+/g, '').toUpperCase();
        return validPostcodes.some(validCode => 
            formattedPostcode.startsWith(validCode.replace(/\s+/g, ''))
        );
    }

    // Step validation
    let canProceed = $derived<Record<number, boolean>>({
        0: isSignedIn(), // Info step always valid
        1: isSignedIn() && Boolean(babyBirthdate) && babyWeight > 0,
        2: isSignedIn(), // Nappy wraps selection always valid
        3: isSignedIn() && Boolean(address.postcode) && isValidServiceArea(address.postcode) // Check if postcode is in service area
    });

    // Function to handle auth redirect
    function goToSignIn() {
        goto('/signin?redirect=/subscribe');
    }

    const steps = [
        { title: '1. Welcome to Nappio', component: 'InfoStep' },
        { title: '2. About Your Baby', component: 'BabyDetailsStep' },
        { title: '3. Additional Items', component: 'NappyWrapStep' },
        { title: '4. Delivery Address', component: 'AddressStep' }
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
    class="max-w-3xl mx-auto p-4 m-4">
    <input type="hidden" name="babyBirthdate" value={babyBirthdate}>
    <input type="hidden" name="babyWeight" value={babyWeight}>
    <input type="hidden" name="wantNappyWraps" value={wantNappyWraps}>
    <input type="hidden" name="address" value={JSON.stringify(address)}>
    <!-- Progress indicator -->
    <div class="mb-8">
        <!-- Step titles - visible on md screens -->
        <div class="hidden md:flex justify-between w-full mb-2">
            {#each steps as step, index}
                <div class="w-full text-center">
                    <span class={`text-md font-commissioner font-bold p-2 ${index === currentStep ? 'text-text-colour' : 'text-stone-500'}`}>
                        {step.title}
                    </span>
                </div>
            {/each}
        </div>
        
        <!-- Progress bar -->
        <div class="relative w-full h-2 bg-primary overflow-hidden">
            <div 
                class="absolute left-0 top-0 h-full bg-tertiary transition-all duration-500 ease-in-out"
                style="width: {((currentStep + 1) / steps.length) * 100}%"
            ></div>
        </div>
    </div>



    <!-- Step content -->
    <div class="mb-8">
        {#if currentStep === 0}
            <!-- Info Step -->
            <div class="text-center text-text-colour">
                <h2 class="text-4xl font-ranchers mb-4">Welcome to Nappio!</h2>
                <p class="mb-4">We're excited to get you started with our nappy service.</p>
                <div class="p-6 bg-primary border-1 border-text-colour">
                    <p class="font-commissioner text-2xl">Our subscription includes</p>
                        <div class="grid grid-cols-1 md:grid-cols-4 gap-4 p-6">
                            <div class="bg-background p-6 shadow-sm border-1 border-text-colour">
                                <div class="flex flex-col items-center text-center">
                                    <i class="fa-solid fa-baby text-3xl mb-4" style="color: #262625;"></i>
                                    <p class="font-medium">Weekly delivery of clean nappies</p>
                                </div>
                            </div>

                            <div class="bg-background p-6 shadow-sm border-1 border-text-colour">
                                <div class="flex flex-col items-center text-center">
                                    <i class="fa-solid fa-bicycle text-3xl mb-4" style="color: #262625;"></i>
                                    <p class="font-medium">Collection of used nappies</p>
                                </div>
                            </div>

                            <div class="bg-background p-6 shadow-sm border-1 border-text-colour">
                                <div class="flex flex-col items-center text-center">
                                    <i class="fa-solid fa-soap text-3xl mb-4" style="color: #262625;"></i>
                                    <p class="font-medium">Professional cleaning service</p>
                                </div>
                            </div>

                            <div class="bg-background p-6 shadow-sm border-1 border-text-colour">
                                <div class="flex flex-col items-center text-center">
                                    <i class="fa-solid fa-leaf text-3xl mb-4" style="color: #262625;"></i>
                                    <p class="font-medium">Environmentally friendly solution</p>
                                </div>
                            </div>
                        </div>


                </div>
                <div class="p-6 bg-accent2 border-1 border-t-0 border-text-colour">
                    <p class="font-commissioner text-2xl">Pricing Details</p>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 p-6">
                        <div class="bg-background p-6 shadow-sm border-1 border-text-colour">
                            <div class="flex flex-col items-center text-center">
                                <p>
                                    To get started, there's a one-off setup cost of <strong>£50</strong>, which covers everything you need to get started.
                                </p>
                            </div>
                        </div>
                        <div class="bg-background p-6 shadow-sm border-1 border-text-colour">
                            <div class="flex flex-col items-center text-center">
                                <p>
                                    After that, it's just <strong>£20 per week</strong>, paid on our collection/delivery day (Tuesday) — less than the cost of a night out!
                                </p>
                            </div>
                        </div>
                    </div>

                </div>
                {#if !isSignedIn()}
                    <div class="p-8">
                        <div class="mt-4 p-6 bg-primary border-2 border-accent shadow-md">
                            <p class=" mb-2">
                                You'll need to set up your account with us before starting your subscription.
                            </p>
                            <Button
                                on:click={goToSignIn}
                                class="bg-tertiary! hover:bg-accent! text-text-colour! rounded-none"
                            >
                                Sign in or Register
                            </Button>
                        </div>                    
                    </div>

                {/if}
            </div>

        {:else if currentStep === 1}
            <!-- Baby Details Step -->
            <div class="space-y-4 items-center text-center">
                <h2 class="text-4xl font-ranchers mb-4">Tell us about your baby</h2>
                <p class="mb-4">We use this information to make sure your baby gets the most appropriate size of nappies and to help identify when they outgrow them.</p>

                <div class="h-48 flex flex-col md:flex-row items-center justify-center gap-2 bg-primary border-1 border-text-colour mb-0">
                    <Label class="pt-12 md:pt-0 md:pl-6 flex-1 font-commissioner text-bottom text-left text-xl text-text-colour" for="birthdate">Baby's Birth Date</Label>
                    <Input
                        type="date"
                        id="birthdate"
                        bind:value={babyBirthdate}
                        required
                        class="pl-6 flex-1 h-full bg-secondary! rounded-none max-w-xs text-left text-2xl border-none mx-auto text-text-colour"
                    />
                </div>

                <div class="h-48 flex flex-col md:flex-row items-center justify-center gap-2 bg-accent2 border-1 border-text-colour border-t-0">
                    <Label class="pt-12 md:pt-0 md:pl-6 flex-1 font-commissioner text-bottom text-left text-xl text-text-colour" for="weight">Approximate Weight (kg)</Label>
                    <Input
                        type="number"
                        id="weight"
                        bind:value={babyWeight}
                        min="0.1"
                        step="0.1"
                        required
                        class="pl-6 flex-1 h-full bg-secondary! rounded-none max-w-xs text-left text-2xl border-none mx-auto text-text-colour [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none [-moz-appearance:textfield]"
                    />
                </div>
            </div>

        {:else if currentStep === 2}
            <!-- Nappy Wraps Step -->
            <div class="space-y-8 items-center text-center">
                <h2 class="text-4xl font-ranchers mb-4">Would you like to rent nappy wraps?</h2>
                <p class="mb-4 max-w-2xl mx-auto">Nappy wraps are the waterproof outer layer that keep your baby's clothes dry. We can include them in your subscription for <strong>£2 per week</strong>.</p>

                <div class="h-96 grid grid-cols-1 md:grid-cols-2 max-w-4xl mx-auto border-1 border-text-colour">
                    <Button
                        class={`group p-6 ${wantNappyWraps ? 'bg-tertiary border-6 border-accent2' : 'bg-primary border-2 border-primary hover:bg-accent2 hover:border-accent2'} shadow-md hover:shadow-lg transition-all rounded-none min-h-[300px] flex flex-col items-center justify-center gap-4`}
                        on:click={() => wantNappyWraps = true}
                    >
                        <div class="h-64 w-full overflow-hidden mb-4">
                            <img 
                                src="/images/Nappy stock image 2 - Edited Cropped.JPG"
                                alt="Nappy wraps with stars pattern"
                                class="w-full h-full object-cover"
                            />
                        </div>
                        <span class={`font-commissioner text-text-colour ${wantNappyWraps ? 'text-xl' : 'text-xl'}`}>
                            Yes, include wraps
                        </span>
                        <p class="mt-2 text-sm text-text-colour">(+£2/week)</p>
                    </Button>

                    <Button
                        class={`p-6 ${!wantNappyWraps ? 'bg-tertiary border-6 border-accent2 shadow-sm' : 'bg-primary border-2 border-primary hover:bg-accent2 hover:border-accent2 shadow-lg'} hover:shadow-xl transition-all rounded-none min-h-[300px] flex flex-col items-center justify-center gap-4`}
                        on:click={() => wantNappyWraps = false}
                    >
                        <div class="h-64 relative w-full overflow-hidden mb-4">
                            <img 
                                src="/images/Nappy stock image 2 - Edited Cropped.JPG"
                                alt="Nappy wraps with stars pattern"
                                class="w-full h-full object-cover grayscale opacity-50"
                            />
                            <div class="absolute inset-0 flex items-center justify-center">
                                <i class="fa-solid fa-ban fa-4x" style="color: #f7b6af;"></i>
                            </div>
                        </div>

                        <span class={`font-commissioner text-text-colour ${!wantNappyWraps ? 'text-xl' : 'text-xl'}`}>
                            No, thanks
                        </span>
                        <p class="mt-2 text-sm text-text-colour">I'll provide my own wraps</p>                            

                    </Button>
                </div>
            </div>

        {:else if currentStep === 3}
            <!-- Address Step -->
            <div class="space-y-8 items-center text-center">
                <h2 class="text-4xl font-ranchers mb-4">Where will we be delivering to?</h2>
                <p class="mb-4 max-w-2xl mx-auto">Let us know your main delivery address, this is where we'll hold your introductory session and your subsequent collections and deliveries.<br>You can also add notes about your delivery preferences.</p>
            </div>
            <SubscriptionAddress bind:address />
            
        {/if}
    </div>

    {#if currentStep === 3 && !canProceed[currentStep]}
        <div class="flex justify-center mb-4">
            <div class="bg-primary p-3 border-2 border-accent shadow-md max-w-lg mx-auto text-center">
                <p class="text-sm font-medium">
                    {#if !isValidServiceArea(address.postcode)}
                        <i class="fa-solid fa-location-dot mr-2" style="color: #7cc4a7;"></i>
                        Our service is currently available in: <span class="font-ranchers">{validPostcodes.join(', ')}</span>
                    {/if}
                </p>
            </div>
        </div>
    {/if}

    <!-- Navigation buttons -->
    <div class="flex space-x-2 justify-between mt-8">
        <Button
            on:click={previousStep}
            disabled={currentStep === 0}
            class="bg-tertiary! hover:bg-accent! text-text-colour rounded-none shadow-md hover:shadow-lg transition-shadow"
        >
            Previous
        </Button>

        {#if currentStep === steps.length - 1}
            <div class="flex-col items-end">
                <Button
                    type="submit"
                    disabled={isSubmitting || !canProceed[currentStep]}
                    class={`${!canProceed[currentStep] ? 'opacity-50 cursor-not-allowed' : ''} bg-tertiary! hover:bg-accent! text-text-colour rounded-none shadow-md hover:shadow-lg transition-shadow`}
                >
                    {#if isSubmitting}
                        <Spinner class="mr-2" />
                        Processing...
                    {:else}
                        Complete Subscription
                    {/if}
                </Button>
            </div>
        {:else}
            {#if !isSignedIn()}
                <Button
                    on:click={goToSignIn}
                    class="bg-tertiary! hover:bg-accent! text-text-colour rounded-none shadow-md hover:shadow-lg transition-shadow"
                >
                    Sign in to Continue
                </Button>
            {:else}
                <Button
                    on:click={nextStep}
                    disabled={!canProceed[currentStep]}
                    class="bg-tertiary! hover:bg-accent! text-text-colour rounded-none shadow-md hover:shadow-lg transition-shadow"
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