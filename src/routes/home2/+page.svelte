<script>
    import HompageInfo from '$lib/components/HompageInfo.svelte';
    import How from '$lib/components/How.svelte';
    import EmailForm from "$lib/components/EmailForm.svelte";
    export let form; // This receives form data from the server


</script>

<div class="flex flex-col w-full h-dvh">
    <HompageInfo />
    <How />
    <div class="flex flex-col w-full items-center justify-center">
        <div class="flex flex-col items-center justify-center bg-accent2 mb-5 p-3 text-xl w-full border-b-1 border-t-1 border-solid border-text-colour">
            <p>Sign up to be the first to know about any updates to our service.</p>
        </div>
        <EmailForm {form} />                
    </div>
</div>