<script lang="ts">
    import type { PageData, } from './$types';
    import Plans from '$lib/components/Plans.svelte';


    export let data: PageData;
</script>

<div class="flex flex-col items-center justify-center">
    <div class="h-full w-full">
        <div class="flex flex-col items-center justify-center m-5 text-xl text-text-colour font-commissioner">
            <Plans plans={data.plans} error={data.error} />
        </div>
    </div>
</div>