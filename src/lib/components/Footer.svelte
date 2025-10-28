<script>
	import { page } from '$app/state';
	import {
		Footer,
		FooterCopyright,
		FooterLinkGroup,
		FooterBrand,
		FooterLink
	} from 'flowbite-svelte';

	let isSignedIn = $derived(page.data.user != null);
</script>

<Footer
	footerType="logo"
	class="bg-tertiary border-t-text-colour dark:border-t-text-colour mt-6 rounded-none border-t-1 border-solid"
>
	<div class="sm:flex sm:items-center sm:justify-between">
		<a href="/" aria-label="Go to Nappio homepage">
			<div
				class="mb-10 h-20 w-30 bg-[url(/images/logos/Nappio-v3-Clear.png)] bg-contain bg-center bg-no-repeat md:h-50 md:w-100"
			></div>
		</a>
		<!-- <FooterBrand href="/" src="/images/logos/Nappio-v3-Clear.png" alt="Nappio Logo" class="h-20" /> -->
		<FooterLinkGroup
			class="text-md text-text-colour dark:text-text-colour mb-6 flex flex-wrap items-center sm:mb-0"
		>
			<FooterLink aClass="hover:underline font-commissioner font-bold" href="/about"
				>About</FooterLink
			>
			<FooterLink aClass="hover:underline font-commissioner font-bold" href="/subscribe"
				>Subscribe</FooterLink
			>
			<FooterLink aClass="hover:underline font-commissioner font-bold" href="/newsletter"
				>Newsletter</FooterLink
			>
			<li>
				<a
					class="font-commissioner mr-4 font-bold hover:underline md:mr-6"
					href="mailto:info@nappio.co.uk"
					onclick={(e) => {
						e.preventDefault();
						window.open('mailto:info@nappio.co.uk', '_blank');
					}}>Contact</a
				>
			</li>
			{#if isSignedIn}
				<FooterLink aClass="hover:underline font-commissioner font-bold" href="/private/dashboard"
					>Dashboard</FooterLink
				>
			{:else}
				<FooterLink aClass="hover:underline font-commissioner font-bold" href="/auth"
					>Sign In</FooterLink
				>
			{/if}
			<!-- <FooterLink aClass="hover:text-tertiary! font-commissioner font-bold" href="/">Privacy Policy</FooterLink> -->
		</FooterLinkGroup>
	</div>
	<hr class="border-text-colour dark:border-text-colour my-6 sm:mx-auto lg:my-8" />
	<FooterCopyright href="/" by="Nappio™" spanClass="block text-text-colour text-center" />
</Footer>
