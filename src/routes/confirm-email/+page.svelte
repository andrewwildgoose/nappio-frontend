<script lang="ts">
    import { Button } from 'flowbite-svelte';
    import { ArrowRightOutline } from 'flowbite-svelte-icons';

        // Define the type for `data`
    export let data: {
        email?: string;
        message?: string;
        error?: string;
    };
</script>

<div class="flex flex-col items-center justify-center h-screen text-text-colour">
    {#if data.error}
        <h1 class="text-3xl font-commissioner mb-4">Verification Failed</h1>
        <p class="text-lg">{data.error}</p>
    {:else}
    <div class="flex flex-col items-center justify-center">
        <div class="text-center p-8 bg-accent2 shadow-sm">
            <h1 class="text-4xl font-ranchers mb-4">Email Verified</h1>
            <p class="mt-4 font-commissioner">Your email has been successfully verified: <strong>{data.email}</strong><br>You're now ready to stay updated and enjoy all the benefits of our service. Got questions? We're here to help!</p>
            <br>
            <a href="mailto:info@nappio.co.uk" class="text-text-colour underline font-commissioner hover:bg-text-colour hover:text-accent2 p-2">Contact us at info@nappio.co.uk</a>            
        </div>
        <Button href="/" class="bg-tertiary text-text-colour hover:bg-text-colour hover:text-tertiary font-commissioner text-3xl rounded-none m-5 items-end shadow-sm">
            Go to Homepage <ArrowRightOutline class="w-8 h-8 ms-2" />
        </Button>
    </div>
    {/if}
</div>