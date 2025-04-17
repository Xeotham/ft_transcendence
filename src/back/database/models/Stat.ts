import db from '../db';
import {createUserGameStats, getUserStatsGame} from '../../database/models/Games_users';


interface Stat 
{
	id?:			number;
	user_id:		number;
	pong_win:		number;
	pong_lose:		number;
	tetris_win:		number;
	tetris_lose:	number;
}

export const createStats = (id: number): void => 
{
	const stmt = db.prepare('\
		INSERT INTO stat (user_id) \
		VALUES (?) \
		');

	stmt.run(id);
};

export const getStatsById = (id: number): Stat | undefined => 
{
	const stmt = db.prepare('\
		SELECT * \
		FROM user u \
		JOIN stat s  ON s.user_id = u.id \
		WHERE u.id = ? \
		');

	return stmt.get(id) as Stat | undefined;
};

export const updateStats = (user_id: number): void => 
{
	
	const pong_win = getUserStatsGame(user_id, "pong", true);
	const pong_lose = getUserStatsGame(user_id, "pong", false);
	const tetris_win = getUserStatsGame(user_id, "tetris", true);
	const tetris_lose = getUserStatsGame(user_id, "tetris", false);

	const stmt = db.prepare('\
        UPDATE stat \
        SET pong_win = ?, pong_lose = ?, tetris_win = ?, tetris_lose\
        WHERE user_id = ?\
        ');

	stmt.run(pong_win, pong_lose, tetris_win, tetris_win);
};
