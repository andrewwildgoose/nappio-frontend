<script lang="ts">
    //import type { PageData } from './$types';
    import SubscriptionFlow from '$lib/components/SubscriptionFlow.svelte';

    export const data: any = {};
</script>

<div class="flex flex-col items-center justify-center">
    <div class="h-full w-full min-h-screen">
        <SubscriptionFlow />
    </div>
</div>