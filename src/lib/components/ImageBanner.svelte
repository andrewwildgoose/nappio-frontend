<script lang="ts">
	interface Props {
		images: string[];
		speed?: number; // Duration in seconds for one complete scroll cycle
		height?: string; // Height of the banner (e.g., '200px', '10rem')
		gap?: string; // Gap between images (e.g., '1rem', '20px')
	}

	let { images, speed = 30, height = '100px', gap = '0px' }: Props = $props();

	// Duplicate images exactly once - when the first set scrolls off completely,
	// the second set will be in the exact same position, making the reset invisible
	const duplicatedImages = [...images, ...images, ...images, ...images, ...images];
</script>

<div class="image-banner-container" style="--banner-height: {height}; --image-gap: {gap};">
	<div class="image-banner-track" style="--scroll-duration: {speed}s;">
		{#each duplicatedImages as image, index}
			<div class="image-wrapper">
				<img src={image} alt="Banner image {index + 1}" class="banner-image" />
			</div>
		{/each}
	</div>
</div>

<style>
	.image-banner-container {
		width: 100%;
		overflow: hidden;
		border-top: 1px solid var(--color-text-colour);
		border-bottom: 1px solid var(--color-text-colour);
		background-color: var(--color-background);
		position: relative;
	}

	.image-banner-track {
		display: flex;
		gap: var(--image-gap);
		width: max-content;
		animation: scroll var(--scroll-duration) linear infinite;
	}

	/* .image-banner-track:hover {
		animation-play-state: paused;
	} */

	.image-wrapper {
		position: relative;
		height: var(--banner-height);
		flex-shrink: 0;
		display: block;
	}

	.image-wrapper::after {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		box-shadow: inset 0 0 3px rgba(0, 0, 0, 1);
		pointer-events: none;
	}

	.banner-image {
		height: 100%;
		width: auto;
		object-fit: contain;
		border-right: 1px solid var(--color-text-colour);
		display: block;
		/* border-radius: 4px; */
		/* box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); */
	}

	@keyframes scroll {
		0% {
			transform: translateX(0);
		}
		100% {
			/* Move by exactly one-third of the track width since we have 3 copies */
			transform: translateX(-20%);
		}
	}

	/* Pause animation on reduced motion preference */
	@media (prefers-reduced-motion: reduce) {
		.image-banner-track {
			animation: none;
		}
	}
</style>
