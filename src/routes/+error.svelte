<script>
	import { Label, Input, Button } from 'flowbite-svelte';
	import { ArrowRightOutline } from 'flowbite-svelte-icons';
</script>

<div class="flex flex-col items-center justify-center">
	<div class="h-full w-full">
		<div
			class="text-text-colour font-commissioner m-5 flex flex-col items-center justify-center text-xl"
		>
			<p>Oops! Sorry, we can't find the page you're looking for.</p>
			<Button
				href="/"
				class="bg-tertiary! hover:bg-accent! text-accent! hover:text-tertiary! font-commissioner rounded-none text-3xl transition-colors duration-200"
				size="lg"
			>
				Go to Homepage <ArrowRightOutline class="ms-2 h-5 w-5" />
			</Button>
		</div>
	</div>
</div>
