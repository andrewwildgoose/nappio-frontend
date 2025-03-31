<script>
    import EmailForm from "$lib/components/EmailForm.svelte";
    export let form; // This receives form data from the server

</script>

<div class="flex flex-col items-center justify-center">
    <div class="h-screen w-full p-10 bg-background items-center justify-center">
        <EmailForm {form} />
    </div>
</div>