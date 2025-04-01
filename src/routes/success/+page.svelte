<script>
    import { Button } from 'flowbite-svelte';
    import { ArrowRightOutline } from 'flowbite-svelte-icons';

    export let data;
</script>

<div class="flex flex-col items-center justify-center h-screen bg-green-100 text-green-800 font-commissioner">
    <h1 class="text-3xl font-com mb-4">Subscription Successful!</h1>
    <p class="text-lg">Thank you for subscribing. Please check your email for verification.</p>
    <Button href="/" class="bg-tertiary! text-accent! font-commissioner text-3xl rounded-none m-5" size="lg">
        Go to Homepage <ArrowRightOutline class="w-5 h-5 ms-2" />
    </Button>
</div>