<script>
	import FAQs from '$lib/components/FAQs.svelte';
	import ImageBanner from '$lib/components/ImageBanner.svelte';
	import { bannerImages } from '$lib/data/imageBanners';
</script>

<svelte:head>
	<title>About - Nappio</title>
	<meta name="description" content="Learn more about Nappio, our mission and FAQs" />
</svelte:head>

<div>
	<div class="h-5"></div>
	
	<ImageBanner images={[...bannerImages.main]} speed={40} height="100px" gap="0px" />

	<FAQs />

	<div class="h-5"></div>

	<ImageBanner images={[...bannerImages.main]} speed={40} height="100px" gap="0px" />
</div>