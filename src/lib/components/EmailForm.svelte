<script>
    import { Label, Input, Button, Spinner } from 'flowbite-svelte';
    import { ArrowRightOutline } from 'flowbite-svelte-icons';
    import { enhance } from '$app/forms';
    import { goto } from '$app/navigation';

    export let form; // This will receive form data and errors from the server
    let isSubmitting = false;

    function handleSubmit() {
        isSubmitting = true;
        return async ({ result }) => {
            try {
                if (result.type === 'success' && result.data?.success) {
                    await goto(`/success?email=${encodeURIComponent(result.data.email)}`);
                } else if (result.type === 'failure') {
                    await goto(`/error?message=${encodeURIComponent(result.data?.error)}&email=${encodeURIComponent(result.data?.email)}`);
                }
            } finally {
                isSubmitting = false;
            }
        };
    }
</script>

<div class="flex flex-col items-center justify-center md:m-5 w-full sm:max-w-screen-sm">
    <form 
        method="POST" 
        action="?/subscribe" 
        class="flex flex-col items-center justify-center md:w-full max-w-screen-sm"
        use:enhance={handleSubmit}
    >
        <div class="w-full sm:w-96 mb-6 px-2 sm:px-0">
            <Label for="first_name-input" class="block mb-2 font-commissioner text-xl text-text-colour!">
                Enter your first name
            </Label>
            <Input 
                id="first_name-input"
                name="first_name"
                required
                value={form?.first_name ?? ''}
                class="bg-secondary! border-solid border-2 border-accent! rounded-none" 
                size="lg" 
                placeholder="Type your first name here" 
            />
        </div>        
        <div class="w-full sm:w-96 mb-6 px-2 sm:px-0">
            <Label for="email-input" class="block mb-2 font-commissioner text-xl text-text-colour!">
                Enter your email address
            </Label>
            <Input 
                id="email-input"
                name="email"
                type="email"
                required
                value={form?.email ?? ''}
                class="bg-secondary! border-solid border-2 border-accent! rounded-none" 
                size="lg" 
                placeholder="register@your-interest.nappies" 
            />
        </div>

        <div class="w-full sm:w-96 mb-6 px-2 sm:px-0">
            <Label for="postcode-input" class="block mb-2 font-commissioner text-xl text-text-colour!">
                Enter your postcode area (first 3-4 letters)
            </Label>
            <p class="text-sm pb-3">We ask for the first half of your postcode in order to determine where to expand to next.</p>
            <Input 
                id="postcode-input"
                name="postcode"
                required
                maxlength=4
                value={form?.postcode ?? ''}
                class="bg-secondary! border-solid border-2 border-accent! rounded-none" 
                size="lg" 
                placeholder="SW2" 
            />
        </div>

        <Button 
            type="submit" 
            class="bg-tertiary! hover:bg-accent! text-accent! hover:text-tertiary! font-commissioner text-3xl rounded-none transition-colors duration-200" 
            size="lg"
            disabled={isSubmitting}
        >
        {#if isSubmitting}
            <Spinner class="mr-3 w-4 h-4 fill-accent! hover:fill-tertiary!" color="custom" /> Submitting...

        {:else}
            Submit <ArrowRightOutline class="w-5 h-5 ms-2" />
    {/if}
    </Button>
    </form>
</div>