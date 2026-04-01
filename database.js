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

function initDb() {
  const db = getDb();
  db.exec(`CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, email TEXT UNIQUE NOT NULL, password_hash TEXT NOT NULL, salt TEXT NOT NULL, nickname TEXT NOT NULL, first_name TEXT NOT NULL, last_name TEXT NOT NULL, phone TEXT, contact_type TEXT DEFAULT 'whatsapp', role TEXT DEFAULT 'player' CHECK(role IN ('admin','league_admin','player')), created_at DATETIME DEFAULT CURRENT_TIMESTAMP);`);
  console.log('Database initialized!');
}

module.exports = { getDb, initDb, DB_PATH };
