import { json } from '@sveltejs/kit';
import { EXPRESS_API_URL } from '$app/env/private';

/** @type {import('./$types').RequestHandler} */
export const GET = async ({ url, fetch }) => {
  const id = url.searchParams.get('id');
  const query = (url.searchParams.get('q') ?? '').trim();
  if (id ? !/^[1-9]\d*$/.test(id) : query.length < 2 || query.length > 100) {
    return json({ error: 'Enter a plant name between 2 and 100 characters' }, { status: 400 });
  }
  try {
    const path = id ? encodeURIComponent(id) : `search?q=${encodeURIComponent(query)}`;
    const response = await fetch(`${EXPRESS_API_URL}/plant-search/${path}`);
    if (!response.ok) {
      return json({ error: id ? 'Care details are unavailable. You can still fill them in yourself.' : 'Unable to search plants right now. Try again or enter your plant manually.' }, { status: 502 });
    }
    return json(await response.json());
  } catch {
    return json({ error: 'Cannot reach plant search. Try again or enter your plant manually.' }, { status: 502 });
  }
};
