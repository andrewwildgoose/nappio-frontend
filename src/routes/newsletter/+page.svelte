<script>
    import EmailForm from "$lib/components/EmailForm.svelte";
    export let form; // This receives form data from the server

</script>

<div class="flex flex-col md:flex-row w-full p-5 md:p-10 justify-center">
    <div class="md:mr-5 mb-5 md:mb-0 justify-end flex flex-col max-w-2xl text-left shadow-sm bg-[url(/images/Nappio_CG_DSC00930.JPG)] bg-center bg-cover">      
        <div class="w-full h-full bg-accent/70 p-5 justify-end flex flex-col backdrop-blur-xs"> 
        <!-- <div class="p-2 mb-2 bg-accent/50"> -->
            <h2 class="p-2 mb-2 text-4xl text-text-colour font-ranchers w-fit">Subscribe to our Newsletter</h2>
        <!-- </div> -->
            <div class="p-2">
                <p class="text-l md:text-justify text-text-colour font-commissioner mb-3">
                    Sign up here for Nappio updates, news and offers. By subscribing, you'll be the first to know when we expand our service to reach new South London postcodes and launch special promotions.
                </p>
                <p class="text-l md:text-justify text-text-colour font-commissioner">
                    We'll also provide extra support and tips for using cloth nappies. Join Nappio's community of parents and caregivers and help us on our mission to bring organic cotton cloth nappies to South London babies, one bottom at a time.
                </p>
            </div>
        </div>
    </div>
    <EmailForm {form} />
</div>