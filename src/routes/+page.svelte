<script>
    import StartAnimation from '../lib/components/StartAnimation.svelte';
    import HompageInfo from '$lib/components/HompageInfo.svelte';
    import How from '$lib/components/How.svelte';

    import EmailForm from "$lib/components/EmailForm.svelte";
    export let form; // This receives form data from the server

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
        display: flex;
    }
</style>

<div class="flex flex-col items-center justify-center">
    <div class="h-full w-full">
        <StartAnimation />
        <div 
            class="flex flex-col md:flex-row w-full mt-2 hidden"
            class:fade-in={animate}
            >
            <div class="w-full md:w-1/2 flex items-center justify-center border-1 border-solid border-text-colour">
                <HompageInfo />
            </div>
            <div class="w-full md:w-1/2 flex flex-col items-center justify-center border-1 border-l-0 border-solid border-text-colour">
                <div class="flex flex-col items-center justify-center bg-tertiary mb-5 p-3 text-xl w-full border-t-1 border-b-1 border-solid border-text-colour">
                    <p>Sign up to be the first to know about any updates to our service.</p>
                </div>
                <EmailForm {form} />
            </div>
        </div>
    </div>
</div>
