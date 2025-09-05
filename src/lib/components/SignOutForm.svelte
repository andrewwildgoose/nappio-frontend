<script lang="ts">
    import { enhance } from '$app/forms';
    import { goto } from '$app/navigation';
    import { Button } from 'flowbite-svelte';

    function handleSignOut() {
        return async ({ result }) => {
            console.log(result);
            if (result.type === 'success') {
                window.location.href = '/signin';
            }
        };
    }
</script>

<form 
    action="/signin?/auth" 
    method="POST" 
    use:enhance={handleSignOut}
>
    <input type="hidden" name="type" value="signout">
    <Button 
        type="submit"
        class="bg-tertiary! hover:bg-accent! text-text-colour font-ranchers text-xl rounded-none transition-colors duration-200 border-none"
    >
        Sign Out
    </Button>
</form>