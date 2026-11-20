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

/** @typedef {{ id: string, name: string, species: string, lightNeeds: string, tags: string[], ownerId: string, ownerName: string, isDemo: boolean, swapped: boolean, imageUrl?: string | null, imageLicense?: string | null, imageLicenseUrl?: string | null }} Plant */

/** @param {typeof fetch} fetcher
 * @param {'all' | 'mine' | 'community'} [scope]
 * @returns {Promise<Plant[]>}
 */
export async function getPlants(fetcher, scope = 'all') {
  let response;

  try {
    response = await fetcher(`${EXPRESS_API_URL}/plants?scope=${scope}`);
  } catch {
    error(502, 'Cannot reach the Express server');
  }

  if (!response.ok) {
    error(502, 'Could not load plants');
  }

  return response.json();
}

/** @param {typeof fetch} fetcher
 * @param {string} id
 * @returns {Promise<Plant>}
 */
export async function getPlant(fetcher, id) {
  if (!/^[a-f\d]{24}$/i.test(id)) error(404, 'Plant not found');
  let response;
  try {
    response = await fetcher(`${EXPRESS_API_URL}/plants/${id}`);
  } catch {
    error(502, 'Cannot reach the Express server');
  }
  if (response.status === 404) error(404, 'Plant not found');
  if (!response.ok) error(502, 'Could not load plant');
  return response.json();
}

/** @param {typeof fetch} fetcher
 * @param {string} id
 * @param {string} offeredPlantId
 * @returns {Promise<{success?: boolean, error?: string}>}
 */
export async function swapPlant(fetcher, id, offeredPlantId) {
  try {
    const response = await fetcher(`${EXPRESS_API_URL}/plants/${encodeURIComponent(id)}/swap`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ offeredPlantId })
    });
    if (!response.ok) {
      const data = await response.json();
      return { error: data.error || 'Could not complete the swap.' };
    }
    return { success: true };
  } catch {
    return { error: 'Cannot reach the Express server. Please try again.' };
  }
}

/**
 * @param {typeof fetch} fetcher
 * @param {{ name: string, species: string, lightNeeds: string, tags: string[], imageUrl?: string, imageLicense?: string, imageLicenseUrl?: string }} plant
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
