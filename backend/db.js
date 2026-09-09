// Simple in-memory database — no native modules, works everywhere
// Data resets when server restarts (same behavior as free-tier Render anyway)

const db = {
  users: [],
  alerts: [],
  userSettings: [],
  _nextUserId: 1,
  _nextAlertId: 1,

  // ── Users ──────────────────────────────────────────
  findUserByEmail(email) {
    return this.users.find(u => u.email === email) || null;
  },

  findUserById(id) {
    return this.users.find(u => u.id === id) || null;
  },

  createUser(name, email, hashedPassword) {
    const user = {
      id: this._nextUserId++,
      name,
      email,
      password: hashedPassword,
      created_at: new Date().toISOString(),
    };
    this.users.push(user);

    // Auto-create default settings
    this.userSettings.push({
      user_id: user.id,
      family_size: 4,
      water_can_cost: 80,
      hydration_goal: 8,
    });

    return user;
  },

  // ── Settings ───────────────────────────────────────
  getSettings(userId) {
    let settings = this.userSettings.find(s => s.user_id === userId);
    if (!settings) {
      settings = { user_id: userId, family_size: 4, water_can_cost: 80, hydration_goal: 8 };
      this.userSettings.push(settings);
    }
    return settings;
  },

  updateSettings(userId, family_size, water_can_cost, hydration_goal) {
    let settings = this.userSettings.find(s => s.user_id === userId);
    if (settings) {
      settings.family_size = family_size || 4;
      settings.water_can_cost = water_can_cost || 80;
      settings.hydration_goal = hydration_goal || 8;
    } else {
      this.userSettings.push({
        user_id: userId,
        family_size: family_size || 4,
        water_can_cost: water_can_cost || 80,
        hydration_goal: hydration_goal || 8,
      });
    }
  },

  // ── Alerts ─────────────────────────────────────────
  getAlerts(limit = 50) {
    return this.alerts
      .slice()
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
      .slice(0, limit);
  },

  createAlert(title, location, type, author) {
    const alert = {
      id: this._nextAlertId++,
      title,
      location,
      type,
      author,
      created_at: new Date().toISOString(),
    };
    this.alerts.push(alert);
    return alert;
  },
};

module.exports = db;
