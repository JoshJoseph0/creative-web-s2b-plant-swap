import { getPlant } from '#lib/server/plantApi.js';

/** @type {import('./$types').PageServerLoad} */
export const load = async ({ fetch, params }) => ({
  plant: await getPlant(fetch, params.id)
});
