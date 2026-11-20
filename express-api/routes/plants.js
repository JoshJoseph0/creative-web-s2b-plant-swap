
import { Router } from 'express';
import Plant from '../models/Plant.js';
import { swapPlants } from '../services/swapPlants.js';
import 'dotenv/config';
const router = Router();

function toPlant(plant) {
  return {
    id: plant._id.toString(), name: plant.name, species: plant.species,
    lightNeeds: plant.lightNeeds, swapped: plant.swapped, tags: plant.tags,
    imageUrl: plant.imageUrl, imageLicense: plant.imageLicense, imageLicenseUrl: plant.imageLicenseUrl,
    ownerId: plant.ownerId || 'you', ownerName: plant.ownerName || 'You', isDemo: plant.isDemo || false
  };
}

const mine = { $or: [{ ownerId: 'you' }, { ownerId: { $exists: false } }] };

// GET /plants - retrieve saved plants
router.get('/', async (req, res) => {
  try {
    const filter = req.query.scope === 'mine' ? mine
      : req.query.scope === 'community' ? { ownerId: { $exists: true, $ne: 'you' } } : {};
    const plants = await Plant.find(filter).sort({ _id: -1 });
    res.json(plants.map(toPlant));
  } catch (err) {
    res.status(500).json({ error: 'Could not load plants' });
  }
});

router.get('/:id', async (req, res) => {
  if (!/^[a-f\d]{24}$/i.test(req.params.id)) {
    return res.status(404).json({ error: 'Plant not found' });
  }
  try {
    const plant = await Plant.findById(req.params.id);
    if (!plant) return res.status(404).json({ error: 'Plant not found' });
    res.json(toPlant(plant));
  } catch {
    res.status(500).json({ error: 'Could not load plant' });
  }
});

// POST /plants - save a new plant
router.post('/', async (req, res) => {
  const { name, species, lightNeeds, tags = [], imageUrl = '', imageLicense = '', imageLicenseUrl = '' } = req.body;
  const isWebUrl = value => typeof value === 'string' &&
    (value === '' || (URL.canParse(value) && ['http:', 'https:'].includes(new URL(value).protocol)));

  if (
    typeof name !== 'string' ||
    !name.trim() ||
    typeof species !== 'string' ||
    !species.trim() ||
    !['low', 'medium', 'bright'].includes(lightNeeds) ||
    !Array.isArray(tags) ||
    tags.some(tag => typeof tag !== 'string') ||
    !isWebUrl(imageUrl) || !isWebUrl(imageLicenseUrl) ||
    typeof imageLicense !== 'string' || imageLicense.length > 300
  ) {
    return res.status(400).json({ error: 'Invalid plant details' });
  }

  try {
    const plant = await Plant.create({
      name: name.trim(),
      species: species.trim(),
      lightNeeds,
      tags: [...new Set(tags)],
      imageUrl: imageUrl || null,
      imageLicense: imageLicense || null,
      imageLicenseUrl: imageLicenseUrl || null
    });

    res.status(201).json(toPlant(plant));
  } catch (err) {
    res.status(500).json({ error: 'Could not save plant' });
  }
});

router.delete('/:id', async (req, res) => {
  if (!/^[a-f\d]{24}$/i.test(req.params.id)) {
    return res.status(400).json({ error: 'Invalid plant ID' });
  }

  try {
    const plant = await Plant.findOneAndDelete({ _id: req.params.id, ...mine });
    if (!plant) {
      return res.status(404).json({ error: 'Plant not found' });
    }
    res.sendStatus(204);
  } catch {
    res.status(500).json({ error: 'Could not delete plant' });
  }
});

router.post('/:id/swap', async (req, res) => {
  try {
    await swapPlants(req.params.id, String(req.body.offeredPlantId ?? ''));
    res.json({ success: true });
  } catch (error) {
    res.status(error.status || 500).json({ error: error.status ? error.message : 'Could not complete the swap. Please try again.' });
  }
});

export default router;
