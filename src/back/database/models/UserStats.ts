import db from '../db';

interface UserStats {
	id?:			number;
	user_id:		string;
	pong_win:		number,
	pong_lose:		number,
	tetris_win:		number,
	tetris_lose:	number,
}

export const createUserStats = (user: UserStats): void => {
	const { user_id } = user;
	const stmt = db.prepare('INSERT INTO user_stats (user_id, pong_win, pong_lose, tetris_win, tetris_lose) VALUES (?, ?, ?, ?, ?)');
	stmt.run(user_id, 0, 0, 0, 0);
};

export const getUserStatsById = (id: number): UserStats | undefined => {
	const stmt = db.prepare('SELECT * FROM user_stats WHERE user_id = ?');
	return stmt.get(id) as UserStats | undefined;
};
