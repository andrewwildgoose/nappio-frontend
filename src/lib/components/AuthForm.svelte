<script lang="ts">
    import { Button, Input, Alert, Label, Spinner } from 'flowbite-svelte';
    import { enhance } from '$app/forms';

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
                    if (result.data.message) {
                        form = result.data;
                    } else {
                        window.location.href = '/dashboard';
                    }
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

<div class="flex flex-col space-y-4 w-full max-w-md mx-auto p-2 md:p-8">
    <div class="w-full flex justify-center mb-6">
        <Button
            color="light"
            class="w-32 {!isSignUp ? 'bg-tertiary! text-accent! text-xl' : 'bg-accent! text-tertiary! text-l'} rounded-none focus:ring-0"
            on:click={() => isSignUp = false}
        >
            Sign In
        </Button>
        <Button
            color="light"
            class="w-32 {isSignUp ? 'bg-tertiary! text-accent! text-xl' : 'bg-accent! text-tertiary! text-l'} rounded-none focus:ring-0 border-l-0"
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
            <div class="w-full sm:w-96 mb-6 px-0">
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

            <div class="w-full sm:w-96 mb-6 px-0">
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

            <div class="w-full sm:w-96 mb-6 px-0">
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
                class="bg-tertiary! hover:bg-accent! text-accent! hover:text-tertiary! font-commissioner text-3xl rounded-none transition-colors duration-200" 
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
        <Alert color="red" class="flex justify-center mb-4">
            {form.error}
        </Alert>
        {#if form?.invalidCredentials}
            <div class="flex flex-col items-center space-y-2 text-sm">
                <p>Would you like to:</p>
                <div class="flex space-x-4">
                    <Button
                        color="light"
                        size="sm"
                        on:click={() => {
                            isSignUp = true;
                            form = { email: form?.email };
                        }}
                    >
                        Create an account
                    </Button>
                    <Button
                        color="light"
                        size="sm"
                        href="/reset-password"
                    >
                        Reset password
                    </Button>
                </div>
            </div>
        {/if}
    {/if}
    
    {#if form?.message}
        <Alert color="green" class="flex justify-center mb-4">
            {form.message}
        </Alert>
    {/if}
</div>