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

<div class="flex flex-col justify-center p-5 w-full items-center">
    <form 
        method="POST" 
        action="?/subscribe" 
        class="flex flex-col items-center justify-center md:w-full "
        use:enhance={handleSubmit}
    >
        <div class="flex flex-col lg:flex-row w-full justify-center items-center lg:items-end">
            <div class="w-full sm:w-96 mb-6 md:m-2 px-2 sm:px-0">
                <Label for="first_name-input" class="block mb-2 font-commissioner text-xl text-text-colour!">
                    First name
                </Label>
                <Input 
                    id="first_name-input"
                    name="first_name"
                    required
                    value={form?.first_name ?? ''}
                    class="bg-secondary! rounded-none shadow-sm border-none" 
                    size="lg" 
                    placeholder="Type your first name here" 
                />
            </div>        
            <div class="w-full sm:w-96 mb-6 md:m-2 px-2 sm:px-0">
                <Label for="email-input" class="block mb-2 font-commissioner text-xl text-text-colour!">
                    Email address
                </Label>
                <Input 
                    id="email-input"
                    name="email"
                    type="email"
                    required
                    value={form?.email ?? ''}
                    class="bg-secondary! rounded-none shadow-sm border-none" 
                    size="lg" 
                    placeholder="register@your-interest.nappies" 
                />
            </div>

            <div class="w-full sm:w-96 mb-6 md:m-2 px-2 sm:px-0">
                <Label for="postcode-input" class="block mb-2 font-commissioner text-xl text-text-colour!">
                    Postcode area (first 3-4 letters)
                </Label>
                <p class="text-sm pb-3">We ask for the first half of your postcode in order to determine where to expand to next.</p>
                <Input 
                    id="postcode-input"
                    name="postcode"
                    required
                    maxlength=4
                    value={form?.postcode ?? ''}
                    class="bg-secondary! rounded-none shadow-sm border-none" 
                    size="lg" 
                    placeholder="SW2" 
                />
            </div>            
        </div>
        

        <Button 
            type="submit" 
            class="mt-4 bg-tertiary! hover:bg-text-colour! text-text-colour hover:text-tertiary font-commissioner text-3xl border-1 border-none rounded-none transition-colors duration-200 shadow-sm items-end" 
            size="lg"
            disabled={isSubmitting}
        >
        {#if isSubmitting}
            <Spinner class="mr-3 w-8 h-8 fill-accent! hover:fill-tertiary!" color="custom" /> Submitting...

        {:else}
            Sign up <ArrowRightOutline class="w-8 h-8 ms-2" />
    {/if}
    </Button>
    </form>
</div>