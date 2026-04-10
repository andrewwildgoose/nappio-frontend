/**
 * Production-safe logger.
 *
 * - `debug` and `info` are only emitted in development builds.
 * - `warn` and `error` are always emitted so genuine problems are visible in production.
 * - Callers are responsible for never passing sensitive values (tokens, emails, PII) as context.
 */

const dev = import.meta.env.DEV;

export const logger = {
	debug: (message: string, context?: Record<string, unknown>) => {
		if (dev) {
			console.debug('[DEBUG]', message, ...(context ? [context] : []));
		}
	},
	info: (message: string, context?: Record<string, unknown>) => {
		if (dev) {
			console.info('[INFO]', message, ...(context ? [context] : []));
		}
	},
	warn: (message: string, context?: Record<string, unknown>) => {
		console.warn('[WARN]', message, ...(context ? [context] : []));
	},
	error: (message: string, context?: Record<string, unknown>) => {
		console.error('[ERROR]', message, ...(context ? [context] : []));
	}
};
