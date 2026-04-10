<script lang="ts">
	//import type { PageData } from './$types';
	import SubscriptionFlow from '$lib/components/SubscriptionFlow.svelte';

	export const data: any = {};
</script>

<svelte:head>
	<title>Subscribe - Nappio</title>
	<meta name="description" content="Create your subscription to Nappio" />
</svelte:head>


<div class="flex flex-col items-center justify-center">
	<div class="h-full min-h-screen w-full">
		<SubscriptionFlow />
	</div>
</div>
