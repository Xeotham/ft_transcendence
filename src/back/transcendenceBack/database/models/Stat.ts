import db from '../db';
import { getUserStatsGame } from './GamesUsers';


interface Stat
{
	id?:			number;
	userId:			number;
	pongWin:		number;
	pongLose:		number;
	tetrisWin:		number;
	tetrisLose:		number;
}

export const createStats = (id: number): void =>
{
	const stmt = db.prepare('\
		INSERT INTO stat (userId) \
		VALUES (?) \
		');

	stmt.run(id);
};

export const getStatsById = (id: number): Stat | undefined =>
{
	const stmt = db.prepare('\
		SELECT u.username, s.pongWin, s.pongLose, s.tetrisWin, s.tetrisLose \
		FROM user u \
		JOIN stat s  ON s.userId = u.id \
		WHERE u.id = ? \
		');

	return stmt.get(id) as Stat | undefined;
};

export const updateStats = (userId: number): void =>
{
	
	const pongWin = getUserStatsGame(userId, "pong", true);
	const pongLose = getUserStatsGame(userId, "pong", false);
	const tetrisWin = getUserStatsGame(userId, "tetris", true);
	const tetrisLose = getUserStatsGame(userId, "tetris", false);

	const stmt = db.prepare('\
        UPDATE stat \
        SET pongWin = ?, pongLose = ?, tetrisWin = ?, tetrisLose = ?\
        WHERE userId = ?\
        ');

	stmt.run(pongWin, pongLose, tetrisWin, tetrisLose, userId);
};
