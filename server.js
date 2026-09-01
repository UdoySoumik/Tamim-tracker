'use strict';

const express = require('express');
const { Pool } = require('pg');
const path = require('path');
const config = require('./config');

const app = express();
const PORT = config.server.port;

// ── Database Pool ───────────────────────────────────────────────────────────
const pool = new Pool(config.database);

pool.on('error', err => {
  console.error('Unexpected error on idle client', err);
});

// ── Initialize Schema ────────────────────────────────────────────────────────
async function initSchema() {
  const client = await pool.connect();
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS checkins (
        id        SERIAL PRIMARY KEY,
        seen_by   VARCHAR(100) NOT NULL,
        location  VARCHAR(200),
        seen_at   TIMESTAMP WITH TIME ZONE NOT NULL
      );
    `);
    console.log('✓ Schema initialized');
  } catch (err) {
    console.error('Schema error:', err.message);
  } finally {
    client.release();
  }
}

// ── Middleware ───────────────────────────────────────────────────────────────
app.use(express.json({ limit: '10kb' }));
app.use(express.static(path.join(__dirname, 'public')));

// ── Routes ───────────────────────────────────────────────────────────────────

/** GET /api/latest — most recent check-in */
app.get('/api/latest', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, seen_by, location, seen_at FROM checkins ORDER BY seen_at DESC LIMIT 1'
    );
    const row = result.rows[0];
    res.json(row || null);
  } catch (err) {
    console.error('GET /api/latest:', err.message);
    res.status(500).json({ error: 'Database error' });
  }
});

/** GET /api/checkins?page=1&limit=20 — paginated history */
app.get('/api/checkins', async (req, res) => {
  try {
    const page   = Math.max(1, parseInt(req.query.page) || 1);
    const limit  = Math.min(50, Math.max(1, parseInt(req.query.limit) || 20));
    const offset = (page - 1) * limit;

    const countResult = await pool.query('SELECT COUNT(*) FROM checkins');
    const total = parseInt(countResult.rows[0].count, 10);

    const result = await pool.query(
      'SELECT id, seen_by, location, seen_at FROM checkins ORDER BY seen_at DESC LIMIT $1 OFFSET $2',
      [limit, offset]
    );
    const checkins = result.rows;

    res.json({ checkins, total, page, limit });
  } catch (err) {
    console.error('GET /api/checkins:', err.message);
    res.status(500).json({ error: 'Database error' });
  }
});

/** POST /api/checkin — record a new sighting */
app.post('/api/checkin', async (req, res) => {
  try {
    const { seen_by, location } = req.body || {};

    if (!seen_by || typeof seen_by !== 'string' || seen_by.trim() === '') {
      return res.status(400).json({ error: 'seen_by is required' });
    }

    const sanitisedBy  = seen_by.trim().slice(0, 100);
    const sanitisedLoc =
      location && typeof location === 'string' && location.trim() !== ''
        ? location.trim().slice(0, 200)
        : null;

    const seen_at = new Date().toISOString();

    const result = await pool.query(
      'INSERT INTO checkins (seen_by, location, seen_at) VALUES ($1, $2, $3) RETURNING id, seen_by, location, seen_at',
      [sanitisedBy, sanitisedLoc, seen_at]
    );

    const newRow = result.rows[0];
    res.status(201).json(newRow);
  } catch (err) {
    console.error('POST /api/checkin:', err.message);
    res.status(500).json({ error: 'Database error' });
  }
});

// ── Start ────────────────────────────────────────────────────────────────────
(async () => {
  try {
    await initSchema();
    app.listen(PORT, () => {
      console.log(`🔍 Tamim Tracker → http://localhost:${PORT}`);
      console.log(`📊 PostgreSQL: ${config.database.user}@${config.database.host}:${config.database.port}/${config.database.database}`);
    });
  } catch (err) {
    console.error('Failed to start:', err.message);
    process.exit(1);
  }
})();
