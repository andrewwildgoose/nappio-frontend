<script lang="ts">
    import { onMount } from 'svelte';
    import { page } from '$app/state';
    
    let loading = true;
    let error = '';
    let subscriptionId = '';

    onMount(() => {
        subscriptionId = page.url.searchParams.get('subscription_id') || '';
        console.log('Subscription ID:', subscriptionId);
        
        // If we reach this point, it means the server-side redirect didn't work
        // We can implement a client-side fallback here if needed
        const timer = setTimeout(() => {
            error = 'Checkout session creation is taking longer than expected. Please try again.';
            loading = false;
        }, 10000); // 10 second timeout

        return () => clearTimeout(timer);
    });
</script>

<svelte:head>
    <title>Building Checkout - Nappio</title>
    <meta name="description" content="Creating your checkout session..." />
</svelte:head>

<div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4">
    <div class="max-w-md w-full">
        <div class="bg-white rounded-2xl shadow-xl p-8 text-center">
            {#if loading && !error}
                <!-- Loading State -->
                <div class="mb-6">
                    <div class="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    </div>
                    <h1 class="text-2xl font-bold text-gray-900 mb-2">Building Your Checkout</h1>
                    <p class="text-gray-600">
                        Please wait while we prepare your subscription checkout session...
                    </p>
                    {#if subscriptionId}
                        <p class="text-sm text-gray-500 mt-2">
                            Subscription: {subscriptionId}
                        </p>
                    {/if}
                </div>
                
                <!-- Progress Dots -->
                <div class="flex justify-center space-x-2">
                    <div class="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></div>
                    <div class="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style="animation-delay: 0.1s"></div>
                    <div class="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style="animation-delay: 0.2s"></div>
                </div>
            {:else}
                <!-- Error State -->
                <div class="mb-6">
                    <div class="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
                        <svg class="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                    </div>
                    <h1 class="text-2xl font-bold text-gray-900 mb-2">Something Went Wrong</h1>
                    <p class="text-gray-600 mb-6">{error}</p>
                    
                    <div class="space-y-3">
                        <button 
                            class="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200"
                            on:click={() => window.location.reload()}
                        >
                            Try Again
                        </button>
                        <a 
                            href="/subscribe" 
                            class="block w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 px-6 rounded-lg transition-colors duration-200"
                        >
                            Back to Plans
                        </a>
                    </div>
                </div>
            {/if}
        </div>
    </div>
</div>

<style>
    .animate-bounce {
        animation: bounce 1s infinite;
    }
    
    @keyframes bounce {
        0%, 20%, 53%, 80%, 100% {
            transform: translateY(0);
        }
        40%, 43% {
            transform: translateY(-8px);
        }
        70% {
            transform: translateY(-4px);
        }
        90% {
            transform: translateY(-2px);
        }
    }
</style>
