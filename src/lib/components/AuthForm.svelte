<script lang="ts">
    import { Button, Input, Alert, Label, Spinner } from 'flowbite-svelte';
    import { enhance } from '$app/forms';
    import { slide } from 'svelte/transition';

    interface FormData {
        error?: string;
        message?: string;
        email?: string;
        first_name?: string;
        surname?: string;
        postcode?: string;
        success?: boolean;
        data?: {
            success: boolean;
            message?: string;
        };
        invalidCredentials?: boolean;
    }
    
    export let form: FormData | null = null;
    let isSubmitting = false;
    let isSignUp = false;

    function handleSubmit() {
        isSubmitting = true;
        return async ({ result }) => {
            try {
                if (result.type === 'redirect') {
                    return; // Let SvelteKit handle the redirect
                }
                
                if (result.type === 'success' && result.data?.success) {
                    const urlParams = new URLSearchParams(window.location.search);
                    const redirectUrl = urlParams.get('redirect') || '/dashboard';
                    window.location.href = redirectUrl;
                } else if (result.type === 'failure') {
                    form = {
                        error: result.data?.error || 'An error occurred',
                        invalidCredentials: result.status === 400,
                        email: result.data?.email
                    };
                }
            } finally {
                isSubmitting = false;
            }
        };
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
        method="POST" 
        action="?/auth" 
        class="space-y-4" 
        use:enhance={handleSubmit}
    >
        {#if isSignUp}
            <div class="w-full sm:w-96 mb-6 px-0" transition:slide={{ duration: 300 }}>
                <Label for="first-name-input" class="block mb-2 font-commissioner text-xl text-text-colour!">
                    First Name
                </Label>
                <Input
                    id="first-name-input"
                    name="first_name"
                    type="text"
                    required
                    value={form?.first_name ?? ''}
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
                    name="surname"
                    type="text"
                    required
                    value={form?.surname ?? ''}
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
                    name="postcode"
                    type="text"
                    required
                    value={form?.postcode ?? ''}
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
                name="email"
                type="email"
                required
                value={form?.email ?? ''}
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
                name="password"
                type="password"
                required
                class="bg-secondary! border-solid border-2 border-accent! rounded-none"
                disabled={isSubmitting}
                placeholder="••••••••"
            />
        </div>

        <input type="hidden" name="type" value={isSignUp ? 'signup' : 'signin'} />

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

    {#if form?.error}
        <Alert color="dark" rounded={false} class="flex justify-center mb-4 bg-primary!">
            {form.error}
        </Alert>
        {#if form?.invalidCredentials}
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
    
    {#if form?.message}
        <Alert color="dark" rounded={false} class="flex justify-center mb-4 bg-tertiary!">
            {form.message}
        </Alert>
    {/if}
</div>