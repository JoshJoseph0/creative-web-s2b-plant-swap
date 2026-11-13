
import { Router } from 'express';
import Plant from '../models/Plant.js';

const router = Router();

// GET /plants - retrieve saved plants
router.get('/', async (req, res) => {
  try {
    const plants = await Plant.find().sort({ _id: -1 });

    res.json(plants.map(plant => ({
      id: plant._id.toString(),
      name: plant.name,
      species: plant.species,
      lightNeeds: plant.lightNeeds,
      swapped: plant.swapped,
      tags: plant.tags
    })));
  } catch (err) {
    res.status(500).json({ error: 'Could not load plants' });
  }
});

// POST /plants - save a new plant
router.post('/', async (req, res) => {
  const { name, species, lightNeeds, tags = [] } = req.body;

  if (
    typeof name !== 'string' ||
    !name.trim() ||
    typeof species !== 'string' ||
    !species.trim() ||
    !['low', 'medium', 'bright'].includes(lightNeeds) ||
    !Array.isArray(tags) ||
    tags.some(tag => typeof tag !== 'string')
  ) {
    return res.status(400).json({ error: 'Invalid plant details' });
  }

  try {
    const plant = await Plant.create({
      name: name.trim(),
      species: species.trim(),
      lightNeeds,
      tags: [...new Set(tags)]
    });

    res.status(201).json({
      id: plant._id.toString(),
      name: plant.name,
      species: plant.species,
      lightNeeds: plant.lightNeeds,
      swapped: plant.swapped,
      tags: plant.tags
    });
  } catch (err) {
    res.status(500).json({ error: 'Could not save plant' });
  }
});

router.delete('/:id', async (req, res) => {
  if (!/^[a-f\d]{24}$/i.test(req.params.id)) {
    return res.status(400).json({ error: 'Invalid plant ID' });
  }

  try {
    const plant = await Plant.findByIdAndDelete(req.params.id);
    if (!plant) {
      return res.status(404).json({ error: 'Plant not found' });
    }
    res.sendStatus(204);
  } catch {
    res.status(500).json({ error: 'Could not delete plant' });
  }
});

export default router;
