import db from '../db';

interface Game {
    id?:    number;
    date:   string;
}

/*export const createRoom = (room: Games): void => {
    const { player1, player2 } = room;
    const stmt = db.prepare('INSERT INTO games (player1_id, player2_id, loser_id, winner_id, score_p1, score_p2) VALUES (?, ?, ?, ?, ?, ?)');
    stmt.run(player1, player2, 0, 0, 0, 0);
};*/

export const createGame = (game: Game): void => {
    const { date } = game;
    const stmt = db.prepare('\
        INSERT INTO games (date) \
        VALUES (?)\
        ');
    stmt.run(date);
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