<script lang="ts">
	import '../app.css';
	let { children } = $props();

	import Navbar from '$lib/components/Navbar.svelte';
	import Footer from '$lib/components/Footer.svelte';
</script>

<Navbar />
{@render children()}
<Footer />

