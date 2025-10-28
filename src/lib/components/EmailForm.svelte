<script>
	import { Label, Input, Button, Spinner } from 'flowbite-svelte';
	import { ArrowRightOutline } from 'flowbite-svelte-icons';
	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';

	export let form; // This will receive form data and errors from the server
	let isSubmitting = false;

	function handleSubmit() {
		isSubmitting = true;
		return async ({ result }) => {
			try {
				if (result.type === 'success' && result.data?.success) {
					await goto(`/success?email=${encodeURIComponent(result.data.email)}`);
				} else if (result.type === 'failure') {
					await goto(
						`/error?message=${encodeURIComponent(result.data?.error)}&email=${encodeURIComponent(result.data?.email)}`
					);
				}
			} finally {
				isSubmitting = false;
			}
		};
	}
</script>

<div class="flex w-full flex-col items-center justify-center p-5">
	<form
		method="POST"
		action="?/subscribe"
		class="flex flex-col items-center justify-center md:w-full"
		use:enhance={handleSubmit}
	>
		<div class="flex w-full flex-col items-center justify-center lg:flex-row lg:items-end">
			<div class="mb-6 w-full px-2 sm:w-96 sm:px-0 md:m-2">
				<Label
					for="first_name-input"
					class="font-commissioner text-text-colour! mb-2 block text-xl"
				>
					First name
				</Label>
				<Input
					id="first_name-input"
					name="first_name"
					required
					value={form?.first_name ?? ''}
					class="bg-secondary! rounded-none border-none shadow-sm"
					size="lg"
					placeholder="Type your first name here"
				/>
			</div>
			<div class="mb-6 w-full px-2 sm:w-96 sm:px-0 md:m-2">
				<Label for="email-input" class="font-commissioner text-text-colour! mb-2 block text-xl">
					Email address
				</Label>
				<Input
					id="email-input"
					name="email"
					type="email"
					required
					value={form?.email ?? ''}
					class="bg-secondary! rounded-none border-none shadow-sm"
					size="lg"
					placeholder="register@your-interest.nappies"
				/>
			</div>

			<div class="mb-6 w-full px-2 sm:w-96 sm:px-0 md:m-2">
				<Label for="postcode-input" class="font-commissioner text-text-colour! mb-2 block text-xl">
					Postcode area (first 3-4 letters)
				</Label>
				<p class="pb-3 text-sm">
					We ask for the first half of your postcode in order to determine where to expand to next.
				</p>
				<Input
					id="postcode-input"
					name="postcode"
					required
					maxlength="4"
					value={form?.postcode ?? ''}
					class="bg-secondary! rounded-none border-none shadow-sm"
					size="lg"
					placeholder="SW2"
				/>
			</div>
		</div>

		<Button
			type="submit"
			class="bg-tertiary! hover:bg-text-colour! text-text-colour hover:text-tertiary font-commissioner mt-4 items-end rounded-none border-1 border-none text-3xl shadow-sm transition-colors duration-200"
			size="lg"
			disabled={isSubmitting}
		>
			{#if isSubmitting}
				<Spinner class="fill-accent! hover:fill-tertiary! mr-3 h-8 w-8" color="custom" /> Submitting...
			{:else}
				Submit <ArrowRightOutline class="ms-2 h-8 w-8" />
			{/if}
		</Button>
	</form>
</div>
