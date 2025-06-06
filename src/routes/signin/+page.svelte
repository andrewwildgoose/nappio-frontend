<script>
    import AuthForm from "$lib/components/AuthForm.svelte";
    import { onMount } from 'svelte';

    onMount(() => {
        if (window.location.hash) {
            history.replaceState(null, document.title, window.location.pathname + window.location.search);
        }
    });
</script>

<div class="flex flex-col items-center justify-center">
    <div class="h-screen w-full p-10 items-center justify-center">
        <AuthForm />
    </div>
</div>