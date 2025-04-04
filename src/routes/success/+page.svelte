<script lang="ts">
    import { Button } from 'flowbite-svelte';
    import { ArrowRightOutline } from 'flowbite-svelte-icons';

    export let data: {
        email?: string;
    }
</script>

<div class="flex flex-col items-center justify-center h-screen bg-green-100 text-green-800 font-commissioner p-5">
    <h1 class="text-3xl font-com mb-4">Subscription Successful!</h1>
    <p class="text-lg">Your email has been successfully added to our mailing list: <strong>{data.email}</strong></p>
    <p class="text-lg">Thank you for subscribing. Please check your email for verification.</p>
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