import { getPlants } from '#lib/server/plantApi.js';

/** @type {import('./$types').PageServerLoad} */
export const load = async ({ fetch, url }) => {
  const candidate = url.searchParams.get('light') ?? '';
  const light = ['low', 'medium', 'bright'].includes(candidate) ? candidate : '';
  return {
    plants: await getPlants(fetch, 'mine', light),
    selectedLight: light || 'all',
    swapComplete: url.searchParams.get('swapped') === '1'
  };
};
