<script lang="ts">
	import '../app.css';
	import Navbar from '$lib/components/Navbar.svelte';
	import Footer from '$lib/components/Footer.svelte';	
    import { invalidate } from '$app/navigation'  
	import { onMount } from 'svelte'  
	
	let { data, children } = $props()  
	let { session, supabase } = $derived(data)

    onMount(() => {
        const { data } = supabase.auth.onAuthStateChange((event, _session) => {
            console.log('[Layout] Auth event:', event);
            // Invalidate on ANY auth change event
            if (event === 'SIGNED_IN' || event === 'SIGNED_OUT' || event === 'TOKEN_REFRESHED') {
                console.log('[Layout] Invalidating supabase:auth');
                invalidate('supabase:auth');
            }
        });
        return () => data.subscription.unsubscribe();
    });
</script>

<svelte:head>
	<title>Nappio</title>
	<meta name="description" content="Cloth nappy service" />
</svelte:head>

<Navbar />
{@render children()}
<Footer />

