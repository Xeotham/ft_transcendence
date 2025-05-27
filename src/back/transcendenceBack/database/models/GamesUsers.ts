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
	username ?: string;
	userId: number;
	score: 	number;
	winner: boolean;
	type: 	string;
}

interface GameIdRow 
{
	gameId: number;
}

export const createUserGameStatsPong = (userId: number, gameId: number, score: number, winner: boolean, type:string): void => 
{
	const win = (winner === true ? 1 : 0);
	const stmt = db.prepare('\
		INSERT INTO gamesUsers (userId, gameId, score, winner, type) \
		VALUES (?, ?, ?, ?, ?) \
		');

	stmt.run(userId, gameId, score, win, type);
};
	
export const createUserGameStatsTetris = (userId: number, gameId: number, score: number, winner: boolean, type:string, gameTetrisId: number,tetrisStat:any ): void =>
{
	const win = (winner === true ? 1 : 0);
	let stmt = db.prepare('\
		INSERT INTO gamesUsers (userId, gameId, score, winner, type, gameTetrisId) \
		VALUES (?, ?, ?, ?, ?, ?) \
		');

	stmt.run(userId, gameId, score, win, type, gameTetrisId);

	console.log("Tetris stats: ", tetrisStat);
	Object.keys(tetrisStat as object).forEach((key) => {
		console.log(key);
		console.log(tetrisStat[key]);
		let stmt = db.prepare(` \
			UPDATE gamesUsers \
			SET ${key} = ? \
			WHERE userId = ? AND gameId = ?\
			`);
		stmt.run(tetrisStat[key], userId, gameId);
	});
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
		SELECT userId, score, winner, type, gameTime, maxCombo, piecesPlaced, piecesPerSecond, attacksSent, attacksSentPerMinute, attacksReceived, attacksReceivedPerMinute, keysPressed, keysPerPiece, keysPerSecond, holds, linesCleared, linesPerMinute, maxB2b, perfectClears, single, double, triple, quad, tspinZero, tspinSingle, tspinDouble, tspinTriple, tspinQuad, miniTspinZero, miniTspinSingle, miniSpinZero, miniSpinSingle, miniSpinDouble, miniSpinTriple, miniSpinQuad
		FROM gamesUsers
		WHERE gameId = ?
	`);

	const rows = stmt.all(gameId) as GameUserInfo[];

	return rows;
};
