import Database from 'better-sqlite3'
import path from 'path'

const DB_PATH = path.resolve(process.cwd(), 'versify.db')

const db = new Database(DB_PATH)

db.pragma('journal_mode = WAL')
db.pragma('foreign_keys = ON')

db.exec(`
  CREATE TABLE IF NOT EXISTS plays (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    name       TEXT    NOT NULL UNIQUE,
    created_at TEXT    NOT NULL DEFAULT CURRENT_TIMESTAMP
  );
`)

db.exec(`
  CREATE TABLE IF NOT EXISTS poems (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    play_id    INTEGER NOT NULL REFERENCES plays(id) ON DELETE CASCADE,
    title      TEXT    NOT NULL,
    body       TEXT    NOT NULL DEFAULT '',
    created_at TEXT    NOT NULL DEFAULT CURRENT_TIMESTAMP
  );
`)

db.exec(`
  CREATE TABLE IF NOT EXISTS reviews (
    poem_id     INTEGER PRIMARY KEY REFERENCES poems(id) ON DELETE CASCADE,
    grades      TEXT NOT NULL,
    suggestions TEXT NOT NULL,
    created_at  TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  );
`)

db.exec(`
  CREATE TABLE IF NOT EXISTS comparisons (
    poem_id    INTEGER PRIMARY KEY REFERENCES poems(id) ON DELETE CASCADE,
    poets      TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  );
`)

export default db
