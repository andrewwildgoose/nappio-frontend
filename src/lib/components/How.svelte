<script>
	import { Button } from 'flowbite-svelte';
</script>

<!-- <div class="p-5 flex flex-col items-center justify-center text-center min-h-max w-full max-h-screen"> -->
<div class="flex items-center justify-center pt-20 text-center">
	<h2 class="text-text-colour font-ranchers m-5 text-5xl">How does it work?</h2>
</div>
<div class="flex flex-col items-center justify-center p-5 text-center">
	<div class="bg-primary m-5 max-w-2xl p-5 shadow-sm">
		<h3 class="text-text-colour font-ranchers text-2xl">We Provide the Nappies</h3>
		<p>
			We will provide you with advice and support as your baby grows to cloth nappy like a pro.
			We'll give you enough for the whole week.
		</p>
	</div>

	<div class="bg-secondary m-5 max-w-2xl p-5 shadow-sm">
		<h3 class="text-text-colour font-ranchers text-2xl">You Use Them, We Collect Them</h3>
		<p>
			Pop the used nappies into the bag we provide. No need to rinse or do anything, just store them
			until collection day.
		</p>
	</div>

	<div class="bg-tertiary m-5 max-w-2xl p-5 shadow-sm">
		<h3 class="text-text-colour font-ranchers text-2xl">Weekly Pick-Up & Drop-Off</h3>
		<p>
			Once a week, we'll collect the used nappies and deliver a fresh, professionally cleaned batch
			straight to your door.
		</p>
	</div>
	<div class="bg-accent m-5 max-w-2xl p-5 shadow-sm">
		<h3 class="text-text-colour font-ranchers text-2xl">We Do the Dirty Work</h3>
		<p>
			We wash, sanitise, and dry the nappies using baby-safe, eco-friendly detergents and
			high-standard cleaning processes.
		</p>
	</div>
	<h2 class="text-text-colour font-ranchers m-5 text-4xl">Easy peasy!</h2>

	<Button
		class="bg-tertiary! hover:bg-text-colour! text-text-colour! hover:text-tertiary! font-ranchers mt-5 rounded-none border-none p-8 text-3xl shadow-sm transition-colors duration-200"
		size="lg"
		href="/subscribe"
	>
		Get Started
	</Button>
</div>
