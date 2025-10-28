# Nappio Email Checkout Flow Implementation

## Overview

This implementation allows users to click a link in an email that will direct them to a checkout page, which automatically creates a Stripe checkout session and redirects them to complete payment.

## Files Created

### 1. Main Checkout Route

- **`/src/routes/checkout/[subscriptionId]/+page.server.ts`** - Server-side load function that handles checkout creation and immediate redirect
- **`/src/routes/checkout/[subscriptionId]/+page.svelte`** - Backup page component (rarely shown due to server redirect)

### 2. API Route (Alternative)

- **`/src/routes/api/checkout-from-subscription/+server.ts`** - API endpoint for client-side checkout creation

### 3. Alternative Client-Side Implementation

- **`/src/routes/checkout/[subscriptionId]/+page.server.alternative.ts`** - Simple server load (client-side approach)
- **`/src/routes/checkout/[subscriptionId]/+page.alternative.svelte`** - Client-side checkout creation with progress UI

### 4. Testing & Documentation

- **`/src/routes/test-checkout/+page.svelte`** - Test page to demonstrate the flow
- **`email-template-example.html`** - Example email template

## How It Works

### Server-Side Redirect Approach (Recommended)

1. User clicks email link: `https://yoursite.com/checkout?subscription_id=sub_123456`
2. Server extracts `subscriptionId` from query parameters
3. Server calls backend API: `POST /api/v1/create-checkout-from-subscription`
4. Server receives checkout URL and immediately redirects user
5. User lands on Stripe checkout page

**Advantages:** Fast, no loading screen, works without JavaScript

### Client-Side Approach (Alternative)

1. User clicks email link: `https://yoursite.com/checkout?subscription_id=sub_123456`
2. Page loads with "Building checkout..." message
3. JavaScript calls frontend API: `POST /api/checkout-from-subscription`
4. Frontend API calls backend, returns checkout URL
5. JavaScript redirects user to Stripe checkout

**Advantages:** Better UX feedback, progress indication

## Backend Requirements

Your backend needs to implement this endpoint:

```typescript
POST /api/v1/create-checkout-from-subscription
Headers:
  - Authorization: Bearer {jwt_token}
  - Content-Type: application/json
Body:
  {
    "subscriptionId": "sub_123456"
  }
Response:
  {
    "checkout_url": "https://checkout.stripe.com/c/pay/...",
    "session_id": "cs_123456" // optional
  }
```

## Email Integration

### Email Link Format

```
https://yoursite.com/checkout?subscription_id={subscription_id}
```

### Example Email Template

See `email-template-example.html` for a complete example.

## Testing

1. Visit `/test-checkout` to test the flow
2. Enter a subscription ID and click "Test Server-Side Redirect"
3. The page will attempt to create a checkout session (will fail without proper backend)

## Configuration

Make sure your environment variables are set:

- `BACKEND_API_URL` - Your backend API base URL

## Error Handling

The implementation includes comprehensive error handling:

- Unauthorized users are redirected to sign in
- Invalid subscription IDs return appropriate error messages
- Network errors are caught and displayed to users
- Fallback navigation options are provided

## Security Considerations

1. **Authentication Required:** Users must be signed in to access checkout
2. **JWT Validation:** Backend should validate the JWT token
3. **Subscription Ownership:** Backend should verify user owns the subscription
4. **Link Expiration:** Consider adding expiration logic for checkout links
5. **Rate Limiting:** Implement rate limiting on checkout creation

## Next Steps

1. **Backend Implementation:** Implement the `/api/v1/create-checkout-from-subscription` endpoint
2. **Email System:** Integrate the checkout URL generation into your email system
3. **Database Updates:** Ensure subscription status tracking is in place
4. **Testing:** Test the full flow with real Stripe checkout sessions
5. **Monitoring:** Add logging and monitoring for checkout creation failures

## Usage Example

```javascript
// Backend: Create subscription and send email
const subscription = await createSubscription(userDetails);
const checkoutUrl = `https://nappio.com/checkout?subscription_id=${subscription.id}`;
await sendEmail(user.email, 'checkout-template', {
	subscription_id: subscription.id,
	checkout_url: checkoutUrl
});
```

## File Structure

```
src/routes/
├── checkout/
│   ├── +page.server.ts (main implementation - query params)
│   ├── +page.svelte (backup page - query params)
│   └── [subscriptionId]/
│       ├── +page.server.ts (alternative path param approach)
│       └── +page.svelte (alternative path param page)
├── api/
│   └── checkout-from-subscription/
│       └── +server.ts (API endpoint)
└── test-checkout/
    └── +page.svelte (testing page)
```
