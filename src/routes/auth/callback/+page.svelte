<script lang="ts">
    import { Spinner } from 'flowbite-svelte';
    import { onMount } from 'svelte';

    onMount(() => {
        // If there's a hash in the URL, remove it without reloading the page.
        if (window.location.hash) {
            history.replaceState(
                null,
                document.title,
                window.location.pathname + window.location.search
            );
        }
    });
</script>

<div class="flex items-center justify-center min-h-screen">
    <Spinner size="12" />
</div>