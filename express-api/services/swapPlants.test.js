import assert from 'node:assert/strict';
import { test } from 'node:test';
import mongoose from 'mongoose';
import Plant from '../models/Plant.js';
import { swapPlants } from './swapPlants.js';

const targetId = '507f1f77bcf86cd799439011';
const offeredId = '507f1f77bcf86cd799439012';

test('exchanges ownership and marks both plants swapped in one transaction', async t => {
  const session = {};
  let saved = 0;
  const target = { ownerId: 'demo-alex', ownerName: 'Alex', isDemo: true, swapped: false, save: async options => { assert.equal(options.session, session); saved++; } };
  const offered = { ownerId: 'you', ownerName: 'You', swapped: false, save: target.save };
  t.mock.method(mongoose.connection, 'transaction', async callback => callback(session));
  t.mock.method(Plant, 'findById', id => ({ session: async current => { assert.equal(current, session); return id === targetId ? target : offered; } }));
  await swapPlants(targetId, offeredId);
  assert.equal(target.ownerId, 'you');
  assert.equal(offered.ownerId, 'demo-alex');
  assert.equal(offered.ownerName, 'Alex');
  assert.equal(target.swapped, true);
  assert.equal(offered.swapped, true);
  assert.equal(saved, 2);
  await assert.rejects(swapPlants(targetId, offeredId), { status: 409 });
  assert.equal(saved, 2);
});

test('rejects malformed IDs and swapping a plant with itself', async () => {
  await assert.rejects(swapPlants('invalid', offeredId), { status: 400 });
  await assert.rejects(swapPlants(targetId, targetId), { status: 400 });
});

test('rejects a plant offered by someone else and missing plants', async t => {
  let target = { ownerId: 'demo-alex', isDemo: true };
  t.mock.method(mongoose.connection, 'transaction', async callback => callback({}));
  t.mock.method(Plant, 'findById', id => ({ session: async () => id === targetId ? target : { ownerId: 'demo-sam' } }));
  await assert.rejects(swapPlants(targetId, offeredId), { status: 409 });
  target = null;
  await assert.rejects(swapPlants(targetId, offeredId), { status: 404 });
});
