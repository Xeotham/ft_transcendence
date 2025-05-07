import db from '../db';

interface Contact
{
    user1Id:			number;
    user2Id:			number;
    friendU1:			boolean;
    friendU2:			boolean;
    blockU1:			boolean;
    blockU2:			boolean;
}

interface FriendIdRow
{
    friendId: number;
}

export const createContact = (contact: Contact): void =>
{
    const { user1Id, user2Id, friendU1, friendU2, blockU1, blockU2 } = contact;
    const stmt = db.prepare('\
        INSERT INTO contact (user1Id, user2Id, friendU1, friendU2, blockU1, blockU2) \
        VALUES (?, ?, ?, ?, ?, ?)');
    stmt.run(user1Id, user2Id, friendU1, friendU2, blockU1, blockU2);
};

export const modifyContact = (user1Id:number, user2Id:number, friendU1:boolean, friendU2:boolean, blockU1:boolean, blockU2:boolean): void =>
{
    const f1 = friendU1 ? 1 : 0;
    const f2 = friendU2 ? 1 : 0;
    const b1 = blockU1 ? 1 : 0;
    const b2 = blockU2 ? 1 : 0;

    const stmt = db.prepare('\
        UPDATE contact \
        SET friendU1 = ?, friendU2 = ?, blockU1 = ?, blockU2 = ?\
        WHERE (user1Id = ? AND user2Id = ?)\
        ');
    stmt.run(f1, f2, b1, b2, user1Id, user2Id);
};


export const getUserContactById = (id: number): number[] =>
{
	const stmt1 = db.prepare('\
        SELECT c.user2Id as friendId\
        FROM user u \
        JOIN contact c \
        ON c.user1Id = u.id \
        WHERE ((u.id = ? AND friendU1 = 1) AND friendU2 = 1) \
        ');
	const rows1 = stmt1.all(id) as FriendIdRow[];

    const stmt2 = db.prepare('\
        SELECT c.user1Id as friendId\
        FROM user u \
        JOIN contact c \
        ON c.user2Id = u.id \
        WHERE ((u.id = ? AND friendU1 = 1) AND friendU2 = 1)\
        ');
    const rows2 = stmt2.all(id) as FriendIdRow[];

    const contactIds = [
        ...rows1.map(row => row.friendId),
        ...rows2.map(row => row.friendId)
    ];

    return contactIds;
};

export const checkFriendshipStatus = (user1Id: number, user2Id: number): number =>
{
    let stmt = db.prepare('\
        SELECT c.user1Id, c.user2Id \
        FROM contact c \
        WHERE (((c.user1Id = ? AND c.user2Id = ?) AND friendU1 = 1) AND friendU2 = 0) OR (((c.user1Id = ? AND c.user2Id = ?) AND friendU1 = 0) AND friendU2 = 1)\
        ');
    if (stmt.get(user1Id, user2Id, user2Id, user1Id))
        return 1;
    stmt = db.prepare('\
        SELECT c.user1Id, c.user2Id \
        FROM contact c \
        WHERE (((c.user1Id = ? AND c.user2Id = ?) AND friendU1 = 1) AND friendU2 = 0) OR (((c.user1Id = ? AND c.user2Id = ?) AND friendU1 = 0) AND friendU2 = 1)\
        ');
    if (stmt.get(user2Id, user1Id, user1Id, user2Id))
        return 2;
    stmt = db.prepare('\
        SELECT c.user1Id, c.user2Id \
        FROM contact c \
        WHERE (((c.user1Id = ? AND c.user2Id = ?) AND friendU1 = 1) AND friendU2 = 1) OR (((c.user1Id = ? AND c.user2Id = ?) AND friendU1 = 1) AND friendU2 = 1)\
        ');
    if (stmt.get(user2Id, user1Id, user1Id, user2Id))
        return 3;
    stmt = db.prepare('\
        SELECT c.user1Id, c.user2Id \
        FROM contact c \
        WHERE (((c.user1Id = ? AND c.user2Id = ?) AND friendU1 = 0) AND friendU2 = 0) OR (((c.user1Id = ? AND c.user2Id = ?) AND friendU1 = 0) AND friendU2 = 0)\
        ');
    if (stmt.get(user2Id, user1Id, user1Id, user2Id))
        return 4;
    return 0;
};

export const checkBlockStatus = (user1Id: number, user2Id: number): number =>
{
    let stmt = db.prepare('\
        SELECT c.user1Id, c.user2Id \
        FROM contact c \
        WHERE (((c.user1Id = ? AND c.user2Id = ?) AND blockU1 = 1) AND blockU2 = 0) OR (((c.user1Id = ? AND c.user2Id = ?) AND blockU1 = 0) AND blockU2 = 1)\
        ');
    if (stmt.get(user1Id, user2Id, user2Id, user1Id))
        return 1;
    stmt = db.prepare('\
        SELECT c.user1Id, c.user2Id \
        FROM contact c \
        WHERE (((c.user1Id = ? AND c.user2Id = ?) AND blockU1 = 0) AND blockU2 = 1) OR (((c.user1Id = ? AND c.user2Id = ?) AND blockU1 = 1) AND blockU2 = 0)\
        ');
    if (stmt.get(user1Id, user2Id, user2Id, user1Id))
        return 2;
    stmt = db.prepare('\
        SELECT c.user1Id, c.user2Id \
        FROM contact c \
        WHERE (((c.user1Id = ? AND c.user2Id = ?) AND blockU1 = 1) AND blockU2 = 1) OR (((c.user1Id = ? AND c.user2Id = ?) AND blockU1 = 1) AND blockU2 = 1)\
        ');
    if (stmt.get(user1Id, user2Id, user2Id, user1Id))
        return 3;
    return 0;
};

export const checkPosContact = (user1Id: number, user2Id: number): number =>
{
    let stmt = db.prepare('\
        SELECT c.user1Id, c.user2Id \
        FROM contact c \
        WHERE (c.user1Id = ? AND c.user2Id = ?) \
        ');
    if (stmt.get(user1Id, user2Id))
        return 1;
    stmt = db.prepare('\
        SELECT c.user1Id, c.user2Id \
        FROM contact c \
        WHERE (c.user1Id = ? AND c.user2Id = ?) \
        ');
    if (stmt.get(user2Id, user1Id))
        return 2;
    return 0;
};
