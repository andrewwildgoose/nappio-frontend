<script>
    import EmailForm from "$lib/components/EmailForm.svelte";
    export let form; // This receives form data from the server

</script>

<div class="flex flex-col justify-center m-8 items-center">
    <div class="my-6 text-4xl sm:text-5xl text-center">
        <h2 class="text-text-colour font-ranchers">SUBSCRIBE TO OUR NEWSLETTER</h2>
    </div>
    <div class="min-h-max my-3 text-base text-center sm:text-xl text-text-colour font-commissioner">
        <p>Sign up here for Nappio updates, news and offers.</p>
        
    </div>
    <div class="flex p-5 max-w-2xl justify-center text-center text-xl bg-accent2 shadow-sm mb-5 mt-5">
        <p>We are currently taking on new customers! Subscribe to our newsletter and we will reach out to you directly over email to discuss.</p>
    </div>       
</div>
<div class="flex flex-col items-center justify-center m-6 shadow-sm">

    <div class="flex flex-col md:flex-row w-full mb-0 md:m-0 justify-center shadow-sm border-1 border-text-colour">
        <div class="bg-accent p-6 justify-center flex flex-col flex-1"> 
            <div class="p-2">
                <h2 class="text-text-colour font-ranchers text-4xl sm:text-5xl my-6">By subscribing</h2>
                <p class="text-l md:text-justify text-text-colour font-commissioner mb-3">
                    you'll be the first to know when we expand our service to reach new South London postcodes and launch special promotions. We'll also provide extra support and tips for using cloth nappies. 
                </p>
            </div>
        </div>    
            
        <div class="justify-end flex flex-col text-left shadow-sm flex-1 border-l-1 border-text-colour">      
            <img 
                src="/images/Nappio_CG_DSC00930.JPG" 
                alt="Happy baby in a cloth nappy" 
                class="w-full h-full object-cover" 
            />
        </div>
    </div>
    <div class="flex flex-col w-full items-center justify-center bg-primary border-1  border-t-0 border-text-colour">
        <div class="flex flex-col justify-center text-center w-full border-b-1 border-text-colourm min-h-86 bg-secondary">
            <div class="m-6 text-4xl sm:text-5xl">
                <h2 class="text-text-colour font-ranchers">Join Nappio's community of parents and caregivers</h2>
            </div>
            <div class="min-h-max m-5 text-base text-center sm:text-xl text-text-colour font-commissioner">
                <p>and help us on our mission to bring organic cotton cloth nappies to South London babies, one bottom at a time.</p>
            </div>        
        </div>
        <EmailForm {form} />
    </div>
</div>
