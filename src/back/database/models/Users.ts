import db from '../db';

// TODO: Creates a create user, getUserByUsername, getUserById

interface User {
    id?:            number;
    username:       string;
    password:       string;
    avatar:         string;
    connected:      boolean;
    created_at?:    string;
}

export const createUser = (user: User): number => {
    const { username, password, avatar } = user;
    let stmt = db.prepare('\
        INSERT INTO user (username, password, avatar) \
        VALUES (?, ?, ?)\
        ');
    stmt.run(username, password, avatar);
    return 1;
};

export const updateUserById = (user: User): void => {
    const { id, username, password, avatar } = user;
    const stmt = db.prepare('\
        UPDATE user \
        SET username = ?, password = ?, avatar = ?\
        WHERE id = ?\
        ');
    stmt.run(username, password, avatar, id);
};

export const logUserById = (user : User): void => {
    const {id} = user;
    const stmt = db.prepare('\
        UPDATE user \
        SET connected = 1 \
        WHERE id = ?\
        ');
    stmt.run(id);
};

export const logOutUserById = (user : User): void => {
    const {id} = user;
    const stmt = db.prepare('\
        UPDATE user \
        SET connected = 0 \
        WHERE id = ?\
        ');
    stmt.run(id);
};

export const getUserByUsername = (username: string): User | undefined => {
    const stmt = db.prepare('\
        SELECT * \
        FROM user \
        WHERE username = ?\
        ');
    return stmt.get(username) as User | undefined;
};

export const getUserById = (id: number): User | undefined => {
    const stmt = db.prepare('\
        SELECT * \
        FROM user \
        WHERE id = ?\
        ');
    return stmt.get(id) as User | undefined;
};
