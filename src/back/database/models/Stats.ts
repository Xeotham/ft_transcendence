import db from '../db';

interface Stats {
	id?:			number;
	pong_win:		number,
	pong_lose:		number,
	tetris_win:		number,
	tetris_lose:	number,
}

export const createUserStats = (user: Stats): void => {
	const stmt = db.prepare('INSERT INTO user_stats (pong_win, pong_lose, tetris_win, tetris_lose) VALUES (?, ?, ?, ?)');
	stmt.run(0, 0, 0, 0);
};

export const getUserStatsById = (id: number): Stats | undefined => {
	const stmt = db.prepare('SELECT * FROM user u JOIN stats_users su ON su.user_id = u.id JOIN stat s ON su.stat_id = s._id WHERE user_id = ?');
	return stmt.get(id) as Stats | undefined;
};
