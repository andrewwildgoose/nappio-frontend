<script>
    import {Button} from 'flowbite-svelte';
</script>

<div class="p-5 flex flex-col items-center justify-center text-center">
    <h2 class="m-5 text-4xl text-text-colour font-ranchers">How does it work?</h2>
    <div class="m-5 p-5 bg-primary max-w-2xl">
        <h3 class="text-2xl text-text-colour font-ranchers">We Provide the Nappies</h3>
        <p>
            You'll be able to choose which ones suit your baby best. We'll give you enough for the whole week.
        </p>
    </div>

    <div class="m-5 p-5 bg-secondary max-w-2xl">
        <h3 class="text-2xl text-text-colour font-ranchers">You Use Them, We Collect Them</h3>
        <p>
            Pop the used nappies into the bag we provide. No need to rinse or do anything, just store them until collection day.
        </p>
    </div>

    <div class="m-5 p-5 bg-tertiary max-w-2xl">
        <h3 class="text-2xl text-text-colour font-ranchers">Weekly Pick-Up & Drop-Off</h3>
        <p>
            Once a week, we'll collect the used nappies and deliver a fresh, professionally cleaned batch straight to your door.
        </p>
    </div>
    <div class="m-5 p-5 bg-accent max-w-2xl">
        <h3 class="text-2xl text-text-colour font-ranchers">We Do the Dirty Work</h3>
        <p>
            We wash, sanitise, and dry the nappies using baby-safe, eco-friendly detergents and high-standard cleaning processes.
            Easy peasy!
        </p> 
    </div>

    <Button 
        class="bg-tertiary! hover:bg-accent! text-accent! hover:text-tertiary! font-commissioner text-3xl border-1 border-solid border-text-colour rounded-none transition-colors duration-200 mt-5" 
        size="lg"
        href="/plans"
    >
        Get Started
    </Button>
</div>