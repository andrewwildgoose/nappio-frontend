<script>
    import { page } from '$app/state'; // Import the page object to access query parameters
    import { Button } from 'flowbite-svelte';
    import { ArrowRightOutline } from 'flowbite-svelte-icons';

    // Extract the error message from the query parameters
    const errorMessage = decodeURIComponent(page.url.searchParams.get('message') || 'An unexpected error occurred');
</script>

<div class="flex flex-col items-center justify-center h-screen bg-red-100 text-red-800 font-commissioner">
    <h1 class="text-3xl font-bold mb-4">Subscription Failed</h1>
    <p class="text-lg">{errorMessage}</p>
    <Button href="/" class="bg-tertiary! text-accent! font-commissioner text-3xl rounded-none m-5" size="lg">
        Go to Homepage <ArrowRightOutline class="w-5 h-5 ms-2" />
    </Button>
</div>