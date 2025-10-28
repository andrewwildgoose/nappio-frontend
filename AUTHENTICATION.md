# Authentication Documentation

## Overview

The Nappio frontend uses **pure client-side authentication** with Supabase. This approach simplifies the authentication flow by removing all server-side session management, hooks, and cookie handling.

## Architecture

### Client-Side Components

1. **Supabase Client** (`src/lib/client/supabaseClient.ts`)

   - Single browser client instance
   - Handles all auth operations (signup, login, logout)
   - Manages session state in browser storage

2. **Auth Stores** (`src/lib/stores/auth.ts`)

   - `user`: Current authenticated user
   - `session`: Current session data
   - `loading`: Auth state loading indicator

3. **Auth Guard** (`src/lib/components/AuthGuard.svelte`)
   - Client-side route protection
   - Redirects unauthenticated users to `/auth`
   - Shows loading spinner during auth check

## Authentication Flow

### Sign Up

1. User fills out signup form (`src/lib/components/AuthForm.svelte`)
2. Client calls `supabase.auth.signUp()` with email, password, and metadata
3. Supabase sends confirmation email
4. User clicks email link → redirected to `/auth/callback`
5. Callback page exchanges code for session
6. User redirected to dashboard

### Sign In

1. User enters credentials in login form
2. Client calls `supabase.auth.signInWithPassword()`
3. On success, auth state updates automatically
4. User redirected to `/private/dashboard`

### Sign Out

1. User clicks "Sign Out" button
2. Client calls `supabase.auth.signOut()`
3. Auth state cleared automatically
4. User redirected to `/auth`

## Implementation Details

### Root Layout (`src/routes/+layout.svelte`)

The root layout initializes auth state and listens for changes:

```svelte
onMount(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
        session.set(session);
        user.set(session?.user ?? null);
        loading.set(false);
    });

    // Listen for auth changes
    const { data } = supabase.auth.onAuthStateChange((_event, newSession) => {
        session.set(newSession);
        user.set(newSession?.user ?? null);
    });

    return () => data.subscription.unsubscribe();
});
```

### Protected Routes

Protected routes use the `AuthGuard` component:

```svelte
<!-- src/routes/private/+layout.svelte -->
<AuthGuard>
	{@render children()}
</AuthGuard>
```

### Server-Side API Calls

For pages that need to call backend APIs (dashboard, checkout), the session is:

1. Retrieved client-side in a `+layout.ts` file
2. Passed to server load functions via `parent()`
3. Used to authenticate backend API requests

Example:

```typescript
// src/routes/private/+layout.ts
export const load: LayoutLoad = async () => {
	const {
		data: { session }
	} = await supabase.auth.getSession();
	return { session };
};

// src/routes/private/dashboard/+page.server.ts
export const load: PageServerLoad = async ({ parent }) => {
	const { session } = await parent();
	const jwt = session.access_token;
	// Use jwt for backend API calls
};
```

## Environment Variables

Required public environment variables:

```env
PUBLIC_SUPABASE_URL=your-supabase-project-url
PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

## Email Confirmation

Email confirmation links use the `/auth/confirm` server endpoint to verify OTP tokens. This is the only server-side auth endpoint remaining, as it's required for email link handling.

## Benefits of Client-Side Auth

1. **Simpler codebase**: No server hooks, session validation, or dual Supabase clients
2. **Better UX**: Instant auth state updates via reactive stores
3. **Less overhead**: No server-side session management
4. **Easier debugging**: All auth logic in one place (client)
5. **Better TypeScript support**: Direct access to Supabase types

## Migration Notes

The following were removed during the refactor:

- `src/hooks.server.ts` - Server-side auth hooks
- `src/lib/server/auth-helper.ts` - Server auth utilities
- `src/routes/+layout.server.ts` - Server layout load
- `src/routes/auth/+page.server.ts` - Server auth actions
- All references to `locals.session` and `locals.user`

Session data is now accessed via:

- Client-side: `$user` and `$session` stores
- Server-side: `parent()` function in load/actions
