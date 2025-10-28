import type { EmailOtpType } from '@supabase/supabase-js'
import { redirect } from '@sveltejs/kit'
import { createServerClient } from '@supabase/ssr'
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public'

import type { RequestHandler } from './$types'

export const GET: RequestHandler = async ({ url, cookies }) => {
    // Create a Supabase client for this request
    const supabase = createServerClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY, {
        cookies: {
            getAll: () => cookies.getAll(),
            setAll: (cookiesToSet) => {
                cookiesToSet.forEach(({ name, value, options }) => {
                    cookies.set(name, value, { ...options, path: '/' })
                })
            },
        },
    })

    const token_hash = url.searchParams.get('token_hash')
    const type = url.searchParams.get('type') as EmailOtpType | null
    const next = url.searchParams.get('next') ?? '/'

    /**
     * Clean up the redirect URL by deleting the Auth flow parameters.
     *
     * `next` is preserved for now, because it's needed in the error case.
     */
    const redirectTo = new URL(url)
    console.log('Verifying OTP with params:', { type, token_hash, next })
    console.log('Redirect URL before cleanup:', redirectTo.toString())
    redirectTo.pathname = next
    redirectTo.searchParams.delete('token_hash')
    redirectTo.searchParams.delete('type')
    console.log('Redirect URL after cleanup:', redirectTo.toString())

    if (token_hash && type) {
        const { error } = await supabase.auth.verifyOtp({ type, token_hash })
        if (!error) {
            redirectTo.searchParams.delete('next')
            redirect(303, redirectTo)
        }
    }

    redirectTo.pathname = '/auth/error'
    redirect(303, redirectTo)
}