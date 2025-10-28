<script>
	import { onMount } from 'svelte';

	let animate = false;
	let fadeOut = false;

	onMount(() => {
		setTimeout(() => {
			animate = true;
		}, 500); // Small delay before animation starts
		setTimeout(() => {
			fadeOut = true;
		}, 2000); // Ensure fadeOut happens after move-down completes
	});
</script>

<div class="flex flex-col items-center justify-center">
	<h1 class="font-ranchers text-accent fade-in mt-4 text-6xl" class:move-up={animate}>nappio</h1>
	<div class="fade-in flex flex-row" class:move-down={animate} class:fade-out={fadeOut}>
		<h2 class="font-commissioner text-primary text-3xl" class:fade-out={fadeOut}>ethical.</h2>
		<h2 class="font-commissioner text-accent2 text-3xl" class:fade-out={fadeOut}>stylish.</h2>
		<h2 class="font-commissioner text-tertiary text-3xl" class:fade-out={fadeOut}>clean</h2>
	</div>
</div>

<style>
	@keyframes fade-in {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}

	@keyframes fade-out {
		from {
			opacity: 1;
		}
		to {
			opacity: 0;
		}
	}

	@keyframes move-up {
		from {
			transform: translateY(300px);
		}
		to {
			transform: translateY(0px);
		}
	}

	@keyframes move-down {
		from {
			transform: translateY(300px);
		}
		to {
			transform: translateY(600px);
		}
	}

	.fade-in {
		animation: fade-in 1s ease-out forwards;
		transform: translateY(300px);
	}

	.fade-out {
		animation: fade-out 1s ease-out forwards;
	}

	.move-up {
		animation: move-up 1.5s ease-out forwards;
		animation-delay: 1.5s; /* Delay to allow fade-in first */
	}

	.move-down {
		animation: move-down 1.5s ease-out forwards;
		animation-delay: 1.5s; /* Delay to allow fade-in first */
	}
</style>
