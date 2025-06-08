import db from '../db';
// @ts-ignore
import bcrypt from 'bcrypt';

interface User
{
	id?:			number;
	username:	   string;
	password:	   string;
	avatar:		 string;
	connected:	  boolean;
	createdAt?:	 string;
}

export const createUser = async (username: string, password: string, avatar: string) => {
	let stmt = db.prepare('\
		INSERT INTO user (username, password, avatar) \
		VALUES (?, ?, ?)\
		');

	const result = stmt.run(username, password, avatar);

	return result.lastInsertRowid;
};

export const updateUserById = (id: number, type: string, update: string): void =>
{
	try {
		const array = ["username", "password", "avatar"];
		let i = 0;
		let stmt;

		while (array[i]) {
			if (array[i] == type)
				break;
			i++;
		}

		switch (i) {
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
	}
	catch (error){
		console.error('Error updating user:', error);
		throw new Error('Failed to update user');
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

export const getUsernameById = (id: number): string =>
{
	const stmt = db.prepare('\
		SELECT username \
		FROM user \
		WHERE id = ?\
		');

		return (stmt.get(id) as { username: string }).username as string;
};


export const hashPassword = async (password:string, saltRounds = 10): Promise<string | null> =>
{
	if (!password)
		return null;

	try
	{
		return await bcrypt.hash(password, saltRounds);
	}
	catch (err)
	{
		throw new Error('Error hashing password');
	}
};
