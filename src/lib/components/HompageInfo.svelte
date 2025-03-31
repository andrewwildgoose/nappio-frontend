<script>
    import { onMount } from 'svelte';

    let animate = false;

    onMount(() => {
        setTimeout(() => {
            animate = true;
        }, 3000); // Small delay before animation starts
    });
</script>

<style>
    @keyframes fade-in {
        from { opacity: 0; }
        to { opacity: 1; }
    }

    .fade-in {
        animation: fade-in 1.5s ease-out forwards;
        display: block;
    }
</style>

<div class="flex flex-col items-right justify-center text-right h-200 w-full max-h-screen">
    <div class="h-1/2 flex flex-col justify-center">
        <div class="m-5 text-4xl">
            <h2 class="text-text-colour font-ranchers">THE<br>REUSABLE<br>NAPPY<br>SERVICE</h2>
        </div>
        <div class="m-5 text-xl text-text-colour font-commissioner">
            <p>For people who don't have time for reusable nappies.</p>
        </div>        
    </div>

    <div class="h-1/2 w-full border-t-1 border-solid border-text-colour">
        <img 
        src="/images/img1.JPG" 
        alt="product example 1" 
        class="h-full w-full object-cover">  
    </div>
</div>