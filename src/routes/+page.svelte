<script>
    import { onMount } from 'svelte';

    let animate = false;

    onMount(() => {
        setTimeout(() => {
            animate = true;
        }, 500); // Small delay before animation starts
    });
</script>

<style>
    @keyframes fade-in {
        from { opacity: 0; }
        to { opacity: 1; }
    }

    @keyframes move-up {
        from { transform: translateY(300px); }
        to { transform: translateY(10px); }
    }

    .fade-in {
        animation: fade-in 1s ease-out forwards;
        transform: translateY(300px);
    }

    .move-up {
        animation: move-up 1.5s ease-out forwards;
        animation-delay: 1.5s; /* Delay to allow fade-in first */
    }
</style>

<div class="flex flex-col items-center justify-center">
    <div class="h-screen w-full p-10 bg-teal">
        <div class="flex flex-col items-center justify-center">
            <h1 
                class="font-ranchers text-6xl text-warm-mustard absolute fade-in"
                class:move-up={animate}
            >
                nappio
            </h1>              
        </div>
    </div>
</div>
