// @ts-ignore
import Database from 'better-sqlite3';
import * as dotenv from 'dotenv';

dotenv.config();

const db = new Database(/*process.env.DATABASE_URL*/"./back/database/transcendence.sqlite");

// TODO: Create the right tables with the right references

// Create tables (if they don't exist)
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    username    TEXT UNIQUE NOT NULL,
    password    TEXT NOT NULL,
    avatar      TEXT UNIQUE NOT NULL,
    connected   BOOLEAN NOT NULL,
    created_at  DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS games (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    player1_id  INTEGER NOT NULL,
    player2_id  INTEGER NOT NULL,
    winner_id   INTEGER,
    loser_id    INTEGER,
    score_p1    INTEGER NOT NULL,
    score_p2    INTEGER NOT NULL,
    played_at   DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (player1_id)    REFERENCES users (id),
    FOREIGN KEY (player2_id)    REFERENCES users (id),
    FOREIGN KEY (winner_id)     REFERENCES users (id),
    FOREIGN KEY (loser_id)      REFERENCES users (id)
  );

  CREATE TABLE IF NOT EXISTS friends (
    id        INTEGER PRIMARY KEY AUTOINCREMENT,
    user1_id  INTEGER NOT NULL,
    user2_id  INTEGER NOT NULL,
    FOREIGN KEY (user1_id)    REFERENCES users (id),
    FOREIGN KEY (user2_id)    REFERENCES users (id)
  );

  CREATE TABLE IF NOT EXISTS user_stats (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id     INTEGER NOT NULL,
    pong_win    INTEGER NOT NULL,
    pong_lose   INTEGER NOT NULL,
    tetris_win  INTEGER NOT NULL,
    tetris_lose INTEGER NOT NULL,
    FOREIGN KEY (user_id)    REFERENCES users (id)
  );

`);

export default db;