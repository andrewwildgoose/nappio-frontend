<script>
    import EmailForm from "$lib/components/EmailForm.svelte";
    export let form; // This receives form data from the server

</script>

<div class="flex flex-col items-center justify center m-6">
    <div class="flex flex-col md:flex-row w-full m-6 mb-0 md:m-8 md:mb-0 justify-center shadow-sm border-1 border-text-colour">
        <div class="bg-accent p-6 justify-end flex flex-col flex-1"> 
            <h2 class="p-2 mb-2 text-4xl text-text-colour font-ranchers w-fit">Subscribe to our Newsletter</h2>
            <div class="p-2">
                <p class="text-l md:text-justify text-text-colour font-commissioner mb-3">
                    Sign up here for Nappio updates, news and offers. By subscribing, you'll be the first to know when we expand our service to reach new South London postcodes and launch special promotions.
                </p>
                <p class="text-l md:text-justify text-text-colour font-commissioner">
                    We'll also provide extra support and tips for using cloth nappies. Join Nappio's community of parents and caregivers and help us on our mission to bring organic cotton cloth nappies to South London babies, one bottom at a time.
                </p>
            </div>
        </div>    
            
        <div class="justify-end flex flex-col max-w-2xl text-left shadow-sm flex-1">      
            <img 
                src="/images/Nappio_CG_DSC00930.JPG" 
                alt="Happy baby in a cloth nappy" 
                class="w-full h-full object-cover" 
            />
        </div>
    </div>
    <div class="flex flex-col w-full p-6 m-6 mt-0 md:m-8 md:mt-0 bg-accent2 items-center justify-center shadow-sm border-1 md:border-t-0 border-text-colour">
        <EmailForm {form} />
    </div>
</div>
