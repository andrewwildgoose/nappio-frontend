# Sitemap & Page-by-Page Copy Audit — Nappio Frontend

This document is a complete sitemap and copy audit for the `nappio-frontend` application. Copy is extracted directly from the source files. Where text is dynamically generated at runtime the relevant note is included under each page.

---

## Sitemap

| # | Route | Title | Type |
|---|-------|-------|------|
| 1 | `/` | Home | Public |
| 2 | `/about` | About / FAQs | Public |
| 3 | `/subscribe` | Subscribe | Public (auth-gated flow) |
| 4 | `/newsletter` | Newsletter | Public |
| 5 | `/privacy-policy` | Privacy Policy | Public |
| 6 | `/auth` | Sign In / Sign Up | Public |
| 7 | `/reset-password` | Reset Password | Public |
| 8 | `/update-password` | Update Password | Auth callback |
| 9 | `/confirm-email` | Confirm Email | Auth callback |
| 10 | `/auth/callback` | Auth Callback | Auth callback |
| 11 | `/checkout` | Building Checkout | Post-subscription redirect |
| 12 | `/success` | Success / Confirmation | Post-action confirmation |
| 13 | `/error` | Subscription Failed | Error state |
| 14 | `+error` (SvelteKit error boundary) | Not Found / Error | Error state |
| 15 | `/private/dashboard` | Dashboard | Authenticated only |

### Shared site chrome links (Navbar & Footer)

Navbar (all pages):
- `/` — Home
- `/about` — About
- `/subscribe` — Subscribe
- `/newsletter` — Newsletter
- `/auth` — Sign in *(shown when signed out)*
- `/private/dashboard` — Dashboard *(shown when signed in)*

Footer (all pages):
- `/about` — About
- `/subscribe` — Subscribe
- `/newsletter` — Newsletter
- `mailto:info@nappio.co.uk` — Contact
- `/auth` — Sign In *(shown when signed out)*
- `/private/dashboard` — Dashboard *(shown when signed in)*
- `/privacy-policy` — Privacy Policy
- Copyright line: `© 2025 Nappio™`

---

## Page Details

---

### 1. `/` — Home

**Page URL:** `/`  
**Page title (browser tab):** `Home - Nappio`  
**Meta description:** `Welcome to Nappio, your source for organic cotton cloth nappies in South London`  
**Page purpose:** Introduces the Nappio service, explains how it works at a high level, and directs visitors to start a subscription.

**Exact on-page copy:**

Hero section:
- `Organic cotton cloth nappies delivered to your doorstep every week.`

How it works section:
- `How does it work?`
- `We provide the nappies and all the extras you need`
- `We give you enough organic cotton nappies to meet your weekly needs. Our prices include all extras - waterproof covers, laundry bags, a smell-proof nappy bin and a dry bag to keep your nappies protected from the rain on your doorstep.`
- `You use them, we collect them`
- `No need to rinse, just remove the dirty nappies and store them in the smell-proof nappy bin until collection day.`
- `Weekly pick-up & drop-off`
- `Once a week, we collect the used nappies and deliver a fresh, sparkling clean batch straight to your door.`
- `We do the dirty work`
- `Our nappies are laundered and sanitised using professional processes.`
- `Easy peasy!`
- `Get Started` *(button, links to `/subscribe`)*

**Notes for dynamically generated text:**
- No dynamic copy on the visible homepage text.
- Navbar auth link is dynamic: shows `Sign in` (links to `/auth`) when signed out; shows `Dashboard` (links to `/private/dashboard`) when signed in. Same applies to Footer.

---

### 2. `/about` — About / FAQs

**Page URL:** `/about`  
**Page title (browser tab):** `About - Nappio`  
**Meta description:** `Learn more about Nappio, our mission and FAQs`  
**Page purpose:** Introduces the Nappio team/mission and answers frequently asked questions about the service.

**Exact on-page copy:**

About blurb:
- `Nappio is a small, local service run by parents in South London who know first-hand how intense parenting can be, and how many nappies you get through. We don't just run the service, we use it for our own babies! We're here to make cloth nappies easy, accessible, and genuinely sustainable for busy families like yours.`

FAQs heading:
- `FAQs`

FAQ: **What is included in the service?**
> The short answer… everything! We include everything you need to use cloth nappies successfully in our service: organic cotton nappies, waterproof covers, a smell-proof nappy bin, laundry bags and a dry bag to keep your nappies protected from the rain on your doorstep.
>
> We offer two subscriptions, part-time and full-time:
> - Part-timers get up to 25 nappies a week. This subscription works well for those who want to mix with some disposables or wash-at-home cloth nappies.
> - Full-timers get as many nappies as they need - usually around 40 nappies. This subscription works well for those who want to go all-in with cloth. We also provide additional boosters for use at night-time.
>
> You can switch between part and full-time any time you like. Most customers like to start with part-time and graduate to full-time when they become cloth nappy pros. Some switch back down to part-time when their baby starts nursery.

FAQ: **Do I need to rinse the nappies?**
> No rinsing, no scrubbing, no washing, no drying, no stress. Once your baby is on solids, you can use our chemical free super soft bamboo liners and toss these in the bin. Otherwise, just pop the used nappies into the laundry bag we provide, which goes inside your nappy bin. Leave the rest to us. We'll collect your laundry bag full of dirties each week and at the same time, drop off a clean laundry bag filled with clean nappies. We will take the dirties away to be cleaned.

FAQ: **Do I need to be at home for the weekly pick-up/drop-off?**
> You don't need to be at home for pick-up/drop-off. We will agree a spot for you to leave your dirties and for us to drop off your clean nappies.
>
> Once you sign up, we'll get in touch to arrange a time that suits you to deliver your Nappio kit to your home and give you a 121 on how to use our nappies. At this meeting, we can decide on the best spot for pick-up/drop-off. This might be your doorstep, a bin shed or another hidden corner. We can get creative!

FAQ: **How do you clean the nappies?**
> Our professional laundry system sanitises the nappies using industrial machines, hot water and baby-safe detergents. Nappies are delivered to you clean, fresh, and ready to use.

FAQ: **Do I need to do any washing myself?**
> Our organic cotton cloth nappies absorb most of the pee and poop, leaving us to do the dirtiest job! However, as part of the service, we will give you a set of waterproof covers to go over the top of our nappies. These last for a few changes, and you wash these yourself at home. They can be washed at 30-40 degrees with other laundry and air-dry super-fast.

FAQ: **Which areas do you cover?**
> We currently operate in **SW2**, **SW4**, **SW8** and **SW9**.
>
> Not in our area yet? [Click here](/newsletter) to register your interest, we're always looking to expand!

FAQ: **How much does it cost?**
> To get you started, there's a one-off set-up cost of £40. This covers the costs of all the extras you need (like laundry bags, a smell-proof bin, a dry bag to store nappies on collection day and waterproof covers that are yours to use while you are a Nappio customer) and your at-home visit.
>
> After that, a part-time subscription (up to 25 nappies a week) costs £16 a week and a full-time subscription (as many nappies as you need, but usually around 40) costs £20 a week.

**Notes for dynamically generated text:**
- All FAQ content is static in the component.
- FAQ items are individually expandable/collapsible (accordion). The copy above represents all expanded content.
- `Click here` in the "Which areas do you cover?" answer links to `/newsletter`.

---

### 3. `/subscribe` — Subscription Signup Flow

**Page URL:** `/subscribe`  
**Page title (browser tab):** `Subscribe - Nappio`  
**Meta description:** `Create your subscription to Nappio`  
**Page purpose:** Multi-step subscription signup flow (5 steps). Collects subscription preferences, baby details, address, and optionally a RNFL voucher code before redirecting to Stripe checkout.

The flow has a progress bar and five step titles shown on desktop:
- `1. Welcome to Nappio`
- `2. About Your Baby`
- `3. Nappy Quantity`
- `4. Delivery Address`
- `5. RNFL Voucher`

---

#### Step 1 — Welcome to Nappio

**Exact on-page copy:**

- `Welcome to` + Nappio logo
- `We're excited to get you started with our nappy service.`

**Our subscription includes** (4 cards):
- `Enough cloth nappies to meet your weekly needs`
- `Weekly drop and off and collection`
- `Professional laundering`
- `All extras you need to cloth nappy like a pro`

**Pricing Details** section:

*Getting started* card:
- `Getting started`
- `There's a one-off £40 set-up fee, which covers all extras (laundry bags, smell-proof bin, waterproof covers and a dry bag) plus an at-home visit to show you how to use the nappies.`
- `The fee is taken at checkout when you confirm your subscription. We'll then contact you within 48 hours to arrange your home visit and get you started.`

*Subscription* card:
- `Subscription`
- `After your home visit and once we've agreed your start date, your weekly subscription begins on the day your first batch of nappies is delivered.`
- `A part-time subscription (up to 25 nappies per week) is £16 per week, and a full-time subscription (usually around 40 nappies, or as many as you need) is £20 per week.`

*Help with the set-up fee* card:
- `Help with the set-up fee`
- `You can apply for a voucher provided by Real Nappies For London which will cover the set-up fee.`
- `Find out more and sign up for a voucher` *(button, opens `https://www.realnappiesforlondon.org.uk/apply/` in a new tab)*
- `Once you have your voucher you'll be able to enter the voucher code just before the checkout step of this subscription process and your set-up fee will be waived.`

**Service Area** section:
- `Service Area`
- `Our service is currently available in:` followed by the list of active postcodes *(dynamically loaded from the API — see note below)*
- `If your postcode is not yet covered, register your interest by signing up to our newsletter and we'll keep you updated as our service area expands.`
- `My postcode isn't listed` *(button, links to `/newsletter`)*

Conditional banners (mutually exclusive):
- When subscriptions are **disabled**: `We've been overwhelmed by demand and don't have capacity for new subscriptions at this time. Please sign up to our newsletter to be notified when we reopen subscriptions.`
- When the user is **not signed in**: `You'll need to sign in or set up your account with us before starting your subscription.`

Navigation buttons (bottom of every step):
- `Previous` *(disabled on step 1)*
- When subscriptions disabled: `Sign up for updates` *(links to `/newsletter`)*
- When not signed in: `Sign in or sign up to continue`
- Otherwise: `Next` / `Complete Subscription` *(final step)*

**Notes for dynamically generated text:**
- The postcode list next to "Our service is currently available in:" is fetched from the `/api/service-areas` endpoint at page load time. The FAQ/About page hard-codes SW2, SW4, SW8, SW9 as examples but the live list is API-driven.
- The `PUBLIC_SUBSCRIPTIONS_ENABLED` environment variable controls whether the subscriptions-disabled banner is shown.

---

#### Step 2 — About Your Baby

**Exact on-page copy:**

- `Tell us about your baby`
- `We use this information to make sure your baby gets the right size nappies.`
- `Baby's Birth Date` *(date input label)*
- `Approximate Weight (kg)` *(number input label)*

---

#### Step 3 — Nappy Quantity

**Exact on-page copy:**

- `Do you need a part-time or full-time subscription?`
- `Every family is different! Choose the subscription type that best suits your needs based on our guidance below.`

Part-time card:
- `Part-time use`
- `Part-timers get up to 25 nappies a week. This subscription works well for those who want to mix with some disposables or wash-at-home cloth nappies. Part-timers get 3 waterproof nappy covers.`

Full-time card:
- `Full-time use`
- `Full-timers get as many nappies as they need - usually around 40 nappies. We recommend this option for people going all in with cloth and using it around the clock. Full-timers get 6 waterproof covers and boosters to add to nappies overnight.`

Both subscriptions include:
- `Both subscriptions include all the extras you will need, including:`
  - `smell-proof nappy bin`
  - `laundry bag`
  - `dry bag (for storing nappies outside on collection day)`
  - `waterproof covers.`
- `You can switch between part and full-time any time you like. Most customers like to start with part-time and graduate to full-time as they become cloth nappy pros. Some switch back down to part-time when their baby starts nursery.`
- `Not sure which subscription will work best for you? No problem. Email us at info@nappio.co.uk and we can help you make the right decision for you.`

Selection buttons:
- `Part-time use` / `£16/week`
- `Full-time use` / `£20/week`

**Notes for dynamically generated text:**
- The selected subscription button is highlighted visually. Default selection is `Full-time use`.

---

#### Step 4 — Delivery Address

**Exact on-page copy:**

- `Where will we be delivering to?`
- `Let us know your main delivery address, this is where we'll hold your introductory session and your subsequent collections and deliveries. You can also add notes about your delivery preferences.`

If the user has saved addresses (shown only when signed in with existing addresses):
- `Select from your saved addresses`
- `Select an address` *(dropdown placeholder)*
- `Or enter a new delivery address below.`

Address out-of-area message (shown when entered postcode is not in service area):
- `Our service is currently available in:` followed by the active postcodes *(dynamically loaded)*

---

#### Step 5 — RNFL Voucher

**Notes for dynamically generated text:**
- Step 5 ("5. RNFL Voucher") is defined in the steps array and referenced in the progress bar but no UI content block for this step exists in the current source code. The step title appears in the progress bar indicator but the step's UI body is not implemented yet. The `voucherCode` state variable exists and is passed as a hidden form field.

---

### 4. `/newsletter` — Newsletter Signup

**Page URL:** `/newsletter`  
**Page title (browser tab):** `Newsletter - Nappio`  
**Meta description:** `Subscribe to the Nappio newsletter for updates, news, and offers`  
**Page purpose:** Allows visitors to sign up to the Nappio mailing list.

**Exact on-page copy:**

- `SUBSCRIBE TO OUR NEWSLETTER`
- `Sign up here for Nappio updates, news and offers.`

Left panel:
- `By subscribing`
- `you'll be the first to know when we expand our service to reach new South London postcodes and launch special promotions. We'll also provide extra support and tips for using cloth nappies.`

Lower section:
- `Join Nappio's community of parents and caregivers`
- `and help us on our mission to bring organic cotton cloth nappies to South London babies, one bottom at a time.`

Form field labels:
- `First name`
- `Email address`
- `Postcode area (first 3-4 letters)`
- `We ask for the first half of your postcode in order to determine where to expand to next.`

Form placeholders:
- `Type your first name here`
- `register@your-interest.nappies`
- `SW2`

Submit button:
- `Submit` *(with right-arrow icon)*
- `Submitting...` *(while in progress)*

**Notes for dynamically generated text:**
- On successful submission, the user is redirected to `/success?email=<email>` (type `newsletter`).
- On failure, the user is redirected to `/error?message=<error>&email=<email>`.

---

### 5. `/privacy-policy` — Privacy Policy

**Page URL:** `/privacy-policy`  
**Page title (browser tab):** `Privacy Policy - Nappio`  
**Meta description:** `Read Nappio's Privacy Policy and learn how we collect, use, store, and protect your personal data.`  
**Page purpose:** Full UK GDPR-compliant privacy policy.

**Exact on-page copy:**

- `Privacy Policy`
- `Nappio ("we", "us", "our") is committed to protecting your personal data and respecting your privacy. This Privacy Policy explains how we collect, use, store, and protect your information when you use our reusable nappy laundry services and our website (the "Service").`

**1. Who We Are**
> Nappio Ltd  
> Flat 38 Truman House, 278 Oak Square, London, England, SW9 9AW  
> info@nappio.co.uk  
> We act as the data controller for the personal information you provide to us.

**2. Information We Collect**
> We may collect and process the following categories of personal data:

2.1 Personal Identification Information
- Parent/guardian name
- Child's name
- Child's date of birth (for sizing)
- Contact details (email address, phone number)
- Postcode/home address (for ascertaining if you live in areas where Nappio operates and for delivery/collection)

2.2 Financial Information
- Payment card details (processed securely by Stripe, our payment provider. We do not store your full payment card details on our systems.)
- Billing address
- Transaction history

2.4 Service Information *(note: section 2.3 does not appear in the source)*
- Nappy usage details (e.g., size requirements, frequency)
- Account preferences
- Communication preferences

2.5 Website Usage Data
- Sign in/log out timestamps
- Checkout sessions

**3. How We Use Your Information**
> We use your personal data for the following purposes:

3.1 To Provide and Manage Our Service
- Process orders and payments
- Ensure successful collection and delivery of nappies

3.2 Customer Support
- Respond to queries
- Provide updates and service notifications

3.3 Business Operations
- Improving service quality
- Internal record keeping

3.4 Legal & Compliance
- Meeting our tax, accounting, and regulatory obligations

3.5 Marketing
> Sending service updates, promotions, and newsletters. We will only send marketing materials if you have opted in, and you can opt out at any time.

*(Note: Section 4 does not appear in the source file — numbering jumps from section 3.5 to section 5.)*

**5. How We Share Your Information**
> We only share your personal information where necessary to provide our services:
- Stripe (our payment processor) to securely process card payments and manage billing.
- Supabase (our database hosting provider) to securely store and manage account information.
- IT and website hosting providers who support the operation of our website.
- Professional advisers (such as legal, financial, or accounting advisers) where required.
>
> These providers act as data processors on our behalf and are only permitted to process your information in accordance with our instructions and applicable data protection laws.
>
> We never sell your personal data.

**6. Data Storage & Security**
> We are committed to ensuring that your information is secure. In order to prevent unauthorised access or disclosure, we have put in place suitable physical, electronic and managerial procedures to safeguard and secure the information we collect online.
>
> We will only keep your personal information for as long as it is necessary for the purposes set out in this privacy notice, unless a longer retention period is required or permitted by law (such as tax, accounting, or other legal requirements).
>
> When we have no ongoing legitimate business need to process your personal information, we will either delete or anonymize such information, or, if this is not possible (for example, because your personal information has been stored in backup archives), then we will securely store your personal information and isolate it from any further processing until deletion is possible.
>
> You can request deletion at any time (see Section 7).

**7. Your Rights Under UK GDPR**
> You have the right to:
- Access your personal data
- Correct inaccurate data
- Request deletion of your data
- Restrict or object to processing
- Portability: request a copy in a structured format
- Withdraw consent (for marketing or optional data)
>
> To exercise your rights, contact us at: info@nappio.co.uk

**8. Cookies & Tracking**
> We use strictly necessary cookies to manage your user session and enable core functionality of the website.
>
> We do not currently use cookies for analytics, advertising, or any other non-essential purposes. If this changes in the future, we will request your consent before placing any non-essential cookies on your device.

**Notes for dynamically generated text:**
- All privacy policy copy is static.
- Section 2.3 and Section 4 are absent from the source — the numbering jumps from 2.2 to 2.4, and from 3.5 to 5.

---

### 6. `/auth` — Sign In / Sign Up

**Page URL:** `/auth`  
**Page title (browser tab):** `Sign up or sign in - Nappio`  
**Meta description:** `Sign up or sign in to your Nappio account`  
**Page purpose:** Combined sign-in, sign-up, and password-reset form. Toggles between three modes.

**Exact on-page copy:**

Tab buttons:
- `Sign In`
- `Sign Up`

**Sign In mode** form fields:
- `Email address`
- `Password`
- `Forgot password?` *(link toggling to Forgot Password mode)*
- `Sign In` *(submit button)*

**Sign Up mode** — additional fields:
- `First Name`
- `Surname`
- `Postcode`
- `Email address`
- `Password`
- `Sign Up` *(submit button)*

**Forgot Password mode:**
- `Email address`
- `Back to sign in` *(link)*
- `Reset Password` *(submit button)*

Loading state:
- `Loading...` *(shown while submitting)*

Error helper text (shown after certain login failures):
- `If you're unable to log in to your account please contact us on info@nappio.co.uk`

**Notes for dynamically generated text:**
- Error and message banners are dynamically populated from Supabase auth error responses.
- On successful sign-in: redirects to `/private/dashboard`.
- On successful sign-up: redirects to `/success?type=signup&email=<email>`.
- On successful password reset request: shows message `Password reset email sent! Check your inbox.`

---

### 7. `/reset-password` — Reset Password

**Page URL:** `/reset-password`  
**Page title (browser tab):** `Reset Password - Nappio`  
**Meta description:** `Reset your Nappio account password`  
**Page purpose:** Reset password entry point — renders the same `AuthForm` component as `/auth`, pre-positioned for password reset.

**Exact on-page copy:**
- Same copy as the `/auth` page. See section 6 above.

---

### 8. `/update-password` — Update Password

**Page URL:** `/update-password`  
**Page title (browser tab):** `Update Password - Nappio`  
**Meta description:** `Update your Nappio account password`  
**Page purpose:** Final step of the password reset flow, reached via the emailed reset link. Verifies session, then shows a change-password form.

**Exact on-page copy:**

Loading state:
- `Verifying your identity...`

Error state (session invalid or expired):
- `{error message from Supabase}` *(dynamic)*
- `Redirecting you back to sign in...`

Authenticated state — `ChangePasswordForm`:
- `Change Password`
- `New Password` *(label)*
- `Confirm New Password` *(label)*
- `Update Password` *(submit button)*
- `Loading...` *(while submitting)*

Success message:
- `Password updated successfully! Redirecting to dashboard...`

Error messages (inline validation):
- `Please fill in all fields`
- `Passwords do not match`
- `Password must be at least 6 characters long`

**Notes for dynamically generated text:**
- The error text shown in the loading/error state is taken directly from Supabase's session validation response.
- On session error: redirects to `/auth` after 3 seconds.
- On successful password update: redirects to `/private/dashboard` after 2 seconds.

---

### 9. `/confirm-email` — Email Verification

**Page URL:** `/confirm-email`  
**Page title (browser tab):** *not set (inherits root layout title)*  
**Page purpose:** Verifies the email address from the link in the Nappio verification email. Shows success or failure state.

**Exact on-page copy:**

Success state:
- `Email Verified`
- `Your email has been successfully verified: {email}` *(email address is dynamic)*
- `You're now ready to stay updated and enjoy all the benefits of our service. Got questions? We're here to help!`
- `Contact us at info@nappio.co.uk` *(link)*
- `Go to Homepage` *(button with arrow icon)*

Error state:
- `Verification Failed`
- `{data.error}` *(error message is dynamic — populated from server-side email verification response)*

**Notes for dynamically generated text:**
- `{email}` is the verified email address, passed from the server action.
- The error message on failure is taken from the Supabase email confirmation response.

---

### 10. `/auth/callback` — Auth Callback

**Page URL:** `/auth/callback`  
**Page title (browser tab):** *not set*  
**Page purpose:** Processes OAuth / magic-link / email confirmation callbacks from Supabase. Not a user-facing page; the user sees it briefly before being redirected.

**Exact on-page copy:**

- `Confirming your email...` *(shown while processing, unless there is an error)*
- `{errorMessage}` *(dynamic — shown if an error is present, e.g. "Authentication failed. Please try again." or "Invalid confirmation link")*
- `Redirecting...` *(shown below the error message)*

**Notes for dynamically generated text:**
- On success: redirects to `/private/dashboard`.
- On failure: redirects to `/auth` after 3 seconds, or to `/?error=invalid_callback`.

---

### 11. `/checkout` — Building Checkout

**Page URL:** `/checkout`  
**Page title (browser tab):** `Building Checkout - Nappio`  
**Meta description:** `Creating your checkout session...`  
**Page purpose:** Intermediate loading page shown while the server creates a Stripe checkout session. The user is typically redirected here automatically and then immediately on to Stripe. Shows an error state if the redirect takes too long.

**Exact on-page copy:**

Loading state:
- `Building Your Checkout`
- `Please wait while we prepare your subscription checkout session...`
- `Subscription: {subscriptionId}` *(only shown if `subscription_id` query parameter is present — dynamic)*

Error state (after 10-second timeout or server error):
- `Something Went Wrong`
- `{error}` *(dynamic — defaults to: `Checkout session creation is taking longer than expected. Please try again.`)*
- `Try Again` *(button — reloads the page)*
- `Back to Plans` *(link to `/subscribe`)*

**Notes for dynamically generated text:**
- The `subscriptionId` is read from the `subscription_id` URL query parameter.
- The error message is populated from a 10-second client-side timeout.

---

### 12. `/success` — Success / Confirmation

**Page URL:** `/success`  
**Page title (browser tab):** *not set — inherits root layout title*  
**Page purpose:** Generic confirmation page shown after successful payment, newsletter signup, or account creation. The content varies based on the `type` query parameter.

**Exact on-page copy (by type):**

`type=payment_intent` — Subscription setup:
- `Subscription Setup Successful!`
- `Thanks for setting up your subscription! A confirmation email has been sent to {customerEmail}.` *(email is dynamic)*
- `Go to Dashboard` *(button)*

`type=payment` — Single payment:
- `Payment Successful!`
- `Thank you for your payment of £{amountTotal}. A confirmation email has been sent to {customerEmail}.` *(amount and email are dynamic)*
- `Go to Dashboard` *(button)*

`type=start_up_payment` — Set-up fee payment:
- `Payment Successful!`
- `Thank you for paying the setup cost of £{amountTotal}. A confirmation email has been sent to {customerEmail}.` *(amount and email are dynamic)*
- `We will also reach out to you by email within 48 hours to arrange your at-home visit and get you started with Nappio.`
- `If you don't hear from us, check your spam or feel free to reach out to us at info@nappio.co.uk. We will get back to you ASAP.`
- `Go to Dashboard` *(button)*

`type=newsletter` — Newsletter signup:
- `Newsletter Signup Successful!`
- `Your email {email} has been successfully added to our mailing list. Please check your email for verification.` *(email is dynamic)*
- `Go to Homepage` *(button)*

`type=signup` — Account creation:
- `Account Created!`
- `Check your email ({email}) for the confirmation link to verify your account.` *(email is dynamic)*
- `Go to Sign In` *(button)*

`type=error` — Error fallback:
- `Something went wrong`
- `{data.message}` *(dynamic — falls back to `An unexpected error occurred.`)*
- `Go to Homepage` *(button)*

**Notes for dynamically generated text:**
- All visible content on this page is dynamically rendered based on URL query parameters (`type`, `customerEmail`, `amountTotal`, `email`, `message`).

---

### 13. `/error` — Subscription Failed

**Page URL:** `/error`  
**Page title (browser tab):** *not set — inherits root layout title*  
**Page purpose:** Shown when the newsletter subscription form (or similar flow) encounters a server error.

**Exact on-page copy:**

- `Subscription Failed`
- `{email}` *(dynamic — the email address that was being registered, from the `email` query parameter)*
- `{errorMessage}` *(dynamic — from the `message` query parameter; defaults to `An unexpected error occurred`)*
- `Go to Homepage` *(button with arrow icon)*

**Notes for dynamically generated text:**
- Both the email and error message are decoded from URL query parameters.

---

### 14. `+error` (SvelteKit Error Boundary) — Not Found / Error

**Page URL:** Any unmatched route or unhandled error  
**Page title (browser tab):** *not set*  
**Page purpose:** Catches unmatched routes (404) and unhandled server/client errors.

**Exact on-page copy:**

- `Oops! Sorry, we can't find the page you're looking for.`
- `Go to Homepage` *(button with arrow icon, links to `/`)*

---

### 15. `/private/dashboard` — Account Dashboard

**Page URL:** `/private/dashboard`  
**Page title (browser tab):** `Dashboard - Nappio`  
**Meta description:** `Your Nappio account dashboard`  
**Page purpose:** Authenticated account area. Shows the user's profile, saved addresses, and active subscriptions. Requires authentication — unauthenticated users are redirected to `/auth`.

**Exact on-page copy:**

Heading:
- `Welcome, {first_name}!` *(first name is dynamic — from the authenticated user's profile)*

Profile section:
- `Your Profile`
- `Email:` *(value is dynamic)*
- `Name:` *(value is dynamic — first name + surname)*

Addresses section (collapsible):
- `Addresses`
- `Add New Address` / `Cancel` *(button — toggles address form)*
- `Select from your saved addresses` *(label, when addresses exist)*
- `No address added` *(shown when the user has no saved addresses)*
- `Delete` *(button on each saved address card)*

Subscriptions section (collapsible):
- `Manage Your Subscriptions`

Per-subscription (when subscriptions exist):
- `Status:` *(value is dynamic — e.g. `active`)*
- `Included Items:` *(list of subscription items with names and prices — dynamic)*
- `Manage Subscription` / `Collapse` *(toggle button)*

Inside subscription management panel:
- `Delivery Address:` *(address lines shown dynamically)*
- `No delivery address specified` *(when no address is assigned)*
- `Change Address` / `Select Address` / `Cancel` *(button — toggles address picker)*
- `Select a delivery address:` *(label for address picker)*
- `Subscription Details`
- `Started On:` *(value is dynamic — formatted date)*
- `Next Billing Date:` *(value is dynamic — formatted date)*
- `We're still adding features that will allow you to fully manage your subscription here. If there's anything you'd like to do which you can't do here, please contact us via email by clicking the button below or emailing us at info@nappio.co.uk.`
- `Contact Us About This Subscription` *(button — opens a pre-filled mailto link)*

When no subscriptions exist:
- `You don't have any active subscriptions.`
- `Start a subscription` *(button, links to `/subscribe`)*

Footer of dashboard:
- `If you have any questions about our service, your subscription or billing please contact us on info@nappio.co.uk`
- `Sign Out` *(button)*
- `Signing out...` *(shown while sign-out is in progress)*

**Notes for dynamically generated text:**
- `{first_name}`, email, name, subscription status, subscription items, dates, and address fields are all populated from the authenticated user's data fetched server-side.
- The "Contact Us About This Subscription" button pre-fills an email to `info@nappio.co.uk` with the subject `Subscription Inquiry - {user.email}` and a body template prompting the user to select a query type.

---

*Document generated from source files. Last updated: August 2026.*
