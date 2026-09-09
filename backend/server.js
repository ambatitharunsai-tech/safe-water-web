const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const path = require('path');
const db = require('./db');

const app = express();
const PORT = process.env.PORT || 3001;
const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-key-safe-water';

app.use(cors());
app.use(express.json());

// Helper to generate token
const generateToken = (user) => {
  return jwt.sign({ id: user.id, email: user.email, name: user.name }, JWT_SECRET, { expiresIn: '7d' });
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

// ── Auth Routes ──────────────────────────────────────
app.post('/api/auth/register', (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) return res.status(400).json({ error: 'All fields required' });

  try {
    if (db.findUserByEmail(email)) return res.status(400).json({ error: 'Email already exists' });

    const hashedPassword = bcrypt.hashSync(password, 10);
    const user = db.createUser(name, email, hashedPassword);

    const newUser = { id: user.id, name: user.name, email: user.email };
    res.status(201).json({ user: newUser, token: generateToken(newUser) });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Email and password required' });

  try {
    const user = db.findUserByEmail(email);
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });

    const isValid = bcrypt.compareSync(password, user.password);
    if (!isValid) return res.status(401).json({ error: 'Invalid credentials' });

    res.json({ user: { id: user.id, name: user.name, email: user.email }, token: generateToken(user) });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.get('/api/auth/me', authenticateToken, (req, res) => {
  try {
    const user = db.findUserById(req.user.id);
    if (!user) return res.status(401).json({ error: 'User not found' });
    res.json({ user: { id: user.id, name: user.name, email: user.email } });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// ── Settings Routes ──────────────────────────────────
app.get('/api/settings', authenticateToken, (req, res) => {
  try {
    const settings = db.getSettings(req.user.id);
    res.json({ settings });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/settings', authenticateToken, (req, res) => {
  const { family_size, water_can_cost, hydration_goal } = req.body;
  try {
    db.updateSettings(req.user.id, family_size, water_can_cost, hydration_goal);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// ── Alerts Routes ────────────────────────────────────
app.get('/api/alerts', authenticateToken, (req, res) => {
  try {
    const alerts = db.getAlerts(50);
    res.json({ alerts });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/alerts', authenticateToken, (req, res) => {
  const { title, location, type } = req.body;
  if (!title || !location || !type) return res.status(400).json({ error: 'Missing fields' });

  try {
    db.createAlert(title, location, type, req.user.name);
    res.status(201).json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// ── Serve Frontend (Production) ──────────────────────
const buildPath = path.join(__dirname, '../dist');
app.use(express.static(buildPath));

app.get('{*path}', (req, res) => {
  res.sendFile(path.join(buildPath, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Backend Database Server running on http://localhost:${PORT}`);
});
