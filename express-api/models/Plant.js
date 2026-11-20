
import mongoose from 'mongoose';

const plantSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },

  species: {
    type: String,
    required: true
  },

  lightNeeds: {
    type: String,
    enum: ['low', 'medium', 'bright'],
    default: 'medium'
  },

  tags: {
    type: [String],
    default: []
  },

  imageUrl: { type: String, default: null },
  imageLicense: { type: String, default: null },
  imageLicenseUrl: { type: String, default: null },
  ownerId: { type: String, default: 'you' },
  ownerName: { type: String, default: 'You' },
  isDemo: { type: Boolean, default: false },
  demoKey: { type: String, unique: true, sparse: true },

  swapped: {
    type: Boolean,
    default: false
  }
});

export default mongoose.model('Plant', plantSchema);
