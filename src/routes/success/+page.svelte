<script lang="ts">
    import { Button } from 'flowbite-svelte';
    import { ArrowRightOutline } from 'flowbite-svelte-icons';

    export let data: {
        type: 'subscription' | 'newsletter' | 'error';
        planName?: string;
        customerEmail?: string;
        email?: string;
        message?: string;
    }

    const messages = {
        subscription: {
            title: 'Subscription Successful!',
            content: `Thank you for subscribing to our ${data.planName} plan. A confirmation email has been sent to ${data.customerEmail}.`
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

<div class="flex flex-col items-center justify-center h-screen bg-green-100 text-green-800 font-commissioner p-5">
    <h1 class="text-3xl font-com mb-4">{currentMessage.title}</h1>
    <p class="text-lg text-center max-w-2xl">{currentMessage.content}</p>
    <div class="m-5">
        <Button 
            href="/"             
            class="bg-tertiary! hover:bg-accent! text-accent! hover:text-tertiary! font-commissioner text-3xl rounded-none transition-colors duration-200" 
            size="lg"
        >
            Go to Homepage <ArrowRightOutline class="w-5 h-5 ms-2" />
        </Button>        
    </div>
</div>