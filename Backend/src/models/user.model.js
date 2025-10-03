import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
  },
  profile_pic: {
    type: String, // Will store base64 or URL
    default: null,
  },
  role: {
    type: String,
    default: 'authenticated',
  },
}, {
  timestamps: true,
});

const User = mongoose.model('User', userSchema);
export default User;