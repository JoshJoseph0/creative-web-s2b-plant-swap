
import { error, redirect } from '@sveltejs/kit';
import { createPlant } from '#lib/server/plantApi.js';

/** @type {import('./$types').RequestHandler} */
export const POST = async ({ request, fetch }) => {
  const form = await request.formData();

  const name = String(form.get('name') ?? '').trim();
  const species = String(form.get('species') ?? '').trim();
  const lightNeeds = String(form.get('lightNeeds') ?? '');
  const imageUrl = String(form.get('imageUrl') ?? '').trim();
  const imageLicense = String(form.get('imageLicense') ?? '').trim();
  const imageLicenseUrl = String(form.get('imageLicenseUrl') ?? '').trim();
  for (const value of [imageUrl, imageLicenseUrl]) {
    if (value && (!URL.canParse(value) || !['http:', 'https:'].includes(new URL(value).protocol))) {
      error(400, 'Invalid photo URL');
    }
  }
  let tags;
  try {
    tags = JSON.parse(String(form.get('tags') ?? '[]'));
  } catch {
    error(400, 'Please select valid plant tags');
  }

  if (!Array.isArray(tags) || tags.some(tag => typeof tag !== 'string')) {
    error(400, 'Please select valid plant tags');
  }

  if (!name || !species ||
      !['low', 'medium', 'bright'].includes(lightNeeds)) {
    error(400, 'Please enter valid plant details');
  }

  await createPlant(fetch, { name, species, lightNeeds, tags, imageUrl, imageLicense, imageLicenseUrl });

  redirect(303, '/shelf');
};
