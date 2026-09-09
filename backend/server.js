require('dotenv').config();

const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const path = require('path');
const db = require('./db');

// ── Environment validation ───────────────────────────

const PORT = process.env.PORT || 3001;
const JWT_SECRET = process.env.JWT_SECRET;
const FRONTEND_URL = process.env.FRONTEND_URL || '';
const NODE_ENV = process.env.NODE_ENV || 'development';

if (!JWT_SECRET) {
  if (NODE_ENV === 'production') {
    console.error('❌ FATAL: JWT_SECRET is not set in production.');
    process.exit(1);
  }
  console.warn('⚠️  JWT_SECRET not set — using dev fallback. Do NOT use in production.');
}

const SECRET = JWT_SECRET || 'dev-only-secret-do-not-use-in-production';

// ── Express app ──────────────────────────────────────

const app = express();

// CORS configuration
const corsOptions = {
  origin: NODE_ENV === 'production'
    ? (FRONTEND_URL ? FRONTEND_URL.split(',').map(u => u.trim()) : true)
    : true,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));
app.use(express.json({ limit: '1mb' }));

// ── Helpers ──────────────────────────────────────────

function generateToken(user) {
  return jwt.sign(
    { id: String(user._id), email: user.email, name: user.name },
    SECRET,
    { expiresIn: '7d' }
  );
}

function safeUser(user) {
  return {
    id: String(user._id),
    name: user.name,
    email: user.email
  };
}

// ── Auth middleware ───────────────────────────────────

function authenticateToken(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, SECRET);
    req.user = decoded;
    next();
  } catch {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
}

// ── Health endpoint ──────────────────────────────────

app.get('/api/health', async (_req, res) => {
  try {
    const connected = await db.isConnected();
    res.json({
      status: connected ? 'ok' : 'degraded',
      database: connected ? 'connected' : 'disconnected',
      timestamp: new Date().toISOString()
    });
  } catch {
    res.status(503).json({
      status: 'error',
      database: 'disconnected',
      timestamp: new Date().toISOString()
    });
  }
});

// ── Auth routes ──────────────────────────────────────

app.post('/api/auth/register', async (req, res) => {
  const { name, email, password } = req.body;

  // Validate required fields
  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Name, email, and password are required' });
  }

  // Validate name
  const trimmedName = String(name).trim();
  if (trimmedName.length < 2) {
    return res.status(400).json({ error: 'Name must be at least 2 characters' });
  }

  // Validate email format
  const normalizedEmail = String(email).trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
    return res.status(400).json({ error: 'Invalid email format' });
  }

  // Validate password length
  if (String(password).length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters' });
  }

  try {
    const existing = await db.findUserByEmail(normalizedEmail);
    if (existing) {
      return res.status(409).json({ error: 'An account with this email already exists' });
    }

    const hashedPassword = await bcrypt.hash(String(password), 10);
    const user = await db.createUser(trimmedName, normalizedEmail, hashedPassword);

    res.status(201).json({
      user: safeUser(user),
      token: generateToken(user)
    });
  } catch (err) {
    console.error('Register error:', err.message);
    res.status(500).json({ error: 'Registration failed. Please try again.' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  try {
    const normalizedEmail = String(email).trim().toLowerCase();
    const user = await db.findUserByEmail(normalizedEmail);
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isValid = await bcrypt.compare(String(password), user.password);
    if (!isValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    res.json({
      user: safeUser(user),
      token: generateToken(user)
    });
  } catch (err) {
    console.error('Login error:', err.message);
    res.status(500).json({ error: 'Login failed. Please try again.' });
  }
});

app.get('/api/auth/me', authenticateToken, async (req, res) => {
  try {
    const user = await db.findUserById(req.user.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({ user: safeUser(user) });
  } catch (err) {
    console.error('Auth/me error:', err.message);
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

// ── Settings routes ──────────────────────────────────

app.get('/api/settings', authenticateToken, async (req, res) => {
  try {
    const settings = await db.getSettings(req.user.id);
    res.json({ settings });
  } catch (err) {
    console.error('Get settings error:', err.message);
    res.status(500).json({ error: 'Failed to fetch settings' });
  }
});

app.post('/api/settings', authenticateToken, async (req, res) => {
  const { family_size, water_can_cost, hydration_goal } = req.body;

  // Validate types
  if (
    family_size === undefined ||
    water_can_cost === undefined ||
    hydration_goal === undefined
  ) {
    return res.status(400).json({ error: 'family_size, water_can_cost, and hydration_goal are required' });
  }

  try {
    const updated = await db.updateSettings(
      req.user.id,
      family_size,
      water_can_cost,
      hydration_goal
    );
    res.json({ success: true, settings: updated });
  } catch (err) {
    if (err.message === 'INVALID_SETTINGS') {
      return res.status(400).json({ error: 'Invalid settings values. All must be positive numbers.' });
    }
    console.error('Update settings error:', err.message);
    res.status(500).json({ error: 'Failed to update settings' });
  }
});

// ── Alerts routes ────────────────────────────────────

app.get('/api/alerts', authenticateToken, async (req, res) => {
  try {
    const alerts = await db.getAlerts(50);
    // Map _id to id for frontend compatibility
    const mapped = alerts.map(a => ({
      id: String(a._id),
      title: a.title,
      location: a.location,
      type: a.type,
      author: a.author,
      created_at: a.created_at
    }));
    res.json({ alerts: mapped });
  } catch (err) {
    console.error('Get alerts error:', err.message);
    res.status(500).json({ error: 'Failed to fetch alerts' });
  }
});

app.post('/api/alerts', authenticateToken, async (req, res) => {
  const { title, location, type } = req.body;

  if (!title || !location || !type) {
    return res.status(400).json({ error: 'title, location, and type are required' });
  }

  const validTypes = ['danger', 'warning', 'info'];
  if (!validTypes.includes(String(type).trim())) {
    return res.status(400).json({ error: `type must be one of: ${validTypes.join(', ')}` });
  }

  try {
    const alert = await db.createAlert(title, location, type, req.user.name);
    res.status(201).json({
      success: true,
      alert: {
        id: String(alert._id),
        title: alert.title,
        location: alert.location,
        type: alert.type,
        author: alert.author,
        created_at: alert.created_at
      }
    });
  } catch (err) {
    console.error('Create alert error:', err.message);
    res.status(500).json({ error: 'Failed to create alert' });
  }
});

// ── Serve frontend (production) ──────────────────────

const buildPath = path.join(__dirname, '../dist');
app.use(express.static(buildPath));

app.get('{*path}', (_req, res) => {
  res.sendFile(path.join(buildPath, 'index.html'));
});

// ── Startup ──────────────────────────────────────────

async function start() {
  try {
    await db.initDB();
    app.listen(PORT, () => {
      console.log(`🚀 Safe Water Web backend running on http://localhost:${PORT}`);
      console.log(`📊 Environment: ${NODE_ENV}`);
    });
  } catch (err) {
    console.error('❌ Failed to start server:', err.message);
    process.exit(1);
  }
}

start();
