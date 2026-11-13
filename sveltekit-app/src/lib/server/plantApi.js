import { error } from '@sveltejs/kit';
import { EXPRESS_API_URL } from '$app/env/private';

/** @param {typeof fetch} fetcher
 * @param {string} id
 */
export async function deletePlant(fetcher, id) {
  try {
    const response = await fetcher(`${EXPRESS_API_URL}/plants/${encodeURIComponent(id)}`, {
      method: 'DELETE'
    });
    return response.ok;
  } catch {
    return false;
  }
}

/** @typedef {{ id: string, name: string, species: string, lightNeeds: string, tags: string[] }} Plant */

/** @param {typeof fetch} fetcher
 * @returns {Promise<Plant[]>}
 */
export async function getPlants(fetcher) {
  let response;

  try {
    response = await fetcher(`${EXPRESS_API_URL}/plants`);
  } catch {
    error(502, 'Cannot reach the Express server');
  }

  if (!response.ok) {
    error(502, 'Could not load plants');
  }

  return response.json();
}

/**
 * @param {typeof fetch} fetcher
 * @param {{ name: string, species: string, lightNeeds: string, tags: string[] }} plant
 */
export async function createPlant(fetcher, plant) {
  let response;

  try {
    response = await fetcher(`${EXPRESS_API_URL}/plants`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(plant)
    });
  } catch {
    error(502, 'Cannot reach the Express server');
  }

  if (!response.ok) {
    error(502, 'Could not save your plant');
  }
}
