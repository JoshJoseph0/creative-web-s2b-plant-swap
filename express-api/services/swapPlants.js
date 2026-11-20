import mongoose from 'mongoose';
import Plant from '../models/Plant.js';

export async function swapPlants(targetId, offeredId) {
  if (!/^[a-f\d]{24}$/i.test(targetId) || !/^[a-f\d]{24}$/i.test(offeredId) || targetId === offeredId) {
    throw Object.assign(new Error('Choose a different plant from your shelf'), { status: 400 });
  }
  await mongoose.connection.transaction(async session => {
    const target = await Plant.findById(targetId).session(session);
    const offered = await Plant.findById(offeredId).session(session);
    if (!target || !offered) {
      throw Object.assign(new Error('Plant not found'), { status: 404 });
    }
    if (!target.isDemo || target.ownerId === 'you' || offered.ownerId !== 'you' || target.swapped || offered.swapped) {
      throw Object.assign(new Error('These plants are no longer available for a swap'), { status: 409 });
    }
    offered.ownerId = target.ownerId;
    offered.ownerName = target.ownerName;
    target.ownerId = 'you';
    target.ownerName = 'You';
    target.swapped = true;
    offered.swapped = true;
    await target.save({ session });
    await offered.save({ session });
  });
}
