<script lang="ts">
    import type { PageData } from './$types';
    import { Button } from 'flowbite-svelte';
    import { enhance } from '$app/forms';

    export let data: PageData;

    async function handleSignOut() {
        const response = await fetch('/api/auth', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ action: 'signout' })
        });

        if (response.ok) {
            window.location.href = '/signin';
        }
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
                <Button 
                    on:click={handleSignOut}
                    class="bg-tertiary! hover:bg-accent! text-accent! hover:text-tertiary! font-commissioner text-xl rounded-none transition-colors duration-200"
                >
                    Sign Out
                </Button>
            </div>
        </div>
    </div>
</div>