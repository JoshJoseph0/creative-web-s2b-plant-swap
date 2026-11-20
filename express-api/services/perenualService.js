
const BASE_URL = 'https://perenual.com/api/v2';

async function requestPlants(path, query) {
  const apiKey = process.env.PERENUAL_API_KEY;

  if (!apiKey) {
    throw new Error('PERENUAL_API_KEY is missing');
  }

  const url = new URL(`${BASE_URL}/${path}`);

  url.searchParams.set('key', apiKey);
  if (query) url.searchParams.set('q', query);

  const response = await fetch(url, { signal: AbortSignal.timeout(10000) });

  if (!response.ok) {
    throw new Error(`Perenual error: ${response.status}`);
  }

  return response.json();
}

export function normalizePlant(plant) {
  const sunlight = Array.isArray(plant.sunlight)
    ? plant.sunlight.map(value => String(value).toLowerCase().replaceAll('_', ' ')) : [];
  const lightNeeds = sunlight.some(value => value === 'full sun' || value === 'sun-part shade') ? 'bright'
    : sunlight.some(value => value === 'part shade' || value === 'partial shade') ? 'medium'
    : sunlight.includes('full shade') ? 'low' : null;
  const tags = [];
  if (plant.indoor === true) tags.push('indoor');
  if (plant.poisonous_to_pets === false) tags.push('pet-safe');
  if (plant.tropical === true) tags.push('tropical');
  if (plant.rare === true) tags.push('rare');
  if (String(plant.care_level).toLowerCase() === 'low' || String(plant.care_level).toLowerCase() === 'easy') tags.push('easy-care');
  if (['minimum', 'none'].includes(String(plant.watering).toLowerCase())) tags.push('low-water');
  if (['high', 'fast'].includes(String(plant.growth_rate).toLowerCase())) tags.push('fast-growing');

  return {
    id: plant.id,
    name: plant.common_name || plant.scientific_name?.[0] || '',
    scientificName: plant.scientific_name?.[0] ?? '',
    image: plant.default_image?.medium_url || plant.default_image?.regular_url || null,
    imageLicense: plant.default_image?.license_name || null,
    imageLicenseUrl: plant.default_image?.license_url || null,
    lightNeeds,
    tags
  };
}

export async function searchPlants(query) {
  const result = await requestPlants('species-list', query);
  if (!Array.isArray(result.data)) throw new Error('Invalid plant search response');
  return result.data.map(normalizePlant);
}

export async function getPlantDetails(id) {
  const result = await requestPlants(`species/details/${id}`);
  if (!result.id) throw new Error('Plant details unavailable');
  return normalizePlant(result);
}
