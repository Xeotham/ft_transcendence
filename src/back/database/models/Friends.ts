const db = require('../db');
const { createUserStats } = require('./UserStats');

interface Friends {
    id?:          number;
    user_1:       number;
    user_2:       number;
}

export const createFriends = (friends: Friends): void => {
    const { user_1, user_2 } = friends;
    const stmt = db.prepare('INSERT INTO friends (user_1, user_2) VALUES (?, ?)');
    stmt.run(user_1, user_2);
};
