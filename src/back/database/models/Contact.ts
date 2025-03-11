import db from '../db';

interface Contact
{
    user1_id:			number;
    user2_id:			number;
    friend_u1:			boolean;
    friend_u2:			boolean;
    block_u1:			boolean;
    block_u2:			boolean;
}

interface FriendIdRow
{
    friend_id: number;
}

export const createContact = (contact: Contact): void =>
{
    const { user1_id, user2_id, friend_u1, friend_u2, block_u1, block_u2 } = contact;
    const stmt = db.prepare('\
        INSERT INTO contact (user1_id, user2_id, friend_u1, friend_u2, block_u1, block_u2) \
        VALUES (?, ?, ?, ?, ?, ?)');
    stmt.run(user1_id, user2_id, friend_u1, friend_u2, block_u1, block_u2);
};

export const modifyContact = (user1_id:number, user2_id:number, friend_u1:boolean, friend_u2:boolean, block_u1:boolean, block_u2:boolean): void =>
{
    const f1 = friend_u1 ? 1 : 0;
    const f2 = friend_u2 ? 1 : 0;
    const b1 = block_u1 ? 1 : 0;
    const b2 = block_u2 ? 1 : 0;
    const stmt = db.prepare('\
        UPDATE contact \
        SET friend_u1 = ?, friend_u2 = ?, block_u1 = ?, block_u2 = ?\
        WHERE (user1_id = ? AND user2_id = ?)\
        ');
    stmt.run(f1, f2, b1, b2, user1_id, user2_id);
};


export const getUserContactById = (id: number): number[] =>
{
	const stmt1 = db.prepare('\
        SELECT c.user2_id as friend_id\
        FROM user u \
        JOIN contact c \
        ON c.user1_id = u.id \
        WHERE ((u.id = ? AND friend_u1 = 1) AND friend_u2 = 1) \
        ');
	const rows1 = stmt1.all(id) as FriendIdRow[];

    const stmt2 = db.prepare('\
        SELECT c.user1_id as friend_id\
        FROM user u \
        JOIN contact c \
        ON c.user2_id = u.id \
        WHERE ((u.id = ? AND friend_u1 = 1) AND friend_u2 = 1)\
        ');
    const rows2 = stmt2.all(id) as FriendIdRow[];

    const contactIds = [
        ...rows1.map(row => row.friend_id),
        ...rows2.map(row => row.friend_id)
    ];

    return contactIds;
};

export const checkFriendshipStatus = (user1_id: number, user2_id: number): number =>
{
    let stmt = db.prepare('\
        SELECT c.user1_id, c.user2_id \
        FROM contact c \
        WHERE (((c.user1_id = ? AND c.user2_id = ?) AND friend_u1 = 1) AND friend_u2 = 0) OR (((c.user1_id = ? AND c.user2_id = ?) AND friend_u1 = 0) AND friend_u2 = 1)\
        ');
    if (stmt.get(user1_id, user2_id, user2_id, user1_id))
        return 1;
    stmt = db.prepare('\
        SELECT c.user1_id, c.user2_id \
        FROM contact c \
        WHERE (((c.user1_id = ? AND c.user2_id = ?) AND friend_u1 = 1) AND friend_u2 = 0) OR (((c.user1_id = ? AND c.user2_id = ?) AND friend_u1 = 0) AND friend_u2 = 1)\
        ');
    if (stmt.get(user2_id, user1_id, user1_id, user2_id))
        return 2;
    stmt = db.prepare('\
        SELECT c.user1_id, c.user2_id \
        FROM contact c \
        WHERE (((c.user1_id = ? AND c.user2_id = ?) AND friend_u1 = 1) AND friend_u2 = 1) OR (((c.user1_id = ? AND c.user2_id = ?) AND friend_u1 = 1) AND friend_u2 = 1)\
        ');
    if (stmt.get(user2_id, user1_id, user1_id, user2_id))
        return 3;
    stmt = db.prepare('\
        SELECT c.user1_id, c.user2_id \
        FROM contact c \
        WHERE (((c.user1_id = ? AND c.user2_id = ?) AND friend_u1 = 0) AND friend_u2 = 0) OR (((c.user1_id = ? AND c.user2_id = ?) AND friend_u1 = 0) AND friend_u2 = 0)\
        ');
    if (stmt.get(user2_id, user1_id, user1_id, user2_id))
        return 4;
    return 0;
};

export const checkBlockStatus = (user1_id: number, user2_id: number): number =>
{
    let stmt = db.prepare('\
        SELECT c.user1_id, c.user2_id \
        FROM contact c \
        WHERE (((c.user1_id = ? AND c.user2_id = ?) AND block_u1 = 1) AND block_u2 = 0) OR (((c.user1_id = ? AND c.user2_id = ?) AND block_u1 = 0) AND block_u2 = 1)\
        ');
    if (stmt.get(user1_id, user2_id, user2_id, user1_id))
        return 1;
    stmt = db.prepare('\
        SELECT c.user1_id, c.user2_id \
        FROM contact c \
        WHERE (((c.user1_id = ? AND c.user2_id = ?) AND block_u1 = 0) AND block_u2 = 1) OR (((c.user1_id = ? AND c.user2_id = ?) AND block_u1 = 1) AND block_u2 = 0)\
        ');
    if (stmt.get(user1_id, user2_id, user2_id, user1_id))
        return 2;
    stmt = db.prepare('\
        SELECT c.user1_id, c.user2_id \
        FROM contact c \
        WHERE (((c.user1_id = ? AND c.user2_id = ?) AND block_u1 = 1) AND block_u2 = 1) OR (((c.user1_id = ? AND c.user2_id = ?) AND block_u1 = 1) AND block_u2 = 1)\
        ');
    if (stmt.get(user1_id, user2_id, user2_id, user1_id))
        return 3;
    return 0;
};

export const checkPosContact = (user1_id: number, user2_id: number): number =>
{
    let stmt = db.prepare('\
        SELECT c.user1_id, c.user2_id \
        FROM contact c \
        WHERE (c.user1_id = ? AND c.user2_id = ?) \
        ');
    if (stmt.get(user1_id, user2_id))
        return 1;
    stmt = db.prepare('\
        SELECT c.user1_id, c.user2_id \
        FROM contact c \
        WHERE (c.user1_id = ? AND c.user2_id = ?) \
        ');
    if (stmt.get(user2_id, user1_id))
        return 2;
    return 0;
};
