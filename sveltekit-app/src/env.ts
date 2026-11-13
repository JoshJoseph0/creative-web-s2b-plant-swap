import { defineEnvVars } from '@sveltejs/kit/env';

export const variables = defineEnvVars({
	EXPRESS_API_URL: {
		schema: (value) => {
			if (!value) {
				throw new Error('EXPRESS_API_URL must be set');
			}

			try {
				return new URL(value).toString().replace(/\/$/, '');
			} catch {
				throw new Error('EXPRESS_API_URL must be a valid URL');
			}
		}
	}
});
