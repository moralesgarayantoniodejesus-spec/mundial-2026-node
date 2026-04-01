/**
 * Database module - SQLite database setup and queries for Mundial 2026
 */
const Database = require('better-sqlite3');
const path = require('path');

const DB_PATH = path.join(__dirname, 'mundial2026.db');
let dbInstance = null;

/**
 * Get or create database connection
 */
function getDb() {
  if (!dbInstance) {
    dbInstance = new Database(DB_PATH);
    dbInstance.pragma('journal_mode = WAL');
    dbInstance.pragma('foreign_keys = ON');
  }
  return dbInstance;
}

/**
 * Initialize database schema
 */
function initDb() {
  const db = getDb();

  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        salt TEXT NOT NULL,
        nickname TEXT NOT NULL,
        first_name TEXT NOT NULL,
        last_name TEXT NOT NULL,
        phone TEXT,
        contact_type TEXT DEFAULT 'whatsapp',
        role TEXT DEFAULT 'player' CHECK(role IN ('admin','league_admin','player')),
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS teams (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        code TEXT NOT NULL UNIQUE,
        group_letter TEXT NOT NULL,
        flag TEXT
    );

    CREATE TABLE IF NOT EXISTS matches (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        home_team_id INTEGER NOT NULL REFERENCES teams(id),
        away_team_id INTEGER NOT NULL REFERENCES teams(id),
        group_letter TEXT,
        phase TEXT DEFAULT 'Fase de Grupos',
        match_date TEXT NOT NULL,
        match_time TEXT NOT NULL,
        home_score INTEGER,
        away_score INTEGER,
        played INTEGER DEFAULT 0,
        match_day INTEGER DEFAULT 1
    );

    CREATE TABLE IF NOT EXISTS leagues (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        type TEXT NOT NULL CHECK(type IN ('quiniela','survivor')),
        admin_id INTEGER NOT NULL REFERENCES users(id),
        invite_code TEXT UNIQUE,
        rules_text TEXT,
        rules_locked INTEGER DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS league_scoring (
        league_id INTEGER PRIMARY KEY REFERENCES leagues(id),
        exact_score INTEGER DEFAULT 3,
        correct_winner INTEGER DEFAULT 1,
        correct_draw INTEGER DEFAULT 1,
        goal_difference INTEGER DEFAULT 1,
        group_first INTEGER DEFAULT 3,
        group_second INTEGER DEFAULT 2
    );

    CREATE TABLE IF NOT EXISTS league_survivor_config (
        league_id INTEGER PRIMARY KEY REFERENCES leagues(id),
        lives INTEGER DEFAULT 5,
        extra_lives INTEGER DEFAULT 3
    );

    CREATE TABLE IF NOT EXISTS league_members (
        league_id INTEGER NOT NULL REFERENCES leagues(id),
        user_id INTEGER NOT NULL REFERENCES users(id),
        status TEXT DEFAULT 'pending' CHECK(status IN ('pending','approved','rejected')),
        joined_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (league_id, user_id)
    );

    CREATE TABLE IF NOT EXISTS predictions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL REFERENCES users(id),
        league_id INTEGER NOT NULL REFERENCES leagues(id),
        match_id INTEGER NOT NULL REFERENCES matches(id),
        home_score INTEGER NOT NULL,
        away_score INTEGER NOT NULL,
        points INTEGER DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(user_id, league_id, match_id)
    );

    CREATE TABLE IF NOT EXISTS survivor_picks (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL REFERENCES users(id),
        league_id INTEGER NOT NULL REFERENCES leagues(id),
        match_day INTEGER NOT NULL,
        team_id INTEGER NOT NULL REFERENCES teams(id),
        result TEXT DEFAULT 'pending' CHECK(result IN ('pending','win','loss')),
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(user_id, league_id, match_day)
    );

    CREATE TABLE IF NOT EXISTS survivor_status (
        user_id INTEGER NOT NULL REFERENCES users(id),
        league_id INTEGER NOT NULL REFERENCES leagues(id),
        alive INTEGER DEFAULT 1,
        lives_remaining INTEGER DEFAULT 5,
        survived_days INTEGER DEFAULT 0,
        PRIMARY KEY(user_id, league_id)
    );

    CREATE INDEX IF NOT EXISTS idx_predictions_user ON predictions(user_id, league_id);
    CREATE INDEX IF NOT EXISTS idx_matches_date ON matches(match_date);
    CREATE INDEX IF NOT EXISTS idx_league_members ON league_members(league_id, status);
  `);

  // Migrations for optional columns
  try {
    db.exec('ALTER TABLE leagues ADD COLUMN invite_code TEXT');
  } catch (e) {
    // Column already exists
  }

  try {
    db.exec('ALTER TABLE leagues ADD COLUMN rules_text TEXT');
  } catch (e) {
    // Column already exists
  }

  try {
    db.exec('ALTER TABLE leagues ADD COLUMN rules_locked INTEGER DEFAULT 0');
  } catch (e) {
    // Column already exists
  }

  console.log('Database initialized successfully!');
}

module.exports = {
  getDb,
  initDb,
  DB_PATH
};
