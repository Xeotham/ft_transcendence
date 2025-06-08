// @ts-ignore
import Database from 'better-sqlite3';
import * as dotenv from 'dotenv';
import path from "node:path";
import * as fs from "node:fs";

dotenv.config();

const dbPath = "./database/transcendenceDb/transcendence.sqlite";
const dbDir = path.dirname(dbPath);

if (!fs.existsSync(dbDir)) {
	fs.mkdirSync(dbDir, { recursive: true });
}

const db = new Database(dbPath);

db.exec(` \

  
  CREATE TABLE IF NOT EXISTS user 
  (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    username    VARCHAR(150) UNIQUE NOT NULL,
    password    VARCHAR(150) NOT NULL,
    avatar      TEXT,
    connected   BOOLEAN DEFAULT false,
    createdAt   DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS game
  (
    id		INTEGER PRIMARY KEY AUTOINCREMENT,
    date 	DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS stat
  (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    userId     INTEGER NOT NULL,
    pongWin    INTEGER DEFAULT 0,
    pongLose   INTEGER DEFAULT 0,
    tetrisWin  INTEGER DEFAULT 0,
    tetrisLose INTEGER DEFAULT 0,
    FOREIGN KEY (userId) REFERENCES user(id)
  );

  CREATE TABLE IF NOT EXISTS contact
  (
      user1Id   INTEGER NOT NULL,
      user2Id   INTEGER NOT NULL,
      FOREIGN KEY (user1Id) REFERENCES user(id),
      FOREIGN KEY (user2Id) REFERENCES user(id),
      PRIMARY KEY (user1Id, user2Id),
      UNIQUE (user1Id, user2Id)
  );

  CREATE TABLE IF NOT EXISTS message
  (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    senderId    INTEGER NOT NULL,
    recipientId INTEGER NOT NULL,
    content     TEXT,
    date        DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (senderId) REFERENCES user(id),
    FOREIGN KEY (recipientId) REFERENCES user(id)
  );

  CREATE TABLE IF NOT EXISTS gamesUsers 
  (
    userId						INTEGER NOT NULL,
    gameId						INTEGER NOT NULL,
    score						INTEGER NOT NULL,
    winner						BOOLEAN NOT NULL,
    type						VARCHAR(50) NOT NULL,
    gameTetrisId				INTEGER NOT NULL DEFAULT 0,
	level						INTEGER DEFAULT 0,
    gameTime 					INTEGER DEFAULT 0,
    totalTime 				    VARCHAR(50) DEFAULT '00:00:00',
    maxCombo 					INTEGER DEFAULT 0,
    piecesPlaced 				INTEGER DEFAULT 0,
    piecesPerSecond				INTEGER DEFAULT 0,
    attacksSent					INTEGER DEFAULT 0,
    attacksSentPerMinute		INTEGER DEFAULT 0,
    attacksReceived				INTEGER DEFAULT 0,
    attacksReceivedPerMinute	INTEGER DEFAULT 0,
    keysPressed					INTEGER DEFAULT 0,
    keysPerPiece				INTEGER DEFAULT 0,
    keysPerSecond				INTEGER DEFAULT 0,
    holds						INTEGER DEFAULT 0,
    linesCleared				INTEGER DEFAULT 0,
    linesPerMinute				INTEGER DEFAULT 0,
    maxB2B						INTEGER DEFAULT 0,
    perfectClears				INTEGER DEFAULT 0,
    single						INTEGER DEFAULT 0,
    double						INTEGER DEFAULT 0,
    triple						INTEGER DEFAULT 0,
    quad						INTEGER DEFAULT 0,
    tspinZero					INTEGER DEFAULT 0,
    tspinSingle					INTEGER DEFAULT 0,
    tspinDouble					INTEGER DEFAULT 0,
    tspinTriple					INTEGER DEFAULT 0,
    tspinQuad					INTEGER DEFAULT 0,
    miniTspinZero				INTEGER DEFAULT 0,
    miniTspinSingle				INTEGER DEFAULT 0,
    miniSpinZero				INTEGER DEFAULT 0,
    miniSpinSingle				INTEGER DEFAULT 0,
    miniSpinDouble				INTEGER DEFAULT 0,
    miniSpinTriple				INTEGER DEFAULT 0,
    miniSpinQuad				INTEGER DEFAULT 0,
    FOREIGN KEY (userId) REFERENCES user(id),
    FOREIGN KEY (gameId) REFERENCES game(id),
    PRIMARY KEY (userId, gameId),
    UNIQUE (userId, gameId)
  );


`);

export default db;
