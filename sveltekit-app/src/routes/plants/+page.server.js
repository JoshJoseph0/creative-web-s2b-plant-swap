import { getPlants } from '#lib/server/plantApi.js';

/** @type {import('./$types').PageServerLoad} */
export const load = async ({ fetch }) => ({
	plants: await getPlants(fetch)
});
