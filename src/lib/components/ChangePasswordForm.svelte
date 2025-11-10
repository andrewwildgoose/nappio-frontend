<script lang="ts">
	import { Button, Input, Alert, Label, Spinner } from 'flowbite-svelte';
	import { goto } from '$app/navigation';
	import { supabase } from '$lib/client/supabaseClient';
    import { session } from '$lib/stores/auth';

	let isSubmitting = false;
	let passwordHidden = true;
	let confirmPasswordHidden = true;
	let updateError = '';
	let message = '';

	let password = '';
	let confirmPassword = '';

	async function handleUpdatePassword() {
		isSubmitting = true;
		updateError = '';
		message = '';

		if (!password || !confirmPassword) {
			updateError = 'Please fill in all fields';
			isSubmitting = false;
			return;
		}

		if (password !== confirmPassword) {
			updateError = 'Passwords do not match';
			isSubmitting = false;
			return;
		}

		if (password.length < 6) {
			updateError = 'Password must be at least 6 characters long';
			isSubmitting = false;
			return;
		}

		console.log('Updating password for user:', $session?.user?.email);

		const { data, error } = await supabase.auth.updateUser({
			password: password
		});

		console.log('Update result:', data);

		if (error) {
			updateError = error.message;
			isSubmitting = false;
			return;
		}

		message = 'Password updated successfully! Redirecting to dashboard...';
		
		// Redirect to dashboard after a short delay
		setTimeout(async () => {
			await goto('/private/dashboard');
		}, 2000);
		
		isSubmitting = false;
	}

	async function handleSubmit(event: Event) {
		event.preventDefault();
		await handleUpdatePassword();
	}

	function viewPassword(inputId: string) {
		const x = document.getElementById(inputId) as HTMLInputElement;
		if (x.type === "password") {
			x.type = "text";
		} else {
			x.type = "password";
		}
		
		if (inputId === "password-input") {
			passwordHidden = !passwordHidden;
		} else {
			confirmPasswordHidden = !confirmPasswordHidden;
		}
	}
</script>

<div
	class="bg-background/50 mx-auto flex w-full max-w-md flex-col space-y-4 p-2 p-5 shadow-sm transition-all duration-300 ease-in-out md:p-8"
>
	<div class="mb-6 flex w-full justify-center">
		<h2 class="text-text-colour font-ranchers text-3xl">Change Password</h2>
	</div>

	<form onsubmit={handleSubmit} class="space-y-4">
		<div class="flex flex-col">
			<Label for="password-input" class="font-commissioner text-text-colour! mb-2 block text-xl">
				New Password
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
					onclick={() => viewPassword('password-input')}
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

		<div class="flex flex-col">
			<Label for="confirm-password-input" class="font-commissioner text-text-colour! mb-2 block text-xl">
				Confirm New Password
			</Label>
			<div class="relative">
				<Input
					id="confirm-password-input"
					bind:value={confirmPassword}
					type="password"
					required
					class="bg-secondary! border-accent! rounded-none border-2 border-solid pr-32 focus:ring-0"
					disabled={isSubmitting}
					placeholder="••••••••"
				/>
				<Button 
					id="show-confirm-password" 
					class="absolute right-2 top-1/2 -translate-y-1/2 focus:ring-0 bg-transparent! border-none p-2 hover:cursor-pointer hover:shadow-sm hover:bg-accent!" 
					onclick={() => viewPassword('confirm-password-input')}
					size="xs"
				>
					{#if confirmPasswordHidden}
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
					Update Password
				{/if}
			</Button>
		</div>
	</form>

	{#if updateError}
		<Alert color="dark" rounded={false} class="bg-primary! mb-4 flex justify-center">
			{updateError}
		</Alert>
	{/if}

	{#if message}
		<Alert color="dark" rounded={false} class="bg-tertiary! mb-4 flex justify-center">
			{message}
		</Alert>
	{/if}
</div>
