<script lang="ts">
    import { Button } from 'flowbite-svelte';
    import { ArrowRightOutline } from 'flowbite-svelte-icons';

        // Define the type for `data`
    export let data: {
        email?: string;
        message?: string;
        error?: string;
    };
    console.log('Email:', data.email);
</script>

<div class="flex flex-col items-center justify-center h-screen bg-background text-text-colour">
    {#if data.error}
        <h1 class="text-3xl font-commissioner mb-4">Verification Failed</h1>
        <p class="text-lg">{data.error}</p>
    {:else}
    <div class="flex flex-col items-center justify-center">
        <h1 class="text-3xl font-commissioner mb-4">Email Verified</h1>
        <p class="mt-4 font-commissioner">Your email has been successfully verified: <strong>{data.email}</strong><br>You're now ready to stay updated and enjoy all the benefits of our service. Got questions? We're here to help!</p>
        <a href="mailto:info@nappio.co.uk" class="text-primary underline font-commissioner">Contact us at info@nappio.co.uk</a>
        <Button href="/" class="bg-tertiary! text-accent! font-commissioner text-3xl rounded-none m-5">
            Go to Homepage <ArrowRightOutline class="w-5 h-5 ms-2" />
        </Button>
    </div>
    {/if}
</div>