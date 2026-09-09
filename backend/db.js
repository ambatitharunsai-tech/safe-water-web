const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // If no URI is provided, we default to localhost for local testing
    const uri = process.env.MONGO_URI || 'mongodb://localhost:27017/safe-water';
    await mongoose.connect(uri);
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

// Define Schemas
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const userSettingsSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  family_size: { type: Number, default: 4 },
  water_can_cost: { type: Number, default: 80 },
  hydration_goal: { type: Number, default: 8 }
});

const alertSchema = new mongoose.Schema({
  title: { type: String, required: true },
  location: { type: String, required: true },
  type: { type: String, required: true }, // danger, warning, info
  author: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

// Create Models
const User = mongoose.model('User', userSchema);
const UserSettings = mongoose.model('UserSettings', userSettingsSchema);
const Alert = mongoose.model('Alert', alertSchema);

module.exports = { connectDB, User, UserSettings, Alert };
