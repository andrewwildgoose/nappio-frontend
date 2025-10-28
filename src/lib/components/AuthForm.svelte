<script lang="ts">
    import { Button, Input, Alert, Label, Spinner } from 'flowbite-svelte';
    import { slide } from 'svelte/transition';
    import { goto } from '$app/navigation';
    import { supabase } from '$lib/client/supabaseClient';

    let isSubmitting = false;
    let isSignUp = false;
    let error = '';
    let message = '';
    
    // Form fields
    let email = '';
    let password = '';
    let first_name = '';
    let surname = '';
    let postcode = '';

    async function handleSignIn() {
        isSubmitting = true;
        error = '';
        message = '';

        const { error: signInError } = await supabase.auth.signInWithPassword({
            email,
            password
        });

        if (signInError) {
            error = signInError.message;
            isSubmitting = false;
            return;
        }

        // Redirect to dashboard on success
        await goto('/private/dashboard');
        isSubmitting = false;
    }

    async function handleSignUp() {
        isSubmitting = true;
        error = '';
        message = '';

        if (!email || !password || !first_name || !surname || !postcode) {
            error = 'Missing required fields';
            isSubmitting = false;
            return;
        }

        const { error: signUpError } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    first_name,
                    surname,
                    postcode: postcode.toUpperCase()
                },
                emailRedirectTo: `${window.location.origin}/auth/callback`
            }
        });

        if (signUpError) {
            error = signUpError.message;
            isSubmitting = false;
            return;
        }

        // Redirect to success page
        await goto(`/success?type=signup&email=${encodeURIComponent(email)}`);
        isSubmitting = false;
    }

    async function handleSubmit(event: Event) {
        event.preventDefault();
        if (isSignUp) {
            await handleSignUp();
        } else {
            await handleSignIn();
        }
    }
</script>

<div class="flex flex-col space-y-4 w-full max-w-md mx-auto p-2 md:p-8 bg-background/50 p-5 shadow-sm transition-all duration-300 ease-in-out">
    <div class="w-full flex justify-center mb-6">
        <Button
            color="light"
            class="w-32 {!isSignUp ? 'bg-tertiary! text-xl' : 'bg-accent! text-l'} hover:text-xl text-text-colour font-ranchers rounded-none focus:ring-0 border-none p-4 transition-text duration-100"
            on:click={() => isSignUp = false}
        >
            Sign In
        </Button>
        <Button
            color="light"
            class="w-32 {isSignUp ? 'bg-tertiary! text-xl' : 'bg-accent! text-l'} hover:text-xl text-text-colour font-ranchers rounded-none focus:ring-0 border-none p-4 transition-text duration-100"
            on:click={() => isSignUp = true}
        >
            Sign Up
        </Button>
    </div>

    <form 
        onsubmit={handleSubmit}
        class="space-y-4" 
    >
        {#if isSignUp}
            <div class="w-full sm:w-96 mb-6 px-0" transition:slide={{ duration: 300 }}>
                <Label for="first-name-input" class="block mb-2 font-commissioner text-xl text-text-colour!">
                    First Name
                </Label>
                <Input
                    id="first-name-input"
                    bind:value={first_name}
                    type="text"
                    required
                    class="bg-secondary! border-solid border-2 border-accent! rounded-none" 
                    disabled={isSubmitting}
                    placeholder="John"
                />
            </div>

            <div class="w-full sm:w-96 mb-6 px-0" transition:slide={{ duration: 300 }}>
                <Label for="surname-input" class="block mb-2 font-commissioner text-xl text-text-colour!">
                    Surname
                </Label>
                <Input
                    id="surname-input"
                    bind:value={surname}
                    type="text"
                    required
                    class="bg-secondary! border-solid border-2 border-accent! rounded-none" 
                    disabled={isSubmitting}
                    placeholder="Doe"
                />
            </div>

            <div class="w-full sm:w-96 mb-6 px-0" transition:slide={{ duration: 300 }}>
                <Label for="postcode-input" class="block mb-2 font-commissioner text-xl text-text-colour!">
                    Postcode
                </Label>
                <Input
                    id="postcode-input"
                    bind:value={postcode}
                    type="text"
                    required
                    class="bg-secondary! border-solid border-2 border-accent! rounded-none" 
                    disabled={isSubmitting}
                    placeholder="SW1A 1AA"
                />
            </div>
        {/if}

        <div class="w-full sm:w-96 mb-6 px-0">
            <Label for="email-input" class="block mb-2 font-commissioner text-xl text-text-colour!">
                Email address
            </Label>
            <Input
                id="email-input"
                bind:value={email}
                type="email"
                required
                class="bg-secondary! border-solid border-2 border-accent! rounded-none" 
                disabled={isSubmitting}
                placeholder="your.email@here.com"
            />
        </div>
        
        <div>
            <Label for="password-input" class="block mb-2 font-commissioner text-xl text-text-colour!">
                Password
            </Label>
            <Input
                id="password-input"
                bind:value={password}
                type="password"
                required
                class="bg-secondary! border-solid border-2 border-accent! rounded-none"
                disabled={isSubmitting}
                placeholder="••••••••"
            />
        </div>

        <div class="flex justify-center">
            <Button
                type="submit"
                class="bg-tertiary! hover:bg-text-colour! text-text-colour! hover:text-tertiary! font-ranchers text-3xl border-none rounded-none transition-colors duration-200" 
                size="lg"
                disabled={isSubmitting}
            >
                {#if isSubmitting}
                    <Spinner class="mr-3" /> Loading...
                {:else}
                    {isSignUp ? 'Sign Up' : 'Sign In'}
                {/if}
            </Button>
        </div>
    </form>

    {#if error}
        <Alert color="dark" rounded={false} class="flex justify-center mb-4 bg-primary!">
            {error}
        </Alert>
        {#if error.includes('Invalid') || error.includes('credentials')}
            <div class="flex flex-col items-center space-y-2 text-sm">
                <p>If you're unable to log in to your account please contact us on <a 
                    href="mailto:info@nappio.co.uk" 
                    class="text-accent!"
                    onclick={(e) => {
                        e.preventDefault();
                        window.open('mailto:info@nappio.co.uk', '_blank');
                    }}
                >info@nappio.co.uk</a></p>
            </div>
        {/if}
    {/if}
    
    {#if message}
        <Alert color="dark" rounded={false} class="flex justify-center mb-4 bg-tertiary!">
            {message}
        </Alert>
    {/if}
</div>