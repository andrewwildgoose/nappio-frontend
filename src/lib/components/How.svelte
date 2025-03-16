<script>
    import { onMount } from 'svelte';

    let animate = false;

    onMount(() => {
        setTimeout(() => {
            animate = true;
        }, 4000); // Small delay before animation starts
    });
    
</script>

<style>
    .triangle-down {
        width: 0;
        height: 0;
        border-left: 50px solid transparent;
        border-right: 50px solid transparent;
        border-top: 50px solid #e9c46a;
        animation: bounce 0.5s;
        animation-direction: alternate;
        animation-timing-function: cubic-bezier(.5, 0.05, 1, .5);
        animation-iteration-count: 6;
    }

    .fade-in {
        animation: fade-in 1s ease-out forwards;
        display: flex;
    }

    @keyframes bounce {
        from {
            transform: translate3d(0, 0, 0);
        }

        to {
            transform: translate3d(0, 20px, 0);
        }
    }

    @keyframes fade-in {
        from { opacity: 0; }
        to { opacity: 1; }
    }


    /* Prefix Support */

    triangle-down {
        -webkit-animation-name: bounce;
        -webkit-animation-duration: 0.5s;
        -webkit-animation-direction: alternate;
        -webkit-animation-timing-function: cubic-bezier(.5, 0.05, 1, .5);
        -webkit-animation-iteration-count: 6;
    }

    @-webkit-keyframes bounce {
        from {
            -webkit-transform: translate3d(0, 0, 0);
            transform: translate3d(0, 0, 0);
        }

        to {
            -webkit-transform: translate3d(0, 200px, 0);
            transform: translate3d(0, 200px, 0);
        }
    }
</style>

<div 
    class="flex flex-col items-center justify-center hidden"
    class:fade-in={animate}
    >
    <h1 
        class="font-ranchers text-6xl text-terracotta"
    >
        but how does it work...?
    </h1>
    <div class="triangle-down mt-5"></div>
    
</div>