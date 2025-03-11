import db from '../db';
import { createUserStats } from './Stats'

interface Contact {
    user1_id:			number;
    user2_id:			number;
    friend:				number;
    blocked:			number;
}

export const createContact = (contact: Contact): void => {
    const { user1_id, user2_id, friend, blocked } = contact;
    const stmt = db.prepare('INSERT INTO contact (user1_id, user2_id, friend, blocked) VALUES (?, ?, ?, ?)');
    stmt.run(user1_id, user2_id, friend, blocked);
};

/*export const getUserContactById = (id: number): Contact | undefined => {
	const stmt = db.prepare('SELECT * FROM user u JOIN contact c ON c.user1_id = u.id JOIN u ON c.user2_id = u.user_id WHERE user_id = ?');
	return stmt.get(id) as Contact | undefined;
};*/

export const getUserContactById = (id: number): Contact | undefined => {
	const stmt = db.prepare('SELECT * FROM user u JOIN contact c ON c.user1_id = u.id WHERE u.id = ?');
	return stmt.get(id) as Contact | undefined;
};
