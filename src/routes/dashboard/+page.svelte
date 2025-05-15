<script lang="ts">
    import type { PageData } from './$types';
    import { Button } from 'flowbite-svelte';
    import { enhance } from '$app/forms';
    import { goto } from '$app/navigation';
    import { handleSignOut } from '$lib/stores/auth';

    export let data: PageData;

    async function handleSignoutSubmit() {
        return async () => {
            console.log('Client: Starting signout process');
            try {
                await handleSignOut();
                console.log('Client: Signout successful, redirecting');
                await goto('/signin');
            } catch (error) {
                console.error('Client: Signout error:', error);
            }
        };
    }
</script>

<div class="flex flex-col items-center justify-center min-h-screen bg-background p-4">
    <div class="bg-white p-8 rounded-lg shadow-lg max-w-2xl w-full">
        <h1 class="text-3xl font-commissioner mb-6">Welcome, {data.user.first_name}!</h1>
        <div class="space-y-4">
            <div class="border-b pb-4">
                <h2 class="text-xl font-commissioner mb-2">Your Profile</h2>
                <p><strong>Email:</strong> {data.user.email}</p>
                <p><strong>Name:</strong> {data.user.first_name} {data.user.surname}</p>
                <p><strong>Postcode:</strong> {data.user.postcode}</p>
            </div>

            <div class="flex justify-end">
                <form 
                    action="/signin?/auth" 
                    method="POST" 
                    use:enhance={handleSignoutSubmit}
                >
                    <input type="hidden" name="type" value="signout">
                    <Button 
                        type="submit"
                        class="bg-tertiary! hover:bg-accent! text-accent! hover:text-tertiary! font-commissioner text-xl rounded-none transition-colors duration-200"
                    >
                        Sign Out
                    </Button>
                </form>
            </div>
        </div>
    </div>
</div>