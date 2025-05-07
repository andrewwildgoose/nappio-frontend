<script>
    import { page } from "$app/state";
    import { Navbar, NavBrand, NavLi, NavUl, NavHamburger } from "flowbite-svelte";
    let activeUrl = $derived(page.url.pathname);
    let activeClass = "text-primary md:bg-transparent md:text-primary";
    let nonActiveClass = "text-text-colour hover:bg-transparent md:hover:bg-transparent md:border-0 md:hover:text-accent";
    const ulClasses = "bg-background dark:bg-background text-text-colour dark:text-text-colour rounded-lg border border-text-colour dark:border-text-colour md:border-none md:dark:border-none divide-text-colour dark:divide-text-colour flex flex-col p-4 mt-4 md:flex-row md:space-x-8 rtl:space-x-reverse md:mt-0 md:text-l md:font-medium";

</script>

<Navbar class="bg-background dark:bg-background border-text-colour dark:border-text-colour md:bg-background dark:md:bg-background md:border-text-colour dark:md:border-text-colour">
    <NavBrand href="/">
        <!-- <img src="/images/flowbite-svelte-icon-logo.svg" class="me-3 h-6 sm:h-9" alt="Flowbite Logo" /> -->
        <span class="self-center text-xl whitespace-nowrap">    
            <h1 
            class="font-ranchers text-6xl text-accent fade-in mt-4"
            >
                nappio
            </h1>
        </span>
    </NavBrand>
    <NavHamburger/>
    <NavUl ulClass={ulClasses} {activeUrl} {activeClass} {nonActiveClass}>
        <NavLi href="/">Home</NavLi>
        <NavLi href="/plans">Subscription plans</NavLi>
        <NavLi href="/register">Newsletter</NavLi>
        <NavLi href="signin">Sign up | Log in</NavLi>
    </NavUl>
</Navbar>

