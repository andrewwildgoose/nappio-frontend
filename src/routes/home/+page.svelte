<script>
    import HompageInfo from '$lib/components/HompageInfo.svelte';
    import How from '$lib/components/How.svelte';
    import EmailForm from "$lib/components/EmailForm.svelte";
    export let form; // This receives form data from the server


</script>

<div class="flex flex-col w-full h-dvh">
    <div class="flex md:flex-row flex-col w-full h-fit min-h-max">
        <div class="flex md:w-1/2 w-full h-full min-h-max border-solid border-l-1 border-b-1 border-r-1 border-text-colour">
            <HompageInfo />
        </div>
        <div class="flex md:w-1/2 w-full h-full min-h-max border-solid border-b-1 border-r-1 border-text-colour">
            <How />
        </div>
    </div>
    <div class="flex md:flex-row flex-col w-full h-fit min-h-max">

            <div class="flex flex-col w-full items-center justify-center">
                <div class="flex flex-col items-center justify-center bg-accent2 mb-5 p-3 text-xl w-full border-b-1 border-solid border-text-colour">
                    <p>Sign up to be the first to know about any updates to our service.</p>
                </div>
                <EmailForm {form} />                
            </div>

    </div>
</div>