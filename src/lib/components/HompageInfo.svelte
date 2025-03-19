<script>
    import { onMount } from 'svelte';

    let animate = false;

    onMount(() => {
        setTimeout(() => {
            animate = true;
        }, 2500); // Small delay before animation starts
    });
    
</script>

<style>
    @keyframes fade-in {
        from { opacity: 0; }
        to { opacity: 1; }
    }

    @keyframes move-right {
        from { transform: translateX(-1300px); }
        to { transform: translateX(0px); }
    }

    @keyframes move-left {
        from { transform: translateX(1300px); }
        to { transform: translateX(0px); }
    }

    /* Ensure elements start hidden and off-screen */


    .fade-in {
        animation: fade-in 1s ease-out forwards;
        display: block;
    }

    .move-right {
        animation: move-right 1.5s ease-out forwards;
    }

    .move-left {
        animation: move-left 1.5s ease-out forwards;
    }
</style>

<div class="grid grid-cols-2 items-center justify-items-center m-10">
    <div 
        class="relative w-150 h-100 hidden"
        class:move-right={animate}
        class:fade-in={animate}
        >
        <div class="w-96 h-80 absolute top-0 right-0 z-0 border-solid border-4 border-dark-blue rounded-sm">
            <img 
                src="/images/product_example_1.jpg" 
                alt="product example 1" 
                class="h-full w-full object-cover">        
        </div>
        <div class="w-96 h-80 absolute bottom-0 left-0 z-1 border-solid border-4 border-accent rounded-sm">
            <img 
                src="/images/product_example_2.jpg" 
                alt="product example 2" 
                class="h-full w-full object-cover">
        </div>
    </div>
    <div>
        <p 
            class="font-ranchers text-5xl text-tertiary hidden"
            class:move-left={animate}
            class:fade-in={animate}
            >
            the reusable nappy<br>
            service for people who<br>
            don't have time for<br>
            reusable nappies
        </p>
    </div>
</div>