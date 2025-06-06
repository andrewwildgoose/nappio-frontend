<script>
    import { page } from "$app/state";
    import { Navbar, NavBrand, NavLi, NavUl, NavHamburger } from "flowbite-svelte";
    let activeUrl = $derived(page.url.pathname);
    let activeClass = "text-tertiary bg-transparent";
    let nonActiveClass = "text-text-colour hover:bg-transparent hover:text-accent2";
    const ulClasses = "!bg-transparent text-text-colour flex flex-col p-4 mt-4 md:flex-row md:space-x-8 rtl:space-x-reverse md:mt-0 text-l font-bold border-0 dark:!bg-transparent dark:!border-0";
</script>

<Navbar 
    fluid={true}
    color="custom"
    style="background-color: var(--color-accent); border-bottom: 1px solid var(--color-text-colour);"
    light={true}>
    <NavBrand href="/">
        <span class="self-center text-xl whitespace-nowrap mb-2">    
            <h1 class="font-ranchers text-6xl text-text-colour fade-in">
                nappio
            </h1>
        </span>
    </NavBrand>
        <NavHamburger 
        class="text-text-colour hover:text-accent2 focus:ring-accent2"
        
        menuClass="focus:outline-none hover:bg-transparent focus:ring-2" />
    <NavUl ulClass={ulClasses} {activeUrl} {activeClass} {nonActiveClass}>
        <NavLi href="/">Home</NavLi>
        <NavLi href="/plans">Subscription plans</NavLi>
        <NavLi href="/register">Newsletter</NavLi>
        <NavLi href="/signin">Sign up | Log in</NavLi>
    </NavUl>
</Navbar>

