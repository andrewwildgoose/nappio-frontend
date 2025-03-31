<script>
    import { Label, Input, Button } from 'flowbite-svelte';
    import { ArrowRightOutline } from 'flowbite-svelte-icons';
</script>

<div class="flex flex-col items-center justify-center">
    <div class="h-full w-full">
        <div class="flex flex-col items-center justify-center m-5 text-xl text-text-colour font-commissioner">
            <p>Oops! Sorry, we can't find the page you're looking for.</p>
            <Button href="/" class="bg-tertiary! text-accent! font-commissioner text-3xl rounded-none m-5" size="lg">
                Go to Homepage <ArrowRightOutline class="w-5 h-5 ms-2" />
            </Button>
        </div>     
    </div>
</div>