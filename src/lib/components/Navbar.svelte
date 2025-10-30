<script>
	import { page } from '$app/state';
	import { Navbar, NavBrand, NavLi, NavUl, NavHamburger } from 'flowbite-svelte';
	import { user } from '$lib/stores/auth';
	let isSignedIn = $derived($user != null);
	let activeUrl = $derived(page.url.pathname);
	let activeClass = 'text-text-colour rounded-none p-1 shadow-sm border-1 border-text-colour bg-accent2';
	let nonActiveClass = 'text-text-colour hover:bg-transparent hover:text-accent2 p-1';
	const ulClasses = '!bg-transparent text-2xl text-text-colour rounded-none flex flex-col p-4 mt-4 md:flex-row md:space-x-4 rtl:space-x-reverse md:mt-0 md:text-sm font-bold border-0 dark:!bg-transparent dark:!border-0 md:text-center';

</script>

<Navbar
	fluid={true}
	color="custom"
	class="justify-between py-0 lg:flex lg:max-h-[5rem] lg:items-center"
	style="background-color: var(--color-accent); border-bottom: 1px solid var(--color-text-colour);"
	light={true}
>
	<NavBrand href="/" class="flex-1">
		<span class="flex items-center gap-1 self-center whitespace-nowrap">
			<img
				src="/images/logos/Nappio-Colour-Text-cropped.png"
				alt="Nappio text logo"
				class="h-auto w-34 object-contain"
			/>
		</span>
	</NavBrand>
	<span class="flex items-center justify-center gap-1 self-center whitespace-nowrap">
		<img
			src="/images/logos/Nappio-v2-baby-yellow-cropped.png"
			alt="Nappio baby logo"
			class="relative top-2 top-3 z-10 h-auto w-38 object-contain"
		/>
	</span>
	<NavHamburger
		class="text-text-colour z-20 m-0 flex flex-1 justify-end rounded-none p-0 hover:bg-transparent! md:hidden"
		menuClass="focus:outline-none hover:bg-transparent! hover:cursor-pointer!"
	/>
	<NavUl
		ulClass={ulClasses}
		{activeUrl}
		{activeClass}
		{nonActiveClass}
		divClass="w-full text-center border-t-1 md:border-none md:block md:w-auto md:justify-end md:flex md:flex-1"
	>
		<NavLi href="/">Home</NavLi>
		<NavLi href="/about">About</NavLi>
		<NavLi href="/subscribe">Subscribe</NavLi>
		<NavLi href="/newsletter">Newsletter</NavLi>
		{#if isSignedIn}
			<NavLi href="/private/dashboard">Dashboard</NavLi>
		{:else}
			<NavLi href="/auth">Sign in</NavLi>
		{/if}
	</NavUl>
</Navbar>
