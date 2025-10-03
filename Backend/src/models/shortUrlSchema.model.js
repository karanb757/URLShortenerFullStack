import mongoose from 'mongoose';

const shortUrlSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  full_url: {
    type: String,
    required: true,
  },
  original_url: { // Alias for compatibility
    type: String,
    required: true,
  },
  short_url: {
    type: String,
    required: true,
    index: true,
    unique: true,
  },
  custom_url: {
    type: String,
    default: null,
    sparse: true,
    unique: true,
  },
  qr: {
    type: String, // Base64 encoded QR code
    required: true,
  },
  clicks: {
    type: Number,
    required: true,
    default: 0,
  },
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true,
});

// Sync full_url and original_url
shortUrlSchema.pre('save', function(next) {
  if (this.full_url && !this.original_url) {
    this.original_url = this.full_url;
  } else if (this.original_url && !this.full_url) {
    this.full_url = this.original_url;
  }
  next();
});

const ShortUrl = mongoose.model('ShortUrl', shortUrlSchema);
export default ShortUrl;