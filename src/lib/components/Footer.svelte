<script>
    import { Footer, FooterCopyright, FooterLinkGroup, FooterBrand, FooterLink } from "flowbite-svelte";
</script>

<Footer footerType="logo" class="mt-6 rounded-none bg-primary border-t-text-colour dark:border-t-text-colour border-solid border-t-1">
    <div class="sm:flex sm:items-center sm:justify-between">
        <a href="/" aria-label="Go to Nappio homepage">
            <div class="bg-[url(/images/logos/Nappio-v3-Clear.png)] h-20 md:h-50 w-30 md:w-100 bg-contain bg-no-repeat bg-center mb-10"></div>
        </a>
        <!-- <FooterBrand href="/" src="/images/logos/Nappio-v3-Clear.png" alt="Nappio Logo" class="h-20" /> -->
        <FooterLinkGroup class="mb-6 flex flex-wrap items-center text-md text-text-colour sm:mb-0 dark:text-text-colour">
        <FooterLink aClass="hover:text-tertiary! font-commissioner font-bold" href="/">About</FooterLink>
        <FooterLink aClass="hover:text-tertiary! font-commissioner font-bold" href="/">Privacy Policy</FooterLink>
        <FooterLink aClass="hover:text-tertiary! font-commissioner font-bold" href="/">Contact</FooterLink>
        </FooterLinkGroup>
    </div>
    <hr class="my-6 border-text-colour sm:mx-auto lg:my-8 dark:border-text-colour" />
    <FooterCopyright href="/" by="Nappio™" spanClass="block text-text-colour text-center" />
</Footer>