import { BACKEND_API_URL, BACKEND_API_KEY } from '$env/static/private';

/**
 * fetch() wrapper for calls to the Nappio backend (server-side only).
 * Prefixes the backend base URL and adds the X-API-Key header the backend requires.
 *
 * @param path - backend path starting with `/`, e.g. `/api/v1/user/addresses`
 */
export function backendFetch(path: string, init: RequestInit = {}): Promise<Response> {
	const headers = new Headers(init.headers);
	headers.set('X-API-Key', BACKEND_API_KEY);
	return fetch(`${BACKEND_API_URL}${path}`, { ...init, headers });
}
