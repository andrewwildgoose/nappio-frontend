<script lang="ts">
	import { Button, Input, Alert, Label, Checkbox, Spinner } from 'flowbite-svelte';
	import { slide } from 'svelte/transition';
	import { goto } from '$app/navigation';
	import { supabase } from '$lib/client/supabaseClient';

	let isSubmitting = false;
	let isSignUp = false;
	let passwordHidden = true;
	let error = '';
	let message = '';

	// Form fields
	let email = '';
	let password = '';
	let first_name = '';
	let surname = '';
	let postcode = '';

	async function handleSignIn() {
		isSubmitting = true;
		error = '';
		message = '';

		const { error: signInError } = await supabase.auth.signInWithPassword({
			email,
			password
		});

		if (signInError) {
			error = signInError.message;
			isSubmitting = false;
			return;
		}

		// Redirect to dashboard on success
		await goto('/private/dashboard');
		isSubmitting = false;
	}

	async function handleSignUp() {
		isSubmitting = true;
		error = '';
		message = '';

		if (!email || !password || !first_name || !surname || !postcode) {
			error = 'Please fill in all fields';
			isSubmitting = false;
			return;
		}

		const { error: signUpError } = await supabase.auth.signUp({
			email,
			password,
			options: {
				data: {
					first_name,
					surname,
					postcode: postcode.toUpperCase()
				},
				emailRedirectTo: `${window.location.origin}/auth/callback`
			}
		});

		if (signUpError) {
			error = signUpError.message;
			isSubmitting = false;
			return;
		}
		
		// Redirect to success page
		await goto(`/success?type=signup&email=${encodeURIComponent(email)}`);
		isSubmitting = false;
	}

	async function handleSubmit(event: Event) {
		event.preventDefault();
		if (isSignUp) {
			await handleSignUp();
		} else {
			await handleSignIn();
		}
	}

	function viewPassword() {
		const x = document.getElementById("password-input") as HTMLInputElement;
		if (x.type === "password") {
			x.type = "text";
		} else {
			x.type = "password";
		}
		passwordHidden = !passwordHidden;
	}
</script>

<div
	class="bg-background/50 mx-auto flex w-full max-w-md flex-col space-y-4 p-2 p-5 shadow-sm transition-all duration-300 ease-in-out md:p-8"
>
	<div class="mb-6 flex w-full justify-center">
		<Button
			color="light"
			class="w-32 {!isSignUp
				? 'bg-tertiary! text-xl'
				: 'bg-accent! text-l'} text-text-colour font-ranchers transition-text rounded-none border-none p-4 duration-100 hover:text-xl focus:ring-0"
			on:click={() => (isSignUp = false)}
		>
			Sign In
		</Button>
		<Button
			color="light"
			class="w-32 {isSignUp
				? 'bg-tertiary! text-xl'
				: 'bg-accent! text-l'} text-text-colour font-ranchers transition-text rounded-none border-none p-4 duration-100 hover:text-xl focus:ring-0"
			on:click={() => (isSignUp = true)}
		>
			Sign Up
		</Button>
	</div>

	<form onsubmit={handleSubmit} class="space-y-4">
		{#if isSignUp}
			<div class="mb-6 w-full px-0 sm:w-96" transition:slide={{ duration: 300 }}>
				<Label
					for="first-name-input"
					class="font-commissioner text-text-colour! mb-2 block text-xl"
				>
					First Name
				</Label>
				<Input
					id="first-name-input"
					bind:value={first_name}
					type="text"
					required
					class="bg-secondary! border-accent! rounded-none border-2 border-solid focus:ring-0"
					disabled={isSubmitting}
					placeholder="John"
				/>
			</div>

			<div class="mb-6 w-full px-0 sm:w-96" transition:slide={{ duration: 300 }}>
				<Label for="surname-input" class="font-commissioner text-text-colour! mb-2 block text-xl">
					Surname
				</Label>
				<Input
					id="surname-input"
					bind:value={surname}
					type="text"
					required
					class="bg-secondary! border-accent! rounded-none border-2 border-solid focus:ring-0"
					disabled={isSubmitting}
					placeholder="Doe"
				/>
			</div>

			<div class="mb-6 w-full px-0 sm:w-96" transition:slide={{ duration: 300 }}>
				<Label for="postcode-input" class="font-commissioner text-text-colour! mb-2 block text-xl">
					Postcode
				</Label>
				<Input
					id="postcode-input"
					bind:value={postcode}
					type="text"
					required
					class="bg-secondary! border-accent! rounded-none border-2 border-solid focus:ring-0"
					disabled={isSubmitting}
					placeholder="SW1A 1AA"
				/>
			</div>
		{/if}

		<div class="mb-6 w-full px-0 sm:w-96">
			<Label for="email-input" class="font-commissioner text-text-colour! mb-2 block text-xl">
				Email address
			</Label>
			<Input
				id="email-input"
				bind:value={email}
				type="email"
				required
				class="bg-secondary! border-accent! rounded-none border-2 border-solid focus:ring-0"
				disabled={isSubmitting}
				placeholder="your.email@here.com"
			/>
		</div>

		<div class="flex flex-col">
			<Label for="password-input" class="font-commissioner text-text-colour! mb-2 block text-xl">
				Password
			</Label>
			<div class="relative">
				<Input
					id="password-input"
					bind:value={password}
					type="password"
					required
					class="bg-secondary! border-accent! rounded-none border-2 border-solid pr-32 focus:ring-0"
					disabled={isSubmitting}
					placeholder="••••••••"
				/>
				<Button 
					id="show-password" 
					class="absolute right-2 top-1/2 -translate-y-1/2 focus:ring-0 bg-transparent! border-none p-2 hover:cursor-pointer hover:shadow-sm hover:bg-accent!" 
					onclick={viewPassword}
					size="xs"
				>
					{#if passwordHidden}
						<i class="fa-solid fa-eye" style="color: #262625;"></i>
					{:else}
						<i class="fa-solid fa-eye-slash" style="color: #262625;"></i>
					{/if}
				</Button>
			</div>
		</div>

		<div class="flex justify-center">
			<Button
				type="submit"
				class="bg-tertiary! hover:bg-text-colour! text-text-colour! hover:text-tertiary! font-ranchers rounded-none border-none text-3xl transition-colors duration-200 focus:ring-0"
				size="lg"
				disabled={isSubmitting}
			>
				{#if isSubmitting}
					<Spinner class="mr-3" /> Loading...
				{:else}
					{isSignUp ? 'Sign Up' : 'Sign In'}
				{/if}
			</Button>
		</div>
	</form>

	{#if error}
		<Alert color="dark" rounded={false} class="bg-primary! mb-4 flex justify-center">
			{error}
		</Alert>
		{#if error.includes('Invalid') || error.includes('credentials')}
			<div class="flex flex-col items-center space-y-2 text-sm">
				<p>
					If you're unable to log in to your account please contact us on <a
						href="mailto:info@nappio.co.uk"
						class="text-accent!"
						onclick={(e) => {
							e.preventDefault();
							window.open('mailto:info@nappio.co.uk', '_blank');
						}}>info@nappio.co.uk</a
					>
				</p>
			</div>
		{/if}
	{/if}

	{#if message}
		<Alert color="dark" rounded={false} class="bg-tertiary! mb-4 flex justify-center">
			{message}
		</Alert>
	{/if}
</div>
