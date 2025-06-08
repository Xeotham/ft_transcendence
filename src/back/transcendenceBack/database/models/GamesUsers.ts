import db from '../db'

interface GamesUsers 
{
    userId:    number,
    gameId:    number,
    score:     number,
    winner:    boolean,
    type:      string
}

interface GameUserInfo
{
	date: 	 string;
	username?: string;
	totalTime: 	string;
	userId: number;
	score: 	number;
	level: number;
	isInRoom: boolean;
	winner: boolean;
	type: 	string;
	maxCombo: number;
	piecesPlaced: number;
	piecesPerSecond: number;
	attacksSent: number;
	attacksSentPerMinute: number;
	attacksReceived: number;
	attacksReceivedPerMinute: number;
	keysPressed: number;
	keysPerPiece: number;
	keysPerSecond: number;
	holds: number;
	linesCleared: number;
	linesPerMinute: number;
	maxB2b: number;
	perfectClears: number;
	single: number;
	double: number;
	triple: number;
	quad: number;
	tspinZero: number;
	tspinSingle: number;
	tspinDouble: number;
	tspinTriple: number;
	tspinQuad: number;
	miniTspinZero: number;
	miniTspinSingle: number;
	miniSpinZero: number;
	miniSpinSingle: number;
	miniSpinDouble: number;
	miniSpinTriple: number;
	miniSpinQuad: number;
}

interface GameIdRow 
{
	gameId: number;
}

export const createUserGameStatsPong = (userId: number, gameId: number, score: {username: string, score: number}, winner: boolean, type:string): void =>
{
	const win = (winner === true ? 1 : 0);
	const stmt = db.prepare('\
		INSERT INTO gamesUsers (userId, gameId, score, winner, type) \
		VALUES (?, ?, ?, ?, ?) \
		');

	stmt.run(userId, gameId, score.score, win, type);
};
	
export const createUserGameStatsTetris = (userId: number, gameId: number, score: number, winner: boolean, type:string, gameTetrisId: number,tetrisStat: {[key: string]: any} ): void =>
{
	const win = (winner === true ? 1 : 0);
	let stmt = db.prepare('\
		INSERT INTO gamesUsers (userId, gameId, score, winner, type, gameTetrisId) \
		VALUES (?, ?, ?, ?, ?, ?) \
		');

	stmt.run(userId, gameId, score, win, type, gameTetrisId);



	try {
		Object.entries(tetrisStat).forEach(([key, value]) => {
			if (key === "isInRoom")
				return; // Skip isInRoom as it is not a valid column in the database
			let stmt = db.prepare(` \
				UPDATE gamesUsers \
				SET ${key} = ? \
				WHERE userId = ? AND gameId = ?\
				`);
			stmt.run(value, userId, gameId);
		})
	}
	catch (e) {
		console.error("Error updating Tetris stats:", e);
	}
};


export const getUserStatsGame = (userId: number, type: string, winner: boolean): number => 
{
	const win = (winner === true ? 1 : 0);
	const stmt = db.prepare(` \
		SELECT * \
		FROM user u \
		JOIN gamesUsers gu ON gu.userId = u.id \
		WHERE ((u.id = ? AND type = ?) AND winner = ?) \
		`);

	const rows = stmt.all(userId, type, win);

	return rows.length;
};

export const getUserGameHistory = (userId: number): number[] => 
{
	const stmt = db.prepare(`
		SELECT gameId
		FROM user u
		JOIN gamesUsers gu ON gu.userId = u.id
		WHERE u.id = ?
		`);

	const rows = stmt.all(userId) as GameIdRow[];

	return rows.map(row => row.gameId);
};

export const getGameDetailsById = (gameId: number): GameUserInfo[] =>
{
	const stmt = db.prepare(`
		SELECT userId, score, winner, type, level, gameTime, totalTime, maxCombo, piecesPlaced, piecesPerSecond, attacksSent, attacksSentPerMinute, attacksReceived, attacksReceivedPerMinute, keysPressed, keysPerPiece, keysPerSecond, holds, linesCleared, linesPerMinute, maxB2b, perfectClears, single, double, triple, quad, tspinZero, tspinSingle, tspinDouble, tspinTriple, tspinQuad, miniTspinZero, miniTspinSingle, miniSpinZero, miniSpinSingle, miniSpinDouble, miniSpinTriple, miniSpinQuad
		FROM gamesUsers
		WHERE gameId = ?
	`);

	const rows = stmt.all(gameId) as GameUserInfo[];

	return rows;
};
