<script>
    import { Label, Input, Button } from 'flowbite-svelte';
    import { ArrowRightOutline } from 'flowbite-svelte-icons';
</script>

<div class="flex flex-col items-center justify-center h-dvh">
    <div class="flex h-full items-center justify-center w-full">
        <div class="flex flex-col bg-primary items-center justify-center p-8 text-xl text-text-colour font-commissioner shadow-sm">
            <h1 class="text-3xl font-ranchers">Oops!</h1>
            <p>Sorry, we can't find the page you're looking for.</p>
            <Button 
                href="/"             
                class="mt-8 bg-tertiary! hover:bg-text-colour! text-text-colour! hover:text-tertiary! font-commissioner text-3xl rounded-none transition-colors duration-200 shadow-sm" 
                size="lg"
            >
                Go to Homepage <ArrowRightOutline class="w-8 h-8 ms-2" />
            </Button>
        </div>     
    </div>
</div>