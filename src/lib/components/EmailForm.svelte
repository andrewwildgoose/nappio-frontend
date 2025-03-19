<script>
    import { Label, Select, Input, Button} from 'flowbite-svelte';
    import { ArrowRightOutline } from 'flowbite-svelte-icons';

    let selected = '';

    let postcodes = [
        { value: 'sw2', name: 'SW2' },
        { value: 'sw9', name: 'SW9' },
        { value: 'sw12', name: 'SW12' },
        { value: 'not shown', name: "I don't see my postcode listed here" },
    ];

    const submit = () => {
        alert('You clicked submit.');
    };
</script>

<div class="flex flex-col items-center justify-center">
    <h1 class="mb-6 font-ranchers text-6xl text-accent fade-in">
    nappio
    </h1>
    <form action="submit" class="flex flex-col items-center justify-center">
        <div class="w-96 mb-6">
            <Label for="email-input" class="block mb-2 font-ranchers text-3xl text-tertiary!">
                enter your email address
            </Label>
            <Input id="email-input" class="bg-secondary! border-solid border-2 border-accent! rounded-sm" size="lg" placeholder="register@your-interest.nappies" />
        </div>

        <div class="w-96 mb-6">
            <Label class="block mb-2 font-ranchers text-3xl text-tertiary!" for="select-postcode">
                select your postcode area
            </Label>
            <Select id="select-postcode" class="mt-2 bg-secondary! border-solid border-2 border-accent! rounded-sm" items={postcodes} bind:value={selected} />        
        </div>
        {#if selected === 'not shown'}
            <div class="w-150 mb-6 p-4 bg-secondary  border-solid border-2 border-accent! rounded-sm">
                <p class="font-roboto text-xl text-accent">We're currently offering our service in a limited set of postcodes local to our business. If your postcode didn't appear in the list above please type your postcode in to the box below. We use this information to decide where to expand our service to.</p>
            </div>
            <div class="w-96 mb-6">
                <Label for="not-served-postcode-input" class="block mb-2 font-ranchers text-3xl text-tertiary!">
                    type your postcode here
                </Label>
                <Input id="not-served-postcode-input" class="bg-secondary! border-solid border-2 border-accent! rounded-sm" size="lg" placeholder="postcode" />
            </div>
        {/if}      
    </form>

    <Button on:click={submit} class="bg-tertiary! text-accent! font-ranchers text-3xl" size="lg">
        submit <ArrowRightOutline class="w-5 h-5 ms-2" />
    </Button>


</div>
