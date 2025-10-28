<script lang="ts">
	import { Button } from 'flowbite-svelte';
	import { ArrowRightOutline } from 'flowbite-svelte-icons';

	export let data: {
		type: 'payment_intent' | 'payment' | 'newsletter' | 'signup' | 'error';
		amountTotal?: number;
		customerEmail?: string;
		email?: string;
		message?: string;
	};

	const messages = {
		payment_intent: {
			title: 'Subscription Setup Successful!',
			content: `Thanks for setting up your subscription! A confirmation email has been sent to ${data.customerEmail}.`
		},
		payment: {
			title: 'Payment Successful!',
			content: `Thank you for your payment of £${data.amountTotal}. A confirmation email has been sent to ${data.customerEmail}.`
		},
		newsletter: {
			title: 'Newsletter Signup Successful!',
			content: `Your email ${data.email} has been successfully added to our mailing list. Please check your email for verification.`
		},
		signup: {
			title: 'Account Created!',
			content: `Check your email (${data.email}) for the confirmation link to verify your account.`
		},
		error: {
			title: 'Something went wrong',
			content: data.message || 'An unexpected error occurred.'
		}
	};

	const currentMessage = messages[data.type];

	// Determine redirect URL and button text based on type
	const getRedirectInfo = (type: typeof data.type) => {
		switch (type) {
			case 'payment':
			case 'payment_intent':
				return { url: '/private/dashboard', text: 'Go to Dashboard' };
			case 'signup':
				return { url: '/auth', text: 'Go to Sign In' };
			case 'newsletter':
			case 'error':
			default:
				return { url: '/', text: 'Go to Homepage' };
		}
	};

	const redirectInfo = getRedirectInfo(data.type);
</script>

<div class="flex min-h-screen w-full items-center justify-center p-8">
	<div
		class="bg-tertiary text-text-colour font-commissioner mx-auto max-w-4xl p-8 text-center shadow-lg"
	>
		<h1 class="font-ranchers mb-6 text-4xl">{currentMessage.title}</h1>
		<p class="mx-auto mb-8 max-w-2xl text-center text-xl">{currentMessage.content}</p>
		<div class="mt-8 items-end">
			<Button
				href={redirectInfo.url}
				class="bg-tertiary! hover:bg-text-colour! text-text-colour! hover:text-tertiary! font-commissioner items-end rounded-none text-3xl transition-colors duration-200"
				size="lg"
			>
				{redirectInfo.text}
				<ArrowRightOutline class="ms-2 h-8 w-8" />
			</Button>
		</div>
	</div>
</div>
