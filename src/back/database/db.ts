// import Database from 'better-sqlite3';
// import  * as sqlite from "better-sqlite3";
// import { config } from 'dotenv';
// import { existsSync, mkdirSync } from 'node:fs';
// import { join, dirname } from 'path';
//
// // Define the path to the database file
// const dbPath = join(__dirname, 'transcendence.sqlite.db');
//
// // Ensure the directory exists
// const dbDir = dirname(dbPath);
//
// // Log the database directory and file paths for debugging
// console.log(`DB directory: ${dbDir}`);
// console.log(`DB file path: ${dbPath}`);
//
// // Create the directory if it doesn't exist
// if (!existsSync(dbDir)) {
//   console.log(`Directory does not exist. Creating: ${dbDir}`);
//   mkdirSync(dbDir, { recursive: true });
//   console.log(`Directory created: ${dbDir}`);
// } else {
//   console.log(`Directory already exists: ${dbDir}`);
// }
//
// config();
//
// let db: sqlite.Database | null = null;
//
// // Open the database
// try {
//   db = new Database(dbPath);
//   console.log(`Database opened successfully: ${dbPath}`);
//
//   // Create tables (if they don't exist)
//   db!.exec(`
//     CREATE TABLE IF NOT EXISTS users (
//                                        id          INTEGER PRIMARY KEY AUTOINCREMENT,
//                                        username    TEXT UNIQUE NOT NULL,
//                                        password    TEXT NOT NULL,
//                                        avatar      TEXT UNIQUE NOT NULL,
//                                        connected   BOOLEAN NOT NULL,
//                                        created_at  DATETIME DEFAULT CURRENT_TIMESTAMP
//     );
//
//     CREATE TABLE IF NOT EXISTS games (
//                                        id          INTEGER PRIMARY KEY AUTOINCREMENT,
//                                        player1_id  INTEGER NOT NULL,
//                                        player2_id  INTEGER NOT NULL,
//                                        winner_id   INTEGER,
//                                        loser_id    INTEGER,
//                                        score_p1    INTEGER NOT NULL,
//                                        score_p2    INTEGER NOT NULL,
//                                        played_at   DATETIME DEFAULT CURRENT_TIMESTAMP,
//                                        FOREIGN KEY (player1_id)    REFERENCES users (id),
//       FOREIGN KEY (player2_id)    REFERENCES users (id),
//       FOREIGN KEY (winner_id)     REFERENCES users (id),
//       FOREIGN KEY (loser_id)      REFERENCES users (id)
//       );
//
//     CREATE TABLE IF NOT EXISTS friends (
//                                          id        INTEGER PRIMARY KEY AUTOINCREMENT,
//                                          user1_id  INTEGER NOT NULL,
//                                          user2_id  INTEGER NOT NULL,
//                                          FOREIGN KEY (user1_id)    REFERENCES users (id),
//       FOREIGN KEY (user2_id)    REFERENCES users (id)
//       );
//
//     CREATE TABLE IF NOT EXISTS user_stats (
//                                             id          INTEGER PRIMARY KEY AUTOINCREMENT,
//                                             user_id     INTEGER NOT NULL,
//                                             pong_win    INTEGER NOT NULL,
//                                             pong_lose   INTEGER NOT NULL,
//                                             tetris_win  INTEGER NOT NULL,
//                                             tetris_lose INTEGER NOT NULL,
//                                             FOREIGN KEY (user_id)    REFERENCES users (id)
//       );
//   `);
// } catch (error: any) {
//   console.error(`Failed to open database: ${error.message}`);
// }
// export default db;
