<script lang="ts">
    import { Button } from 'flowbite-svelte';
    import { enhance } from '$app/forms';
    let result: any = null;
    let error: string | null = null;
</script>

<div class="flex flex-col items-center justify-center min-h-screen bg-background p-4">
    <div class="bg-white p-8 rounded-lg shadow-lg max-w-2xl w-full">
        <h1 class="text-3xl font-commissioner mb-6">JWT Test Page</h1>
        
        <form 
            method="POST" 
            action="?/testJWT"
            use:enhance={() => {
                return async ({ result: actionResult }) => {
                    if (actionResult.type === 'success') {
                        console.log('Server response:', actionResult.data);
                        result = actionResult.data;
                        error = null;
                    } else if (actionResult.type === 'error') {
                        error = actionResult.error;
                        result = null;
                    } else {
                        error = 'An unexpected error occurred';
                        result = null;
                    }
                };
            }}
        >
            <Button
                type="submit"
                class="bg-tertiary! hover:bg-accent! text-accent! hover:text-tertiary! font-commissioner text-xl rounded-none transition-colors duration-200"
            >
                Test JWT
            </Button>
        </form>

        {#if error}
            <p class="mt-4 text-red-500">{error}</p>
        {/if}

        {#if result}
            <pre class="mt-4 p-4 bg-gray-100 rounded">
                {JSON.stringify(result, null, 2)}
            </pre>
        {/if}
    </div>
</div>