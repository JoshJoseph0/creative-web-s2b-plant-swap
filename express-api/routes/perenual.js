
import { Router } from 'express';
import { searchPlants, getPlantDetails } from '../services/perenualService.js';

const router = Router();

router.get('/search', async (req, res) => {
  const query = String(req.query.q ?? '').trim();

  if (query.length < 2 || query.length > 100) {
    return res.status(400).json({
      error: 'Enter a plant name between 2 and 100 characters'
    });
  }

  try {
    const plants = await searchPlants(query);
    res.json(plants);
  } catch (error) {
    console.error('Plant API request failed:', error.message);

    res.status(502).json({
      error: 'Unable to search plants right now'
    });
  }
});

router.get('/:id', async (req, res) => {
  if (!/^[1-9]\d*$/.test(req.params.id)) {
    return res.status(400).json({ error: 'Invalid plant ID' });
  }
  try {
    res.json(await getPlantDetails(req.params.id));
  } catch {
    res.status(502).json({ error: 'Care details are unavailable. You can still fill them in yourself.' });
  }
});

export default router;
