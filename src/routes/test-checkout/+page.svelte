<script>
    let subscriptionId = 'sub_1234567890';
</script>

<svelte:head>
    <title>Test Checkout Flow - Nappio</title>
</svelte:head>

<div class="min-h-screen bg-gray-50 py-12 px-4">
    <div class="max-w-2xl mx-auto">
        <div class="bg-white rounded-lg shadow-md p-8">
            <h1 class="text-3xl font-bold text-gray-900 mb-6">Test Checkout Flow</h1>
            
            <p class="text-gray-600 mb-8">
                This page demonstrates how the email checkout flow works. Users will click a link in their email 
                that directs them to <code>/checkout/[subscriptionId]</code> where a checkout session is created 
                and they're redirected to Stripe.
            </p>
            
            <div class="space-y-6">
                <div>
                    <label for="subscriptionId" class="block text-sm font-medium text-gray-700 mb-2">
                        Subscription ID
                    </label>
                    <input 
                        type="text" 
                        id="subscriptionId"
                        bind:value={subscriptionId}
                        placeholder="sub_1234567890"
                        class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    />
                    <p class="text-sm text-gray-500 mt-1">
                        Enter a subscription ID to test the checkout flow
                    </p>
                </div>
                
                <div class="flex space-x-4">
                    <a 
                        href="/checkout?subscription_id={subscriptionId}"
                        class="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors duration-200"
                    >
                        Test Server-Side Redirect
                    </a>
                </div>
                
                <div class="bg-blue-50 border border-blue-200 rounded-md p-4">
                    <h3 class="text-lg font-medium text-blue-900 mb-2">How it works:</h3>
                    <ol class="list-decimal list-inside text-blue-800 space-y-1">
                        <li>User receives email with link: <code>yoursite.com/checkout?subscription_id=sub_123456</code></li>
                        <li>Server loads the page and extracts subscription ID from query params</li>
                        <li>Server calls backend API to create checkout session for that subscription</li>
                        <li>Server immediately redirects user to Stripe checkout</li>
                        <li>User completes payment and is redirected to success page</li>
                    </ol>
                </div>
                
                <div class="bg-amber-50 border border-amber-200 rounded-md p-4">
                    <h3 class="text-lg font-medium text-amber-900 mb-2">Backend Requirements:</h3>
                    <p class="text-amber-800">
                        Your backend needs an endpoint at <code>/api/v1/create-checkout-from-subscription</code> 
                        that accepts a POST request with <code>{'{"subscriptionId": "sub_123456"}'}</code> and 
                        returns <code>{'{"checkout_url": "https://checkout.stripe.com/..."}'}</code>
                    </p>
                </div>
            </div>
        </div>
    </div>
</div>
