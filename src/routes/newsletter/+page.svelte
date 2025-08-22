<script>
    import EmailForm from "$lib/components/EmailForm.svelte";
    export let form; // This receives form data from the server

</script>

<div class="flex flex-col md:flex-row w-full p-5 md:p-10 justify-center">
    <div class="p-5 mb-5 md:mb-0 md:mr-5 max-w-2xl text-left bg-accent2 shadow-sm">      
        <h2 class="text-4xl text-text-colour font-ranchers mb-5">Subscribe to our Newsletter</h2>
        <p class="text-xl text-text-colour font-commissioner mb-3">
            Stay updated with the latest news, offers, and updates from South London's Cloth Nappy Service. Subscribe to our newsletter and be the first to know about our exciting journey as we prepare to launch our eco-friendly cloth nappy service.
        </p>
        <p class="text-xl text-text-colour font-commissioner mb-3">
            By subscribing, you'll receive exclusive insights into our service development, special promotions, and helpful tips on cloth nappy usage and care. Join our community of environmentally conscious parents and caregivers who are making a positive impact on the planet while providing the best for their little ones.
        </p>
        <p class="text-xl text-text-colour font-commissioner">
            Sign up today and be part of the movement towards a greener, cleaner future for our children!
        </p>
    </div>
    <EmailForm {form} />
</div>