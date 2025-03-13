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
    const { username, password, avatar } = user;
    const stmt = db.prepare('\
        INSERT INTO user (username, password, avatar) \
        VALUES (?, ?, ?)\
        ');
    stmt.run(username, password, avatar);
};

export const logUser = (user : Users): void => {
    const {username} = user;
    const stmt = db.prepare('\
        UPDATE user \
        SET connected = 1 \
        WHERE username = ?\
        ');
    stmt.run(username);
}

export const loUser = (user : Users): void => {
    const {username} = user;
    const stmt = db.prepare('\
        UPDATE user \
        SET connected = 0 \
        WHERE username = ?\
        ');
    stmt.run(username);
}

export const getUserByUsername = (username: string): Users | undefined => {
    const stmt = db.prepare('\
        SELECT * \
        FROM user \
        WHERE username = ?\
        ');
    return stmt.get(username) as Users | undefined;
};

export const getUserById = (id: number): Users | undefined => {
    const stmt = db.prepare('\
        SELECT * \
        FROM user \
        WHERE id = ?\
        ');
    return stmt.get(id) as Users | undefined;
};
