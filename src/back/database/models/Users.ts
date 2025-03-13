import db from '../db';

// TODO: Creates a create user, getUserByUsername, getUserById

interface Users {
    id?:            number;
    username:       string;
    password:       string;
    avatar:         string;
    connected:      boolean;
    created_at?:    string;
}


export const createUser = (user: Users): void => {
    const { username, password, avatar, connected } = user;
    const stmt = db.prepare('INSERT INTO users (username, password, avatar, connected) VALUES (?, ?, ?, ?)');
    stmt.run(username, password, avatar, connected);
};

export const getUserByUsername = (username: string): Users | undefined => {
    const stmt = db.prepare('SELECT * FROM users WHERE username = ?');
    return stmt.get(username) as Users | undefined;
};

export const getUserById = (id: number): Users | undefined => {
    const stmt = db.prepare('SELECT * FROM users WHERE id = ?');
    return stmt.get(id) as Users | undefined;
};
