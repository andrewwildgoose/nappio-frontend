<script>
    import { Label, Input, Button } from 'flowbite-svelte';
    import { ArrowRightOutline } from 'flowbite-svelte-icons';

    export let form; // This will receive form data from the page
</script>

<div class="flex flex-col items-center justify-center">
    <h1 class="mb-6 font-ranchers text-6xl text-accent fade-in">
        nappio
    </h1>
    
    {#if form?.success}
        <div class="flex flex-col items-center justify-center w-96 mb-6 p-4 bg-green-100 border-solid border-2 border-green-500 rounded-sm">
            <p class="font-commissioner text-xl text-center text-green-700">Thanks for subscribing! We'll keep you updated.</p>
        </div>
    {/if}

    {#if form?.error}
        <div class="flex flex-col items-center justify-center w-96 mb-6 p-4 bg-red-100 border-solid border-2 border-red-500 rounded-sm">
            <p class="font-commissioner text-xl text-red-700">{form.error}</p>
        </div>
    {/if}

    <form method="POST" action="?/subscribe" class="flex flex-col items-center justify-center">
        <div class="w-96 mb-6">
            <Label for="first_name-input" class="block mb-2 font-commissioner text-xl text-text-colour!">
                Enter your first name
            </Label>
            <Input 
                id="first_name-input"
                name="first_name"
                required
                value={form?.first_name ?? ''}
                class="bg-secondary! border-solid border-2 border-accent! rounded-sm" 
                size="lg" 
                placeholder="Type you first name here" 
            />
        </div>        
        <div class="w-96 mb-6">
            <Label for="email-input" class="block mb-2 font-commissioner text-xl text-text-colour!">
                Enter your email address
            </Label>
            <Input 
                id="email-input"
                name="email"
                type="email"
                required
                value={form?.email ?? ''}
                class="bg-secondary! border-solid border-2 border-accent! rounded-sm" 
                size="lg" 
                placeholder="register@your-interest.nappies" 
            />
        </div>

        <div class="w-96 mb-6">
            <Label for="postcode-input" class="block mb-2 font-commissioner text-xl text-text-colour!">
                Enter your postcode area (first 3-4 letters)
            </Label>
            <Input 
                id="postcode-input"
                name="postcode"
                required
                value={form?.postcode ?? ''}
                class="bg-secondary! border-solid border-2 border-accent! rounded-sm" 
                size="lg" 
                placeholder="SW2" 
            />
        </div>

        <Button type="submit" class="bg-tertiary! text-accent! font-commissioner text-3xl" size="lg">
            submit <ArrowRightOutline class="w-5 h-5 ms-2" />
        </Button>
    </form>
</div>