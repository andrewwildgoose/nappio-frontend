<script>
	import EmailForm from '$lib/components/EmailForm.svelte';
	export let form; // This receives form data from the server
</script>

<div class="m-8 flex flex-col items-center justify-center">
	<div class="my-6 text-center text-4xl sm:text-5xl">
		<h2 class="text-text-colour font-ranchers">SUBSCRIBE TO OUR NEWSLETTER</h2>
	</div>
	<div class="text-text-colour font-commissioner my-3 min-h-max text-center text-base sm:text-xl">
		<p>Sign up here for Nappio updates, news and offers.</p>
	</div>
</div>
<div class="m-6 flex flex-col items-center justify-center shadow-sm">
	<div
		class="border-text-colour mb-0 flex w-full flex-col justify-center border-1 shadow-sm md:m-0 md:flex-row"
	>
		<div class="bg-accent flex flex-1 flex-col justify-center p-6">
			<div class="p-2">
				<h2 class="text-text-colour font-ranchers my-6 text-4xl sm:text-5xl">By subscribing</h2>
				<p class="text-l text-text-colour font-commissioner mb-3 md:text-justify">
					you'll be the first to know when we expand our service to reach new South London postcodes
					and launch special promotions. We'll also provide extra support and tips for using cloth
					nappies.
				</p>
			</div>
		</div>

		<div class="border-text-colour flex flex-1 flex-col justify-end border-l-1 text-left shadow-sm">
			<img
				src="/images/Nappio_CG_DSC00930.JPG"
				alt="Happy baby in a cloth nappy"
				class="h-full w-full object-cover"
			/>
		</div>
	</div>
	<div
		class="bg-primary border-text-colour flex w-full flex-col items-center justify-center border-1 border-t-0"
	>
		<div
			class="border-text-colourm bg-secondary flex min-h-86 w-full flex-col justify-center border-b-1 text-center"
		>
			<div class="m-6 text-4xl sm:text-5xl">
				<h2 class="text-text-colour font-ranchers">
					Join Nappio's community of parents and caregivers
				</h2>
			</div>
			<div
				class="text-text-colour font-commissioner m-5 min-h-max text-center text-base sm:text-xl"
			>
				<p>
					and help us on our mission to bring organic cotton cloth nappies to South London babies,
					one bottom at a time.
				</p>
			</div>
		</div>
		<EmailForm {form} />
	</div>
</div>
