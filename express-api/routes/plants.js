import { Router } from 'express';
import Plant from '../models/Plant.js';

const router = Router();

// Get all plants
router.get('/', async (req, res) => {
  try {
    const plants = await Plant.find();

    res.json(
      plants.map((plant) => ({
        id: plant._id.toString(),
        name: plant.name,
        species: plant.species,
        swapped: plant.swapped
      }))
    );
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Add a new plant
router.post('/', async (req, res) => {
  try {
    const { name, species } = req.body;

    if (
      typeof name !== 'string' ||
      typeof species !== 'string' ||
      !name.trim() ||
      !species.trim()
    ) {
      return res.status(400).json({
        error: 'Name and species are required'
      });
    }

    const plant = await Plant.create({
      name: name.trim(),
      species: species.trim()
    });

    res.status(201).json({
      id: plant._id.toString(),
      name: plant.name,
      species: plant.species,
      swapped: plant.swapped
    });
  } catch (err) {
    res.status(500).json({ error: 'Could not save plant' });
  }
});

export default router;
