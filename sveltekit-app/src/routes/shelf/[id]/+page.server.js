import { fail, redirect } from '@sveltejs/kit';
import { getPlant, getPlants, swapPlant } from '#lib/server/plantApi.js';

/** @type {import('./$types').PageServerLoad} */
export const load = async ({ fetch, params }) => {
  const plant = await getPlant(fetch, params.id);
  const myPlants = plant.ownerId !== 'you' && plant.isDemo && !plant.swapped
    ? (await getPlants(fetch, 'mine')).filter(plant => !plant.swapped) : [];
  return { plant, myPlants };
};

/** @type {import('./$types').Actions} */
export const actions = {
  swap: async ({ fetch, request, params }) => {
    const form = await request.formData();
    const offeredId = String(form.get('offeredPlantId') ?? '');
    if (!/^[a-f\d]{24}$/i.test(offeredId)) return fail(400, { error: 'Choose a plant from your shelf.' });
    const result = await swapPlant(fetch, params.id, offeredId);
    if (result.error) return fail(400, { error: result.error });
    redirect(303, '/shelf?swapped=1');
  }
};
