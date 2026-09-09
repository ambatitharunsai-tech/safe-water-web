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

// API ROUTES
app.post('/api/auth/register', (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) return res.status(400).json({ error: 'All fields required' });

  try {
    const existingUser = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
    if (existingUser) return res.status(400).json({ error: 'Email already exists' });

    const hashedPassword = bcrypt.hashSync(password, 10);
    const stmt = db.prepare('INSERT INTO users (name, email, password) VALUES (?, ?, ?)');
    const info = stmt.run(name, email, hashedPassword);

    db.prepare('INSERT INTO user_settings (user_id) VALUES (?)').run(info.lastInsertRowid);

    const newUser = { id: info.lastInsertRowid, name, email };
    res.status(201).json({ user: newUser, token: generateToken(newUser) });
  } catch (err) {
    res.status(500).json({ error: 'Database error' });
  }
});

app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Email and password required' });

  try {
    const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });

    const isValidPassword = bcrypt.compareSync(password, user.password);
    if (!isValidPassword) return res.status(401).json({ error: 'Invalid credentials' });

    res.json({ user: { id: user.id, name: user.name, email: user.email }, token: generateToken(user) });
  } catch (err) {
    res.status(500).json({ error: 'Database error' });
  }
});

app.get('/api/auth/me', authenticateToken, (req, res) => {
  try {
    const user = db.prepare('SELECT id, name, email FROM users WHERE id = ?').get(req.user.id);
    if (!user) return res.status(401).json({ error: 'User not found' });
    res.json({ user });
  } catch (err) {
    res.status(500).json({ error: 'Database error' });
  }
});

app.get('/api/settings', authenticateToken, (req, res) => {
  try {
    let settings = db.prepare('SELECT * FROM user_settings WHERE user_id = ?').get(req.user.id);
    if (!settings) {
       db.prepare('INSERT INTO user_settings (user_id) VALUES (?)').run(req.user.id);
       settings = db.prepare('SELECT * FROM user_settings WHERE user_id = ?').get(req.user.id);
    }
    res.json({ settings });
  } catch (err) {
    res.status(500).json({ error: 'Database error' });
  }
});

app.post('/api/settings', authenticateToken, (req, res) => {
  const { family_size, water_can_cost, hydration_goal } = req.body;
  try {
    const stmt = db.prepare(`
      UPDATE user_settings 
      SET family_size = ?, water_can_cost = ?, hydration_goal = ?
      WHERE user_id = ?
    `);
    stmt.run(
       family_size || 4, 
       water_can_cost || 80, 
       hydration_goal || 8, 
       req.user.id
    );
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Database error' });
  }
});

app.get('/api/alerts', authenticateToken, (req, res) => {
  try {
    const alerts = db.prepare('SELECT * FROM alerts ORDER BY created_at DESC LIMIT 50').all();
    res.json({ alerts });
  } catch (err) {
    res.status(500).json({ error: 'Database error' });
  }
});

app.post('/api/alerts', authenticateToken, (req, res) => {
  const { title, location, type } = req.body;
  if (!title || !location || !type) return res.status(400).json({ error: 'Missing fields' });

  try {
    const stmt = db.prepare('INSERT INTO alerts (title, location, type, author) VALUES (?, ?, ?, ?)');
    stmt.run(title, location, type, req.user.name);
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
