<script>
    import { page } from '$app/state'; // Import the page object to access query parameters
    import { Button } from 'flowbite-svelte';
    import { ArrowRightOutline } from 'flowbite-svelte-icons';

    // Extract the error message from the query parameters
    const errorMessage = decodeURIComponent(page.url.searchParams.get('message') || 'An unexpected error occurred');
    const email = decodeURIComponent(page.url.searchParams.get('email') || ''); // Extract the email if needed
</script>

<div class="flex flex-col items-center justify-center h-screen p-5">
    <div class="flex flex-col items-center justify-center text-center p-8 bg-accent text-text-colour font-commissioner">
        <h1 class="text-3xl font-commissioner mb-4">Subscription Failed</h1>
        <p>{email}</p>
        <p class="text-lg">{errorMessage}</p>
        <div class="mt-8">
            <Button 
                href="/"             
                class="bg-tertiary! hover:bg-text-colour! text-text-colour! hover:text-tertiary! font-commissioner text-3xl rounded-none transition-colors duration-200" 
                size="lg"
            >
                Go to Homepage <ArrowRightOutline class="w-8 h-8 ms-2" />
            </Button>        
        </div>       
    </div>
</div>