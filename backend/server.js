const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const path = require('path');
const { connectDB, User, UserSettings, Alert } = require('./db');

const app = express();
const PORT = process.env.PORT || 3001;
const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-key-safe-water';

app.use(cors());
app.use(express.json());

// Connect to MongoDB
connectDB();

// Helper to generate token
const generateToken = (user) => {
  return jwt.sign({ id: user._id, email: user.email, name: user.name }, JWT_SECRET, { expiresIn: '7d' });
};

// Middleware to protect routes
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};

// API ROUTES
app.post('/api/auth/register', async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) return res.status(400).json({ error: 'All fields required' });

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ error: 'Email already exists' });

    const hashedPassword = bcrypt.hashSync(password, 10);
    const user = new User({ name, email, password: hashedPassword });
    await user.save();

    const settings = new UserSettings({ userId: user._id });
    await settings.save();

    const newUser = { id: user._id, name: user.name, email: user.email };
    res.status(201).json({ user: newUser, token: generateToken(user) });
  } catch (err) {
    res.status(500).json({ error: 'Database error' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Email and password required' });

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });

    const isValidPassword = bcrypt.compareSync(password, user.password);
    if (!isValidPassword) return res.status(401).json({ error: 'Invalid credentials' });

    res.json({ user: { id: user._id, name: user.name, email: user.email }, token: generateToken(user) });
  } catch (err) {
    res.status(500).json({ error: 'Database error' });
  }
});

app.get('/api/auth/me', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) return res.status(401).json({ error: 'User not found' });
    res.json({ user: { id: user._id, name: user.name, email: user.email } });
  } catch (err) {
    res.status(500).json({ error: 'Database error' });
  }
});

app.get('/api/settings', authenticateToken, async (req, res) => {
  try {
    let settings = await UserSettings.findOne({ userId: req.user.id });
    if (!settings) {
       settings = new UserSettings({ userId: req.user.id });
       await settings.save();
    }
    res.json({ settings });
  } catch (err) {
    res.status(500).json({ error: 'Database error' });
  }
});

app.post('/api/settings', authenticateToken, async (req, res) => {
  const { family_size, water_can_cost, hydration_goal } = req.body;
  try {
    await UserSettings.findOneAndUpdate(
      { userId: req.user.id },
      { 
        family_size: family_size || 4, 
        water_can_cost: water_can_cost || 80, 
        hydration_goal: hydration_goal || 8 
      },
      { upsert: true, new: true }
    );
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Database error' });
  }
});

app.get('/api/alerts', authenticateToken, async (req, res) => {
  try {
    const alerts = await Alert.find().sort({ createdAt: -1 }).limit(50);
    // Map _id to id and createdAt to created_at for frontend compatibility
    const mappedAlerts = alerts.map(a => ({
      id: a._id,
      title: a.title,
      location: a.location,
      type: a.type,
      author: a.author,
      created_at: a.createdAt
    }));
    res.json({ alerts: mappedAlerts });
  } catch (err) {
    res.status(500).json({ error: 'Database error' });
  }
});

app.post('/api/alerts', authenticateToken, async (req, res) => {
  const { title, location, type } = req.body;
  if (!title || !location || !type) return res.status(400).json({ error: 'Missing fields' });

  try {
    const alert = new Alert({ title, location, type, author: req.user.name });
    await alert.save();
    res.status(201).json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Database error' });
  }
});

// SERVE FRONTEND (For Production)
const buildPath = path.join(__dirname, '../dist');
app.use(express.static(buildPath));

app.get('*', (req, res) => {
  res.sendFile(path.join(buildPath, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Backend Database Server running on http://localhost:${PORT}`);
});
