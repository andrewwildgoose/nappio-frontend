<script>
	import { Button } from 'flowbite-svelte';
</script>

<!-- <div class="p-5 flex flex-col items-center justify-center text-center min-h-max w-full max-h-screen"> -->
<div class="flex items-center justify-center pt-20 text-center">
	<h2 class="text-text-colour font-ranchers m-5 text-5xl">How does it work?</h2>
</div>
<div class="flex flex-col items-center justify-center p-5 text-center">
	<div class="bg-primary m-5 w-9/10 max-w-2xl p-5 shadow-sm">
		<h3 class="text-text-colour font-ranchers text-2xl">We provide the nappies and all the extras you need</h3>
		<p>
			We give you enough organic cotton nappies to meet your weekly needs. Our prices include all extras - waterproof covers, laundry bags, a smell-proof nappy bin and a dry bag to keep your nappies protected from the rain on your doorstep.
		</p>
	</div>

	<div class="bg-secondary m-5 w-9/10 max-w-2xl p-5 shadow-sm">
		<h3 class="text-text-colour font-ranchers text-2xl">You use them, we collect them</h3>
		<p>
			No need to rinse, just remove the dirty nappies and store them in the smell-proof nappy bin until collection day.
		</p>
	</div>

	<div class="bg-tertiary m-5 w-9/10 max-w-2xl p-5 shadow-sm">
		<h3 class="text-text-colour font-ranchers text-2xl">Weekly pick-up & drop-off</h3>
		<p>
			Once a week, we collect the used nappies and deliver a fresh, sparkling clean batch straight to your door.
		</p>
	</div>
	<div class="bg-accent m-5 w-9/10 max-w-2xl p-5 shadow-sm">
		<h3 class="text-text-colour font-ranchers text-2xl">We do the dirty work</h3>
		<p>
			Our nappies are laundered and sanitised using professional processes.
		</p>
	</div>

	<div class="flex flex-col md:flex-row md:w-2xl md:max-w-full m-5 justify-center">
		<img src="/images/cloth-nappies-1.webp" alt="cloth nappy stock" class="h-auto w-full md:w-1/4 shadow-sm">
		<img src="/images/image-banner-1/nathan-bike-focus.webp" alt="toddler on bike" class="h-auto w-full md:w-1/4 shadow-sm">
		<img src="/images/laundry-bin-gif.webp" alt="laundry bin gif" class="h-auto w-full md:w-1/4 shadow-sm" />
		<img src="/images/image-banner-1/anais-dropoff-1.webp" alt="nappy dropoff" class="h-auto w-full md:w-1/4 shadow-sm">
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
