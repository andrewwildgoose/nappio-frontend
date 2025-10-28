<script lang="ts">
	import '../app.css';
	import Navbar from '$lib/components/Navbar.svelte';
	import Footer from '$lib/components/Footer.svelte';	
	import { onMount } from 'svelte'  
	import { supabase } from '$lib/client/supabaseClient';
	import { user, session, loading } from '$lib/stores/auth';
	
	let { children } = $props()  

    onMount(() => {
        // Get initial session
        supabase.auth.getSession().then(({ data: { session: initialSession } }) => {
            session.set(initialSession);
            user.set(initialSession?.user ?? null);
            loading.set(false);
        });

        // Listen for auth changes
        const { data } = supabase.auth.onAuthStateChange((_event, newSession) => {
            console.log('[Layout] Auth state changed:', _event);
            session.set(newSession);
            user.set(newSession?.user ?? null);
            loading.set(false);
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

