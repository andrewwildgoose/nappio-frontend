<script>
    import { page } from "$app/state";
    let user = page.data.user;
    console.log("User in Navbar:", user);
    import { Navbar, NavBrand, NavLi, NavUl, NavHamburger } from "flowbite-svelte";
    let activeUrl = $derived(page.url.pathname);
    let activeClass = "text-tertiary bg-transparent";
    let nonActiveClass = "text-text-colour hover:bg-transparent hover:text-accent2";
    const ulClasses = "!bg-transparent text-text-colour flex flex-col p-4 mt-4 lg:flex-row lg:space-x-8 rtl:space-x-reverse lg:mt-0 text-sm font-bold border-0 dark:!bg-transparent dark:!border-0 lg:text-center";
</script>

<Navbar 
    fluid={true}
    color="custom"
    class="py-0 lg:max-h-[5rem] lg:flex justify-between lg:items-center"
    style="background-color: var(--color-accent); border-bottom: 1px solid var(--color-text-colour);"
    light={true}>
    <NavBrand href="/" class="flex-1">
        <span class="self-center whitespace-nowrap flex items-center gap-1">
            <img 
                src="/images/logos/Nappio-Colour-Text-cropped.png" 
                alt="Nappio text logo" 
                class="h-auto w-34 object-contain">
        </span>
    </NavBrand>
    <span class="self-center whitespace-nowrap flex flex-1 items-center gap-1 justify-center">
        <img 
            src="/images/logos/Nappio-v2-baby-yellow-cropped.png" 
            alt="Nappio baby logo" 
            class="h-auto w-38 object-contain relative top-2 lg:top-3">
        
    </span>
    <NavHamburger 
        class="text-text-colour flex flex-1 justify-end lg:hidden rounded-none m-0 p-0"
        menuClass="focus:outline-none hover:bg-transparent focus:text-tertiary" />
    <NavUl 
        ulClass={ulClasses} 
        {activeUrl} 
        {activeClass} 
        {nonActiveClass}
        divClass="w-full lg:block lg:w-auto lg:justify-end lg:flex lg:flex-1">
        <NavLi href="/">Home</NavLi>
        <NavLi href="/plans">Subscription plans</NavLi>
        <!-- <NavLi href="/register">Newsletter</NavLi> -->
        {#if user === null}
        <NavLi href="/signin">Sign in</NavLi>
        {:else}
        <NavLi href="/dashboard">Dashboard</NavLi>
        {/if}
    </NavUl>        
</Navbar>

