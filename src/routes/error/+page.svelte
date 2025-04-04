<script>
    import { page } from '$app/state'; // Import the page object to access query parameters
    import { Button } from 'flowbite-svelte';
    import { ArrowRightOutline } from 'flowbite-svelte-icons';

    // Extract the error message from the query parameters
    const errorMessage = decodeURIComponent(page.url.searchParams.get('message') || 'An unexpected error occurred');
    const email = decodeURIComponent(page.url.searchParams.get('email') || ''); // Extract the email if needed
</script>

<div class="flex flex-col items-center justify-center h-screen bg-red-100 text-red-800 font-commissioner p-5">
    <h1 class="text-3xl font-bold mb-4">Subscription Failed</h1>
    <p>{email}</p>
    <p class="text-lg">{errorMessage}</p>
    <div class="m-5">
        <Button 
            href="/"             
            class="bg-tertiary! hover:bg-accent! text-accent! hover:text-tertiary! font-commissioner text-3xl rounded-none transition-colors duration-200" 
            size="lg"
        >
            Go to Homepage <ArrowRightOutline class="w-5 h-5 ms-2" />
        </Button>        
    </div>
</div>