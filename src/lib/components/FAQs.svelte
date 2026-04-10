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

<div class="flex flex-col items-center justify-center p-5 text-center">
	<div class="bg-accent2 mb-5 max-w-2xl p-5 text-left text-xl shadow-sm">
		<p>
			<span>
				<img
					src="/images/logos/Nappio-Colour-Text-NoTag.png"
					alt="Nappio"
					class="inline-block h-12 align-bottom"
				/>
				is a small, local service run by parents in South London who know first-hand how intense parenting
				can be, and how many nappies you get through. We don't just run the service, we use it for our
				own babies! We're here to make cloth nappies easy, accessible, and genuinely sustainable for
				busy families like yours.</span
			>
		</p>
	</div>

	<img src="/images/sitting-wrap.webp" alt="Baby in patterned wrap" class="mb-5 max-w-2xl shadow-sm border-1 border-text-colour" />

	<h2 class="text-text-colour font-ranchers bg-tertiary w-full max-w-2xl border-b p-5 text-4xl">
		FAQs
	</h2>

	<!-- Service Section -->
	<div class="w-full max-w-2xl border-b shadow-sm">
		<button
			type="button"
			class="bg-secondary hover:bg-tertiary flex w-full items-center justify-between p-5"
			on:click={() => (expandedStates.service = !expandedStates.service)}
			on:keydown={(e) => e.key === 'Enter' && (expandedStates.service = !expandedStates.service)}
			aria-expanded={expandedStates.service}
		>
			<h3 class="text-text-colour font-commissioner mr-2 text-left text-2xl">
				What is included in the service?
			</h3>
			<i
				class={expandedStates.service ? 'fa-solid fa-minus fa-lg' : 'fa-solid fa-plus fa-lg'}
				style="color: #262625;"
			></i>
		</button>
		{#if expandedStates.service}
			<div
				transition:slide={{ duration: 300, easing: cubicInOut }}
				class="bg-background/50 p-4 text-left"
			>
				<p>
					The short answer… everything! We include everything you need to use cloth nappies successfully 
					in our service: organic cotton nappies, waterproof covers, a smell-proof nappy bin, laundry 
					bags and a dry bag to keep your nappies protected from the rain on your doorstep.
					
				</p>
				<br />
				<p class="mb-2">
					We offer two subscriptions, part-time and full-time:
				</p>
				<ul class="list-disc list-inside">
					<li class="mb-2">
						Part-timers get up to 25 nappies a week. This subscription works well for those who want to mix with some disposables or wash-at-home cloth nappies.
					</li>
					<li>Full-timers get as many nappies as they need - usually around 40 nappies. This subscription works well for those who want to go all-in with cloth. We also provide additional boosters for use at night-time.</li>
				</ul>
				<br />
				<p>
					You can switch between part and full-time any time you like. Most customers like to start with part-time and graduate to full-time when they become cloth nappy pros. Some switch back down to part-time when their baby starts nursery.
				</p>
			</div>
		{/if}
	</div>

	<!-- Rinsing Section -->
	<div class="w-full max-w-2xl border-b shadow-sm">
		<button
			type="button"
			class="bg-secondary hover:bg-tertiary flex w-full items-center justify-between p-5"
			on:click={() => (expandedStates.rinsing = !expandedStates.rinsing)}
			on:keydown={(e) => e.key === 'Enter' && (expandedStates.rinsing = !expandedStates.rinsing)}
			aria-expanded={expandedStates.rinsing}
		>
			<h3 class="text-text-colour font-commissioner mr-2 text-left text-2xl">
				Do I need to rinse the nappies?
			</h3>
			<i
				class={expandedStates.rinsing ? 'fa-solid fa-minus fa-lg' : 'fa-solid fa-plus fa-lg'}
				style="color: #262625;"
			></i>
		</button>
		{#if expandedStates.rinsing}
			<div
				transition:slide={{ duration: 300, easing: cubicInOut }}
				class="bg-background/50 p-4 text-left"
			>
				<p>
					No rinsing, no scrubbing, no washing, no drying, no stress. Once your baby is on solids,
					you can use our chemical free super soft bamboo liners and toss these in the bin.
					Otherwise, just pop the used nappies into the laundry bag we provide, which goes inside
					your nappy bin. Leave the rest to us. We'll collect your laundry bag full of dirties each
					week and at the same time, drop off a clean laundry bag filled with clean nappies. We will
					take the dirties away to be cleaned.
				</p>
			</div>
		{/if}
	</div>

	<!-- Pickup Section -->
	<div class="w-full max-w-2xl border-b shadow-sm">
		<button
			type="button"
			class="bg-secondary hover:bg-tertiary flex w-full items-center justify-between p-5"
			on:click={() => (expandedStates.pickup = !expandedStates.pickup)}
			on:keydown={(e) => e.key === 'Enter' && (expandedStates.pickup = !expandedStates.pickup)}
			aria-expanded={expandedStates.pickup}
		>
			<h3 class="text-text-colour font-commissioner mr-2 text-left text-2xl">
				Do I need to be at home for the weekly pick-up/drop-off?
			</h3>
			<i
				class={expandedStates.pickup ? 'fa-solid fa-minus fa-lg' : 'fa-solid fa-plus fa-lg'}
				style="color: #262625;"
			></i>
		</button>
		{#if expandedStates.pickup}
			<div
				transition:slide={{ duration: 300, easing: cubicInOut }}
				class="bg-background/50 p-4 text-left"
			>
				<p>
					You don't need to be at home for pick-up/drop-off. We will agree a spot for you to leave your 
					dirties and for us to drop off your clean nappies.
				</p>
				<br />
				<p>
					Once you sign up, we'll get in touch to arrange a time that suits you to deliver your Nappio 
					kit to your home and give you a 121 on how to use our nappies. At this meeting, we can decide 
					on the best spot for pick-up/drop-off. This might be your doorstep, a bin shed or another hidden 
					corner. We can get creative!
				</p>
			</div>
		{/if}
	</div>

	<!-- Cleaning Section -->
	<div class="w-full max-w-2xl border-b shadow-sm">
		<button
			type="button"
			class="bg-secondary hover:bg-tertiary flex w-full items-center justify-between p-5"
			on:click={() => (expandedStates.cleaning = !expandedStates.cleaning)}
			on:keydown={(e) => e.key === 'Enter' && (expandedStates.cleaning = !expandedStates.cleaning)}
			aria-expanded={expandedStates.cleaning}
		>
			<h3 class="text-text-colour font-commissioner mr-2 text-left text-2xl">
				How do you clean the nappies?
			</h3>
			<i
				class={expandedStates.cleaning ? 'fa-solid fa-minus fa-lg' : 'fa-solid fa-plus fa-lg'}
				style="color: #262625;"
			></i>
		</button>
		{#if expandedStates.cleaning}
			<div
				transition:slide={{ duration: 300, easing: cubicInOut }}
				class="bg-background/50 p-4 text-left"
			>
				<p>
					Our professional laundry system sanitises the nappies using industrial machines, hot water and baby-safe 
					detergents. Nappies are delivered to you clean, fresh, and ready to use.
				</p>
			</div>
		{/if}
	</div>

	<!-- Self-washing Section -->
	<div class="w-full max-w-2xl border-b shadow-sm">
		<button
			type="button"
			class="bg-secondary hover:bg-tertiary flex w-full items-center justify-between p-5"
			on:click={() => (expandedStates.cleaning = !expandedStates.cleaning)}
			on:keydown={(e) => e.key === 'Enter' && (expandedStates.cleaning = !expandedStates.cleaning)}
			aria-expanded={expandedStates.cleaning}
		>
			<h3 class="text-text-colour font-commissioner mr-2 text-left text-2xl">
				Do I need to do any washing myself?
			</h3>
			<i
				class={expandedStates.cleaning ? 'fa-solid fa-minus fa-lg' : 'fa-solid fa-plus fa-lg'}
				style="color: #262625;"
			></i>
		</button>
		{#if expandedStates.cleaning}
			<div
				transition:slide={{ duration: 300, easing: cubicInOut }}
				class="bg-background/50 p-4 text-left"
			>
				<p>
					Our organic cotton cloth nappies absorb most of the pee and poop, leaving us to do the dirtiest job! 
					However, as part of the service, we will give you a set of waterproof covers to go over the top of 
					our nappies. These last for a few changes, and you wash these yourself at home. They can be washed 
					at 30-40 degrees with other laundry and air-dry super-fast.
				</p>
			</div>
		{/if}
	</div>

	<!-- Areas Section -->
	<div class="w-full max-w-2xl border-b shadow-sm">
		<button
			type="button"
			class="bg-secondary hover:bg-tertiary flex w-full items-center justify-between p-5"
			on:click={() => (expandedStates.areas = !expandedStates.areas)}
			on:keydown={(e) => e.key === 'Enter' && (expandedStates.areas = !expandedStates.areas)}
			aria-expanded={expandedStates.areas}
		>
			<h3 class="text-text-colour font-commissioner mr-2 text-left text-2xl">
				Which areas do you cover?
			</h3>
			<i
				class={expandedStates.areas ? 'fa-solid fa-minus fa-lg' : 'fa-solid fa-plus fa-lg'}
				style="color: #262625;"
			></i>
		</button>
		{#if expandedStates.areas}
			<div
				transition:slide={{ duration: 300, easing: cubicInOut }}
				class="bg-background/50 p-4 text-left"
			>
				<p>
					We currently operate in <strong>SW2</strong>, <strong>SW4</strong>, <strong>SW8</strong>
					and <strong>SW9</strong>.
				</p>
				<br />
				<p>
					Not in our area yet? <a class="font-ranchers hover:text-tertiary" href="/newsletter"
						>Click here</a
					> to register your interest, we're always looking to expand!
				</p>
			</div>
		{/if}
	</div>

	<!-- Cost Section -->
	<div class="w-full max-w-2xl border-b shadow-sm">
		<button
			type="button"
			class="bg-secondary hover:bg-tertiary flex w-full items-center justify-between p-5"
			on:click={() => (expandedStates.cost = !expandedStates.cost)}
			on:keydown={(e) => e.key === 'Enter' && (expandedStates.cost = !expandedStates.cost)}
			aria-expanded={expandedStates.cost}
		>
			<h3 class="text-text-colour font-commissioner mr-2 text-left text-2xl">
				How much does it cost?
			</h3>
			<i
				class={expandedStates.cost ? 'fa-solid fa-minus fa-lg' : 'fa-solid fa-plus fa-lg'}
				style="color: #262625;"
			></i>
		</button>
		{#if expandedStates.cost}
			<div
				transition:slide={{ duration: 300, easing: cubicInOut }}
				class="bg-background/50 p-4 text-left"
			>
				<p>
					To get you started, there's a one-off set-up cost of £40. This covers the costs of all the 
					extras you need (like laundry bags, a smell-proof bin, a dry bag to store nappies on collection 
					day and waterproof covers that are yours to use while you are a Nappio customer) and your 
					at-home visit.
				</p>
				<br />
				<p>
					After that, a part-time subscription (up to 25 nappies a week) costs £16 a week and a full-time 
					subscription (as many nappies as you need, but usually around 40) costs £20 a week.
				</p>
			</div>
		{/if}
	</div>
</div>
