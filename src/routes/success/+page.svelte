<script lang="ts">
    import { Button } from 'flowbite-svelte';
    import { ArrowRightOutline } from 'flowbite-svelte-icons';

    export let data: {
        type: 'payment' | 'newsletter' | 'error';
        amountTotal?: number;
        customerEmail?: string;
        email?: string;
        message?: string;
    }

    const messages = {
        payment: {
            title: 'Payment Successful!',
            content: `Thank you for your payment of £${data.amountTotal}. A confirmation email has been sent to ${data.customerEmail}.`
        },
        newsletter: {
            title: 'Newsletter Signup Successful!',
            content: `Your email ${data.email} has been successfully added to our mailing list. Please check your email for verification.`
        },
        error: {
            title: 'Something went wrong',
            content: data.message || 'An unexpected error occurred.'
        }
    }

    const currentMessage = messages[data.type];
</script>

<div class="min-h-screen w-full flex items-center justify-center p-8">
    <div class="max-w-4xl mx-auto bg-tertiary text-text-colour font-commissioner p-8 shadow-lg text-center">
        <h1 class="text-4xl font-ranchers mb-6">{currentMessage.title}</h1>
        <p class="text-xl text-center max-w-2xl mx-auto mb-8">{currentMessage.content}</p>
        <div class="mt-8 items-end">
            <Button 
                href={data.type === 'subscription' ? '/dashboard' : '/'}             
                class="bg-tertiary! hover:bg-text-colour! text-text-colour! hover:text-tertiary! font-commissioner text-3xl rounded-none transition-colors duration-200 items-end"                 size="lg"
            >
                {data.type === 'subscription' ? 'Go to Dashboard' : 'Go to Homepage'} 
                <ArrowRightOutline class="w-8 h-8 ms-2" />
            </Button>        
        </div>
    </div>
</div>