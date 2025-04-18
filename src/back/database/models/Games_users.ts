import db from '../db'

interface Games_users 
{
    user_id:    number,
    game_id:    number,
    score:      number,
    winner:     boolean,
    type:       string
}

interface GameUserInfo 
{
	user_id: number;
	score: number;
	winner: boolean;
	type: string;
}

interface GameIdRow 
{
	game_id: number;
}

export const createUserGameStats = (user_id: number, game_id: number, score: number, winner: boolean, type:string): void => 
{
	const win = (winner === true ? 1 : 0);
	const stmt = db.prepare('\
		INSERT INTO games_users (user_id, game_id, score, winner, type) \
		VALUES (?, ?, ?, ?, ?) \
		');

	stmt.run(user_id, game_id, score, win, type);
};

export const getUserStatsGame = (user_id: number, type: string, winner: boolean): number => 
{
	const win = (winner === true ? 1 : 0);
	const stmt = db.prepare(` \
		SELECT * \
		FROM user u \
		JOIN games_users gu ON gu.user_id = u.id \
		WHERE ((u.id = ? AND type = ?) AND winner = ?) \
		`);

	const rows = stmt.all(user_id, type, win);

	return rows.length;
};

export const getUserGameHistory = (user_id: number): number[] => 
{
	const stmt = db.prepare(`
		SELECT game_id
		FROM user u
		JOIN games_users gu ON gu.user_id = u.id
		WHERE u.id = ?
		`);

	const rows = stmt.all(user_id) as GameIdRow[];

	return rows.map(row => row.game_id);
};

export const getGameDetailsById = (game_id: number): GameUserInfo[] => 
{
	const stmt = db.prepare(`
		SELECT user_id, score, winner, type
		FROM games_users
		WHERE game_id = ?
	`);

	const rows = stmt.all(game_id) as GameUserInfo[];

	return rows;
};
