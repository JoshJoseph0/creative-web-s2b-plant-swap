import 'dotenv/config';
import mongoose from 'mongoose';
import Plant from '../models/Plant.js';
import { getPlantDetails } from '../services/perenualService.js';

// Demo records use stable keys: rerunning this never duplicates them or resets swaps.
const examples = [
  { id: 1845, owner: 'Alex' },
  { id: 1469, owner: 'Sam' },
  { id: 625, owner: 'Morgan' },
  { id: 710, owner: 'Taylor' },
  { id: 1036, owner: 'Casey' },
  { id: 1023, owner: 'Riley' }
];

try {
  await mongoose.connect(process.env.MONGODB_URI);
  await Plant.init();
  const inserts = [];
  for (const example of examples) {
    const demoKey = `teacher-demo-${example.id}`;
    if (await Plant.exists({ demoKey })) continue;
    const plant = await getPlantDetails(example.id);
    if (!plant.image || !plant.tags.length || !plant.lightNeeds) throw new Error(`Incomplete API data for ${example.id}`);
    const image = await fetch(plant.image, { signal: AbortSignal.timeout(10000) });
    const hasPhoto = image.ok && image.headers.get('content-type')?.startsWith('image/');
    await image.body?.cancel();
    if (!hasPhoto) throw new Error(`Photo unavailable for ${example.id}`);
    inserts.push({ updateOne: {
      filter: { demoKey },
      update: { $setOnInsert: {
        demoKey, name: plant.name, species: plant.scientificName,
        lightNeeds: plant.lightNeeds, tags: plant.tags,
        imageUrl: plant.image, imageLicense: plant.imageLicense, imageLicenseUrl: plant.imageLicenseUrl,
        ownerId: `demo-${example.owner.toLowerCase()}`, ownerName: example.owner, isDemo: true, swapped: false
      } },
      upsert: true
    } });
  }
  if (inserts.length) await Plant.bulkWrite(inserts);
  console.log(`Demo plants ready: ${await Plant.countDocuments({ demoKey: { $in: examples.map(p => `teacher-demo-${p.id}`) } })}. Added ${inserts.length} new plants.`);
} catch (error) {
  console.error('Demo seed failed:', error.message.replace(/mongodb(?:\+srv)?:\/\/\S+/g, '[connection URI]'));
  process.exitCode = 1;
} finally {
  await mongoose.disconnect();
}
