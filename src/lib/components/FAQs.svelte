<script>
    import { slide } from 'svelte/transition';
    import { cubicInOut } from 'svelte/easing';

    let expandedStates = {
        service: false,
        rinsing: false,
        pickup: false,
        cleaning: false,
        areas: false,
        cost: false,
        about: false
    };
</script>

<div class="p-5 flex flex-col items-center justify-center text-center">
    <div class="p-5 max-w-2xl text-left text-xl bg-accent2 shadow-sm mb-5">                        
        <p>
            <span>
                <img 
                    src="/images/logos/Nappio-Colour-Text-NoTag.png" 
                    alt="Nappio"
                    class="h-12 inline-block align-bottom"
                />
            is a small, local service run by parents in South London who know first-hand how intense parenting can be, and how many nappies you get through. We don't just run the service, we use it for our own babies! We're here to make cloth nappies easy, accessible, and genuinely sustainable for busy families like yours.</span>
        </p>
    </div>

    
    <h2 class="max-w-2xl w-full p-5 text-4xl text-text-colour font-ranchers bg-tertiary border-b">FAQs</h2>
    
    <!-- Service Section -->
    <div class="max-w-2xl w-full border-b shadow-sm">
        <button
            type="button"
            class="p-5 flex justify-between items-center w-full bg-secondary hover:bg-tertiary"
            on:click={() => expandedStates.service = !expandedStates.service}
            on:keydown={(e) => e.key === 'Enter' && (expandedStates.service = !expandedStates.service)}
            aria-expanded={expandedStates.service}
        >
            <h3 class="mr-2 text-2xl text-text-colour font-commissioner text-left">What is included in the service?</h3>
            <i class={expandedStates.service ? "fa-solid fa-minus fa-lg" : "fa-solid fa-plus fa-lg"} style="color: #262625;"></i>
        </button>
        {#if expandedStates.service}
            <div transition:slide={{ duration: 300, easing: cubicInOut }} class="text-left bg-background/50 p-4">
                <p>We make cloth nappies easy. Each week, Nappio drops off a fresh bundle of clean cloth nappies and picks up the used ones from your doorstep. Fore newborns, we will start you off with 40, for older babies, 35. But every baby is different, and we'll adjust the quantity so you always have just the right amount.</p>
                <br>
                <p>We provide the nappies,laundry bag, and a nappy bin. All you need are a few wraps to go over the cloth nappies. Each wrap will last you a few nappy changes (but usually need changing for a number 2!) and you keep hold of these - they can just be popped in a normal wash at home.</p>
                <br>
                <p>You can rent wraps from us for a little extra cost each month or buy them from our website.</p>
            </div>
        {/if}
    </div>

    <!-- Rinsing Section -->
    <div class="max-w-2xl w-full border-b shadow-sm">
        <button
            type="button"
            class="p-5 flex justify-between items-center w-full bg-secondary hover:bg-tertiary"
            on:click={() => expandedStates.rinsing = !expandedStates.rinsing}
            on:keydown={(e) => e.key === 'Enter' && (expandedStates.rinsing = !expandedStates.rinsing)}
            aria-expanded={expandedStates.rinsing}
        >
            <h3 class="mr-2 text-2xl text-text-colour font-commissioner text-left">Do I need to rinse the nappies?</h3>
            <i class={expandedStates.rinsing ? "fa-solid fa-minus fa-lg" : "fa-solid fa-plus fa-lg"} style="color: #262625;"></i>
        </button>
        {#if expandedStates.rinsing}
            <div transition:slide={{ duration: 300, easing: cubicInOut }} class="text-left bg-background/50 p-4">
                <p>No rinsing, no scrubbing, no washing, no drying, no stress. Once your baby is on solids, you can use our chemical free super soft bamboo liners and toss these in the bin. Otherwise, just pop the used nappies into the laundry bag we provide, which goes inside your nappy bin. Leave the rest to us. We'll collect your laundry bag full of dirties each week and at the same time, drop off a clean laundry bag filled with clean nappies. We will take the dirties away to be cleaned.</p>
            </div>
        {/if}
    </div>

    <!-- Pickup Section -->
    <div class="max-w-2xl w-full border-b shadow-sm">
        <button
            type="button"
            class="p-5 flex justify-between items-center w-full bg-secondary hover:bg-tertiary"
            on:click={() => expandedStates.pickup = !expandedStates.pickup}
            on:keydown={(e) => e.key === 'Enter' && (expandedStates.pickup = !expandedStates.pickup)}
            aria-expanded={expandedStates.pickup}
        >
            <h3 class="mr-2 text-2xl text-text-colour font-commissioner text-left">How do we organise pick-up and drop-off?</h3>
            <i class={expandedStates.pickup ? "fa-solid fa-minus fa-lg" : "fa-solid fa-plus fa-lg"} style="color: #262625;"></i>
        </button>
        {#if expandedStates.pickup}
            <div transition:slide={{ duration: 300, easing: cubicInOut }} class="text-left bg-background/50 p-4">
                <p>Once you sign up, we'll get in touch to find the best pick-up/drop-off spot near your home. If you live in a flat, we can get creative with bike sheds and other hidden corners. You don't need to be at home.</p>
                <br>
                <p>Once a week, we'll collect the used nappies and provide clean ones. </p>
                <br>
                <p>We'll also pop by your home at a time that suits you to give you a quick 121 on how to use our nappies - it's super easy.</p>
            </div>
        {/if}
    </div>

    <!-- Cleaning Section -->
    <div class="max-w-2xl w-full border-b shadow-sm">
        <button
            type="button"
            class="p-5 flex justify-between items-center w-full bg-secondary hover:bg-tertiary"
            on:click={() => expandedStates.cleaning = !expandedStates.cleaning}
            on:keydown={(e) => e.key === 'Enter' && (expandedStates.cleaning = !expandedStates.cleaning)}
            aria-expanded={expandedStates.cleaning}
        >
            <h3 class="mr-2 text-2xl text-text-colour font-commissioner text-left">How do you clean the nappies?</h3>
            <i class={expandedStates.cleaning ? "fa-solid fa-minus fa-lg" : "fa-solid fa-plus fa-lg"} style="color: #262625;"></i>
        </button>
        {#if expandedStates.cleaning}
            <div transition:slide={{ duration: 300, easing: cubicInOut }} class="text-left bg-background/50 p-4">
                <p>We use professional-grade machines, hot water, and baby-safe detergents. Every nappy is returned to you clean, fresh, and ready to use.</p>
            </div>
        {/if}
    </div>

    <!-- Areas Section -->
    <div class="max-w-2xl w-full border-b shadow-sm">
        <button
            type="button"
            class="p-5 flex justify-between items-center w-full bg-secondary hover:bg-tertiary"
            on:click={() => expandedStates.areas = !expandedStates.areas}
            on:keydown={(e) => e.key === 'Enter' && (expandedStates.areas = !expandedStates.areas)}
            aria-expanded={expandedStates.areas}
        >
            <h3 class="mr-2 text-2xl text-text-colour font-commissioner text-left">Which areas do you cover?</h3>
            <i class={expandedStates.areas ? "fa-solid fa-minus fa-lg" : "fa-solid fa-plus fa-lg"} style="color: #262625;"></i>
        </button>
        {#if expandedStates.areas}
            <div transition:slide={{ duration: 300, easing: cubicInOut }} class="text-left bg-background/50 p-4">
                <p>We currently operate in <strong>SW2</strong>, <strong>SW4</strong>, <strong>SW8</strong> and <strong>SW9</strong>.</p>
                <br>
                <p>Not in our area yet? <a class="font-ranchers hover:text-tertiary" href="/newsletter">Click here</a> to register your interest, we're always looking to expand!</p>
            </div>
        {/if}
    </div>

    <!-- Cost Section -->
    <div class="max-w-2xl w-full border-b shadow-sm">
        <button
            type="button"
            class="p-5 flex justify-between items-center w-full bg-secondary hover:bg-tertiary"
            on:click={() => expandedStates.cost = !expandedStates.cost}
            on:keydown={(e) => e.key === 'Enter' && (expandedStates.cost = !expandedStates.cost)}
            aria-expanded={expandedStates.cost}
        >
            <h3 class="mr-2 text-2xl text-text-colour font-commissioner text-left">How much does it cost?</h3>
            <i class={expandedStates.cost ? "fa-solid fa-minus fa-lg" : "fa-solid fa-plus fa-lg"} style="color: #262625;"></i>
        </button>
        {#if expandedStates.cost}
            <div transition:slide={{ duration: 300, easing: cubicInOut }} class="text-left bg-background/50 p-4">
                <p>Our basic charge is £20 per week. This includes professionally cleaned nappies every week, the storage bag and a nappy bin.</p>
                <br>
                <p>We charge a one-time registration fee of £40. As a small business, this helps us provide you with the best service and top-quality equipment to kickstart your journey with us.</p>
                <br>
                <p>For an extra fee of £2.00 per week, you can rent wraps from us (or purchase them directly from our website).</p>
            </div>
        {/if}
    </div>

    <!-- About Section -->
    <!-- <div class="max-w-2xl w-full">
        <button
            type="button"
            class="p-5 flex justify-between items-center w-full bg-secondary hover:bg-tertiary"
            on:click={() => expandedStates.about = !expandedStates.about}
            on:keydown={(e) => e.key === 'Enter' && (expandedStates.about = !expandedStates.about)}
            aria-expanded={expandedStates.about}
        >
            <h3 class="mr-2 text-2xl text-text-colour font-ranchers text-left">Who is Nappio?</h3>
            <i class={expandedStates.about ? "fa-solid fa-minus fa-lg" : "fa-solid fa-plus fa-lg"} style="color: #262625;"></i>
        </button>
        {#if expandedStates.about}
            <div transition:slide={{ duration: 300, easing: cubicInOut }} class="text-left bg-background/50 p-4">
                <p>Nappio is a small, local service run by parents in South London who know first-hand how intense parenting can be, and how many nappies you get through. We don't just run the service, we use it for our own babies! We're here to make cloth nappies easy, accessible, and genuinely sustainable for busy families like yours.</p>
            </div>
        {/if}
    </div> -->
</div>