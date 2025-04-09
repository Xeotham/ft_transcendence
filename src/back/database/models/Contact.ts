import db from '../db';

interface Contact {
    user1_id:			number;
    user2_id:			number;
    friend_u1:			number;
    friend_u2:			number;
    block_u1:			number;
    block_u2:			number;
}

export const createContact = (contact: Contact): void => {
    const { user1_id, user2_id, friend_u1, friend_u2, block_u1, block_u2 } = contact;
    const stmt = db.prepare('\
        INSERT INTO contact (user1_id, user2_id, friend_u1, friend_u2, block_u1, block_u2) \
        VALUES (?, ?, ?, ?, ?, ?)');
    stmt.run(user1_id, user2_id, friend_u1, friend_u2, block_u1, block_u2);
};

export const modifyContact = (contact: Contact): void => {
    const { user1_id, user2_id, friend_u1, friend_u2, block_u1, block_u2 } = contact;
    const stmt = db.prepare('\
        UPDATE contact \
        SET friend_u1 = ?, friend_u2 = ?, block_u1, block_u2 = ?\
        WHERE (user1_id = ? AND user2_id = ?) OR (user1_id = ? AND user2_id = ?)');
    stmt.run(friend_u1, friend_u2, block_u1, block_u2, user1_id, user2_id, user2_id, user1_id);
};


export const getUserContactById = (id: number): Contact[] | undefined => {
	const stmt = db.prepare('\
        SELECT u.username, c.user2_id, c.user1_id \
        FROM user u \
        JOIN contact c \
        ON ( c.user1_id = u.id OR c.user2_id = u.id )\
        WHERE u.id = ?\
        ');
	return stmt.all(id) as Contact[] | undefined;
};

export const checkFriendshipStatus = (user1_id: number, user2_id: number): number => {
    let stmt = db.prepare('\
        SELECT c.user1_id, c.user2_id \
        FROM contact c \
        WHERE (((c.user1_id = ? AND c.user2_id = ?) AND friend_u1 = 1) AND friend_u2 = 0) OR (((c.user1_id = ? AND c.user2_id = ?) AND friend_u1 = 0) AND friend_u2 = 1)\
        ');
    if (stmt.all(user1_id, user2_id, user2_id, user1_id))
        return 1;
    stmt = db.prepare('\
        SELECT c.user1_id, c.user2_id \
        FROM contact c \
        WHERE (((c.user1_id = ? AND c.user2_id = ?) AND friend_u1 = 1) AND friend_u2 = 0) OR (((c.user1_id = ? AND c.user2_id = ?) AND friend_u1 = 0) AND friend_u2 = 1)\
        ');
    if (stmt.all(user2_id, user1_id, user1_id, user2_id))
        return 2;
    stmt = db.prepare('\
        SELECT c.user1_id, c.user2_id \
        FROM contact c \
        WHERE (((c.user1_id = ? AND c.user2_id = ?) AND friend_u1 = 1) AND friend_u2 = 1) OR (((c.user1_id = ? AND c.user2_id = ?) AND friend_u1 = 1) AND friend_u2 = 1)\
        ');
    if (stmt.all(user2_id, user1_id, user1_id, user2_id))
        return 3;
    stmt = db.prepare('\
        SELECT c.user1_id, c.user2_id \
        FROM contact c \
        WHERE (((c.user1_id = ? AND c.user2_id = ?) AND friend_u1 = 0) AND friend_u2 = 0) OR (((c.user1_id = ? AND c.user2_id = ?) AND friend_u1 = 0) AND friend_u2 = 0)\
        ');
    if (stmt.all(user2_id, user1_id, user1_id, user2_id))
        return 4;
    return 0;
};

export const checkBlockStatus = (user1_id: number, user2_id: number): number => {
    let stmt = db.prepare('\
        SELECT c.user1_id, c.user2_id \
        FROM contact c \
        WHERE (((c.user1_id = ? AND c.user2_id = ?) AND block_u1 = 1) AND block_u2 = 0) OR (((c.user1_id = ? AND c.user2_id = ?) AND block_u1 = 0) AND block_u2 = 1)\
        ');
    if (stmt.all(user1_id, user2_id, user2_id, user1_id))
        return 1;
    stmt = db.prepare('\
        SELECT c.user1_id, c.user2_id \
        FROM contact c \
        WHERE (((c.user1_id = ? AND c.user2_id = ?) AND block_u1 = 0) AND block_u2 = 1) OR (((c.user1_id = ? AND c.user2_id = ?) AND block_u1 = 1) AND block_u2 = 0)\
        ');
    if (stmt.all(user1_id, user2_id, user2_id, user1_id))
        return 2;
    stmt = db.prepare('\
        SELECT c.user1_id, c.user2_id \
        FROM contact c \
        WHERE (((c.user1_id = ? AND c.user2_id = ?) AND block_u1 = 1) AND block_u2 = 1) OR (((c.user1_id = ? AND c.user2_id = ?) AND block_u1 = 1) AND block_u2 = 1)\
        ');
    if (stmt.all(user1_id, user2_id, user2_id, user1_id))
        return 3;
    return 0;
};

export const checkPosContact = (user1_id: number, user2_id: number): number => {
    let stmt = db.prepare('\
        SELECT c.user1_id, c.user2_id \
        FROM contact c \
        WHERE (c.user1_id = ? AND c.user2_id = ?) \
        ');
    if (stmt.all(user1_id, user2_id))
        return 1;
    stmt = db.prepare('\
        SELECT c.user1_id, c.user2_id \
        FROM contact c \
        WHERE (c.user1_id = ? AND c.user2_id = ?) \
        ');
    if (stmt.all(user2_id, user1_id))
        return 2;
    return 0;
};
