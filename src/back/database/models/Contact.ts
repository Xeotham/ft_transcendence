import db from '../db';

interface Contact {
    user1_id:			number;
    user2_id:			number;
    friend:				number;
    blocked:			number;
}

export const createContact = (contact: Contact): void => {
    const { user1_id, user2_id, friend, blocked } = contact;
    let stmt = db.prepare('\
        INSERT INTO contact (user1_id, user2_id, friend, blocked) \
        VALUES (?, ?, ?, ?)');
    stmt.run(user1_id, user2_id, friend, blocked);
    stmt = db.prepare('\
        INSERT INTO contact (user2_id, user1_id, friend, blocked) \
        VALUES (?, ?, ?, ?)');
    stmt.run(user2_id, user1_id, friend, blocked);
};

export const getUserContactById = (id: number): Contact[] | undefined => {
	const stmt = db.prepare('\
        SELECT u.username, c.user2_id \
        FROM user u \
        JOIN contact c \
        ON c.user1_id = u.id \
        WHERE u.id = ?');
	return stmt.all(id) as Contact[] | undefined;
};
