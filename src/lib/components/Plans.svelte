<script lang="ts">
    import type { Plan } from '$lib/types/plans';
    import { Button, Card } from 'flowbite-svelte';

    export let plans: Plan[] = [];
    export let error: string | null = null;

    function formatPrice(price: number): string {
        return `£${(price / 100).toFixed(2)}`;
    }
</script>

<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
    {#if error}
        <div class="col-span-full text-center text-red-500">
            Error: {error}
        </div>
    {:else if plans.length === 0}
        <div class="col-span-full text-center text-text-colour">
            No subscription plans are currently available.
        </div>
    {:else}
        <div class="col-span-full text-center text-text-colour mb-8">
            <div class="text-center text-text-colour mb-8">
                Choose a subscription plan that suits you best.
            </div>
            <div class="overflow-x-auto">
                <table class="w-full">
                    <thead>
                        <tr class="bg-gray-100">
                            <th class="p-4 text-left font-commissioner">Plan Name</th>
                            <th class="p-4 text-left font-commissioner">Description</th>
                            <th class="p-4 text-left font-commissioner">Price</th>
                            <th class="p-4"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {#each plans as plan (plan.id)}
                            <tr class="border-b hover:bg-gray-50">
                                <td class="p-4 font-commissioner text-text-colour">{plan.name}</td>
                                <td class="p-4 text-text-colour text-left">{plan.description}</td>
                                <td class="p-4">{formatPrice(plan.price)}</td>
                                <td class="p-4">
                                    <Button
                                        href={plan.stripe_link}
                                        class="bg-tertiary! hover:bg-accent! text-accent! hover:text-tertiary! font-commissioner rounded-none transition-colors duration-200"
                                    >
                                        Subscribe
                                    </Button>
                                </td>
                            </tr>
                        {/each}
                    </tbody>
                </table>
            </div>
        </div>
    {/if}
</div>