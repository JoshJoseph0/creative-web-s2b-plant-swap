
import { fail } from '@sveltejs/kit';
import { getPlants, deletePlant, setSwapped } from '#lib/server/plantApi.js';

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

/** @type {import('./$types').Actions} */
export const actions = {
  delete: async ({ request, fetch }) => {
    const form = await request.formData();
    const id = String(form.get('id') ?? '');
    if (!/^[a-f\d]{24}$/i.test(id)) {
      return fail(400, { error: 'Invalid plant ID' });
    }
    const deleted = await deletePlant(fetch, id);
    if (!deleted) {
      return fail(502, { error: 'Could not delete your plant. Please try again.' });
    }
    return { success: true };
  },
  setStatus: async ({ request, fetch }) => {
    const form = await request.formData();
    const id = String(form.get('id') ?? '');
    const status = String(form.get('swapped') ?? '');
    if (!/^[a-f\\d]{24}$/i.test(id) || !['true', 'false'].includes(status)) {
      return fail(400, { error: 'Invalid plant status request.' });
    }
    const result = await setSwapped(fetch, id, status === 'true');
    if (result.error) return fail(400, { error: result.error });
    return { success: true };
  }
};
