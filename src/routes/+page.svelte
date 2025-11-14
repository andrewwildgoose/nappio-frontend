<script>
	import HompageInfo from '$lib/components/HompageInfo.svelte';
	import How from '$lib/components/How.svelte';
	// import ImageGrid from '$lib/components/ImageGrid.svelte';
	import ImageBanner from '$lib/components/ImageBanner.svelte';
	import { bannerImages } from '$lib/data/imageBanners';
</script>

<svelte:head>
	<title>Home - Nappio</title>
	<meta name="description" content="Welcome to Nappio, your source for organic cotton cloth nappies in South London" />
</svelte:head>

<div class="flex w-full flex-col">
	<HompageInfo />
	<How />
	<!-- <ImageGrid /> -->
	<ImageBanner images={[...bannerImages.main]} speed={40} height="100px" gap="0px" />
</div>
