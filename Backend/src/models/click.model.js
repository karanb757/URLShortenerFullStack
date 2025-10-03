import mongoose from 'mongoose';

const clickSchema = new mongoose.Schema({
  url_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ShortUrl',
    required: true,
    index: true,
  },
  city: {
    type: String,
    default: 'Unknown',
  },
  country: {
    type: String,
    default: 'Unknown',
  },
  device: {
    type: String,
    default: 'desktop',
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true,
});

const Click = mongoose.model('Click', clickSchema);
export default Click;