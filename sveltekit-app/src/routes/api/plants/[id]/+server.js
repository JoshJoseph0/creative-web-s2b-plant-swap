import { error, redirect } from '@sveltejs/kit';
import { deletePlant, setSwapped } from '#lib/server/plantApi.js';

/** @type {import('./$types').RequestHandler} */
export const POST = async ({ params, request, fetch }) => {
  const id = params.id;
  if (!/^[a-f\d]{24}$/i.test(id)) error(400, 'Invalid plant ID');

  const form = await request.formData();
  const operation = String(form.get('operation') ?? '');

  if (operation === 'delete') {
    const deleted = await deletePlant(fetch, id);
    if (!deleted) error(502, 'Could not delete plant. Please try again.');
  } else if (operation === 'setStatus') {
    const status = String(form.get('swapped') ?? '');
    if (!['true', 'false'].includes(status)) error(400, 'Invalid plant status');
    const result = await setSwapped(fetch, id, status === 'true');
    if (result.error) error(400, result.error);
  } else {
    error(400, 'Invalid plant operation');
  }

  redirect(303, '/shelf');
};
