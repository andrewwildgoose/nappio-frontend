<script>
    import StartAnimation from '../lib/components/StartAnimation.svelte';
    import HompageInfo from '$lib/components/HompageInfo.svelte';
    import How from '$lib/components/How.svelte';
</script>

<div class="flex flex-col items-center justify-center">
    <div class="h-screen w-full p-10 bg-teal">
        <StartAnimation />
        <HompageInfo />
        <How />
    </div>
</div>
