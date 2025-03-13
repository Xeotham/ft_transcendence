// @ts-ignore
import Database from 'better-sqlite3';
import * as dotenv from 'dotenv';

dotenv.config();

const db = new Database(/*process.env.DATABASE_URL*/"./back/database/transcendence.sqlite");

// TODO: Create the right tables with the right references

// Create tables (if they don't exist)
// DROP TABLE IF EXISTS users;
// DROP TABLE IF EXISTS user;
// DROP TABLE IF EXISTS game;
// DROP TABLE IF EXISTS stat;
// DROP TABLE IF EXISTS games_users;
// DROP TABLE IF EXISTS stats_users;
// DROP TABLE IF EXISTS contact;
// DROP TABLE IF EXISTS message;
db.exec(`
  
  
  CREATE TABLE IF NOT EXISTS user 
  (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    username    VARCHAR(150) UNIQUE NOT NULL,
    password    VARCHAR(150) NOT NULL,
    avatar      VARCHAR(150) DEFAULT null,
    connected   BOOLEAN DEFAULT false,
    created_at  DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS game
  (
    id		INTEGER PRIMARY KEY AUTOINCREMENT,
    date 	DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS stat (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    pong_win    INTEGER DEFAULT 0,
    pong_lose   INTEGER DEFAULT 0,
    tetris_win  INTEGER DEFAULT 0,
    tetris_lose INTEGER DEFAULT 0
  );

  CREATE TABLE IF NOT EXISTS contact
  (
      user1_id INTEGER NOT NULL,
      user2_id INTEGER NOT NULL,
      friend  BOOLEAN DEFAULT 0,
      blocked BOOLEAN DEFAULT 0,
      FOREIGN KEY (user1_id) REFERENCES user(id),
      FOREIGN KEY (user2_id) REFERENCES user(id),
      PRIMARY KEY (user1_id, user2_id),
      UNIQUE (user1_id, user2_id),
      UNIQUE (user2_id, user1_id)
  );

  CREATE TABLE IF NOT EXISTS message
  (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    sender_id INTEGER NOT NULL,
    recipient_id INTEGER NOT NULL,
    content TEXT,
    date DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (sender_id) REFERENCES user(id),
    FOREIGN KEY (recipient_id) REFERENCES user(id)
  );

  CREATE TABLE IF NOT EXISTS games_users 
  (
      user_id INTEGER NOT NULL,
      game_id INTEGER NOT NULL,
      score   INTEGER NOT NULL,
      winner  BOOLEAN NOT NULL,
      type    VARCHAR(50) NOT NULL,
      FOREIGN KEY (user_id) REFERENCES user(id),
      FOREIGN KEY (game_id) REFERENCES game(id),
      PRIMARY KEY (user_id, game_id),
      UNIQUE (user_id, game_id)
  );

  CREATE TABLE IF NOT EXISTS stats_users (
    user_id INTEGER NOT NULL,
    stat_id INTEGER NOT NULL,
    FOREIGN KEY (user_id) REFERENCES user(id),
    FOREIGN KEY (stat_id) REFERENCES stat(id),
    PRIMARY KEY (user_id, stat_id),
    UNIQUE      (user_id, stat_id)
  );

  

`);

// CREATE TRIGGER update_win_pong_stat
//   AFTER INSERT ON games_users
//   WHEN winner = true AND type = 'pong' 
//   BEGIN
//     UPDATE stat
//     SET pong_win = pong_win + 1
//     WHERE id = NEW.users_id;
//   END;

export default db;