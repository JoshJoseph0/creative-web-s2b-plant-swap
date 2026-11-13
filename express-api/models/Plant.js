
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

  swapped: {
    type: Boolean,
    default: false
  }
});

export default mongoose.model('Plant', plantSchema);
