import mongoose from 'mongoose';

const plantSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  species: {
    type: String,
    required: true,
  },
  swaped: {
    type: Boolean,
    default: false,     
}
});
export default mongoose.model('Plant', plantSchema);
