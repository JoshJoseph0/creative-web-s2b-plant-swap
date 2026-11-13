
import { fail } from '@sveltejs/kit';
import { getPlants, deletePlant } from '#lib/server/plantApi.js';

/** @type {import('./$types').PageServerLoad} */
export const load = async ({ fetch }) => ({
  plants: await getPlants(fetch)
});

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
  }
};
