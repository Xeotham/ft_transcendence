import db from '../db';

interface User 
{
    id?:             number;
    username:       string;
    password:       string;
    avatar:         string;
    connected:      boolean;
    created_at?:    string;
}

export const createUser = (username:string, password:string, avatar:string): number => 
{
    let stmt = db.prepare('\
        INSERT INTO user (username, password, avatar) \
        VALUES (?, ?, ?)\
        ');

    const result = stmt.run(username, password, avatar);

    return result.lastInsertRowid as number;
};

export const updateUserById = (id: number, type: string, update: string): void => 
{
    const array = ["username", "password", "avatar"];
	let i = 0;
	let stmt;

	while (array[i])
	{
		if (array[i] == type)
			break;
		i++;
	}
	switch (i)
	{
		case 0:
			stmt = db.prepare('\
				UPDATE USER \
				SET username = ? \
				WHERE id = ?\
				');
			stmt.run(update, id);
			break;
		case 1:
			stmt = db.prepare('\
				UPDATE USER \
				SET password = ? \
				WHERE id = ?\
				');
			stmt.run(update, id);
			break;
		case 2:
			stmt = db.prepare('\
				UPDATE USER \
				SET  avatar = ? \
				WHERE id = ?\
				');
			stmt.run(update, id);
			break;
    }
};

export const logUserById = (id : number): void => 
{
    const stmt = db.prepare('\
        UPDATE user \
        SET connected = 1 \
        WHERE id = ?\
        ');

    stmt.run(id);
};

export const logOutUserById = (id : number): void => 
{
    const stmt = db.prepare('\
        UPDATE user \
        SET connected = 0 \
        WHERE id = ?\
        ');

    stmt.run(id);
};

export const getUserByUsername = (username: string): User | undefined => 
{
    const stmt = db.prepare('\
        SELECT * \
        FROM user \
        WHERE username = ?\
        ');

    return stmt.get(username) as User | undefined;
};

export const getUserById = (id: number): User | undefined => 
{
    const stmt = db.prepare('\
        SELECT * \
        FROM user \
        WHERE id = ?\
        ');

    return stmt.get(id) as User | undefined;
};
