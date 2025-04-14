import db from '../db'

interface Games_users {
    user_id:    number,
    game_id:    number,
    score:      number,
    winner:     boolean,
    type:       string
}

export const createUserGameStats = (user_id: number, game_id: number, score: number, winner: boolean, type:string): void => {
	const stmt = db.prepare('\
		INSERT INTO games_users (user_id, game_id, score, winner, type) \
		VALUES (?, ?, ?, ?, ?) \
		');
	stmt.run(user_id, game_id, score, winner, type);
};

export const getUserStatsGame = (user_id: number, type: string, winner: boolean): number => {
	const stmt = db.prepare(` \
		SELECT * \
		FROM user u \
		JOIN games_users gu ON gu.user_id = u.id \
		WHERE ((u.id = ? AND type = ?) AND winner = ?) \
	`);
	const rows = stmt.all(user_id, type, winner);
	return rows.length;
};
