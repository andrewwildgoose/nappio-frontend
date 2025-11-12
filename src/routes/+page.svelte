<script>
	import HompageInfo from '$lib/components/HompageInfo.svelte';
	import How from '$lib/components/How.svelte';
	import ImageGrid from '$lib/components/ImageGrid.svelte';
</script>

<svelte:head>
	<title>Home - Nappio</title>
	<meta name="description" content="Welcome to Nappio, your source for organic cotton cloth nappies in South London" />
</svelte:head>

<div class="flex w-full flex-col">
	<HompageInfo />
	<How />
	<ImageGrid />
</div>
