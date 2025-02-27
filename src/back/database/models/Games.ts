import db from '../db';
import { createUserStats } from './UserStats'

interface Games {
    id?:           number;
    player1:       number;
    player2:       number;
    scoreP1:       number;
    scoreP2:       number;
    winner:        number;
    loser:         number;
    created_at?:   string;
}

export const createRoom = (room: Games): void => {
    const { player1, player2 } = room;
    const stmt = db.prepare('INSERT INTO games (player1_id, player2_id, loser_id, winner_id, score_p1, score_p2) VALUES (?, ?, ?, ?, ?, ?)');
    stmt.run(player1, player2, 0, 0, 0, 0);
};

// export const getUserByUsername = (username: string): Users | undefined => {
//     const stmt = db.prepare('SELECT * FROM users WHERE username = ?');
//     return stmt.get(username) as Users | undefined;
// };
//
// export const getUserById = (id: number): Users | undefined => {
//     const stmt = db.prepare('SELECT * FROM users WHERE id = ?');
//     return stmt.get(id) as Users | undefined;
// };