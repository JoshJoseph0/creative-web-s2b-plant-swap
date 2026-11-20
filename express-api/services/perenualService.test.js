import assert from 'node:assert/strict';
import { test } from 'node:test';
import { normalizePlant, searchPlants, getPlantDetails } from './perenualService.js';

test('normalizes names, photo metadata, sunlight and supported tags', () => {
  const plant = normalizePlant({
    id: 1, common_name: 'Swiss cheese plant', scientific_name: ['Monstera deliciosa'],
    sunlight: ['part shade'], indoor: true, poisonous_to_pets: true,
    care_level: 'Low', watering: 'Average', tropical: true,
    default_image: { medium_url: 'https://example.com/photo.jpg', license_name: 'CC BY', license_url: 'https://creativecommons.org/licenses/by/4.0/' }
  });
  assert.equal(plant.scientificName, 'Monstera deliciosa');
  assert.equal(plant.lightNeeds, 'medium');
  assert.equal(plant.image, 'https://example.com/photo.jpg');
  assert.equal(plant.imageLicense, 'CC BY');
  assert.deepEqual(plant.tags, ['indoor', 'tropical', 'easy-care']);
});

test('missing care data does not invent tags or sunlight and missing photos stay empty', () => {
  const plant = normalizePlant({ id: 2, scientific_name: ['Unknown species'] });
  assert.equal(plant.name, 'Unknown species');
  assert.equal(plant.image, null);
  assert.equal(plant.lightNeeds, null);
  assert.deepEqual(plant.tags, []);
  assert.equal(normalizePlant({ sunlight: ['full_sun'] }).lightNeeds, 'bright');
  assert.equal(normalizePlant({ sunlight: ['full shade'] }).lightNeeds, 'low');
});

test('search and detail requests stay server-side and reject provider errors', async t => {
  t.mock.method(globalThis, 'fetch', async url => {
    assert.equal(url.searchParams.get('key'), 'test-key');
    if (url.pathname.endsWith('species-list')) {
      assert.equal(url.searchParams.get('q'), 'monstera');
      return Response.json({ data: [{ id: 1, common_name: 'Monstera' }] });
    }
    return Response.json({ id: 1, sunlight: ['full sun'] });
  });
  const previous = process.env.PERENUAL_API_KEY;
  process.env.PERENUAL_API_KEY = 'test-key';
  try {
    assert.equal((await searchPlants('monstera'))[0].name, 'Monstera');
    assert.equal((await getPlantDetails(1)).lightNeeds, 'bright');
    globalThis.fetch.mock.mockImplementation(async () => new Response('', { status: 429 }));
    await assert.rejects(searchPlants('monstera'), /Perenual error: 429/);
    await assert.rejects(getPlantDetails(1), /Perenual error: 429/);
  } finally {
    if (previous === undefined) delete process.env.PERENUAL_API_KEY;
    else process.env.PERENUAL_API_KEY = previous;
  }
});
