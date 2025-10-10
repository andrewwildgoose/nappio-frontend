<script lang="ts">
	import '../app.css';
	let { children } = $props();

	import Navbar from '$lib/components/Navbar.svelte';
	import Footer from '$lib/components/Footer.svelte';
</script>

<svelte:head>
	<title>Nappio</title>
	<meta name="description" content="Cloth nappy service" />
</svelte:head>

<Navbar />
{@render children()}
<Footer />

