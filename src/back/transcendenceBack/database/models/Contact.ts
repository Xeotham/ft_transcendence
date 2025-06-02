import db from '../db';

interface Contact
{
    user1Id:			number;
    user2Id:			number;
}

interface FriendIdRow
{
    friendId: number;
}

export const createContact = (user1Id:number, user2Id:number): void =>
{
    const stmt = db.prepare('\
        INSERT INTO contact (user1Id, user2Id) \
        VALUES (?, ?)');
    stmt.run(user1Id, user2Id);
};

export const deleteContact = (user1Id:number, user2Id:number): void =>
{
    const stmt = db.prepare('\
        DELETE FROM contact \
        WHERE (user1Id = ? AND user2Id = ?)\
        ');
    stmt.run(user1Id, user2Id);
};


export const getUserContactById = (id: number): FriendIdRow[] =>
{
	const stmt1 = db.prepare('\
        SELECT c.user2Id as friendId\
        FROM user u \
        JOIN contact c \
        ON c.user1Id = u.id \
        WHERE (u.id = ?)  \
        ');
	const rows1 = stmt1.all(id) as FriendIdRow[];


    return rows1;
};

// export const checkFriendshipStatus = (user1Id: number, user2Id: number): number =>
// {
//     let stmt = db.prepare('\
//         SELECT c.user1Id, c.user2Id \
//         FROM contact c \
//         WHERE (((c.user1Id = ? AND c.user2Id = ?) AND friendU1 = 1) AND friendU2 = 0) OR (((c.user1Id = ? AND c.user2Id = ?) AND friendU1 = 0) AND friendU2 = 1)\
//         ');
//     if (stmt.get(user1Id, user2Id, user2Id, user1Id))
//         return 1;
//     stmt = db.prepare('\
//         SELECT c.user1Id, c.user2Id \
//         FROM contact c \
//         WHERE (((c.user1Id = ? AND c.user2Id = ?) AND friendU1 = 1) AND friendU2 = 0) OR (((c.user1Id = ? AND c.user2Id = ?) AND friendU1 = 0) AND friendU2 = 1)\
//         ');
//     if (stmt.get(user2Id, user1Id, user1Id, user2Id))
//         return 2;
//     stmt = db.prepare('\
//         SELECT c.user1Id, c.user2Id \
//         FROM contact c \
//         WHERE (((c.user1Id = ? AND c.user2Id = ?) AND friendU1 = 1) AND friendU2 = 1) OR (((c.user1Id = ? AND c.user2Id = ?) AND friendU1 = 1) AND friendU2 = 1)\
//         ');
//     if (stmt.get(user2Id, user1Id, user1Id, user2Id))
//         return 3;
//     stmt = db.prepare('\
//         SELECT c.user1Id, c.user2Id \
//         FROM contact c \
//         WHERE (((c.user1Id = ? AND c.user2Id = ?) AND friendU1 = 0) AND friendU2 = 0) OR (((c.user1Id = ? AND c.user2Id = ?) AND friendU1 = 0) AND friendU2 = 0)\
//         ');
//     if (stmt.get(user2Id, user1Id, user1Id, user2Id))
//         return 4;
//     return 0;
// };
//
// export const checkBlockStatus = (user1Id: number, user2Id: number): number =>
// {
//     let stmt = db.prepare('\
//         SELECT c.user1Id, c.user2Id \
//         FROM contact c \
//         WHERE (((c.user1Id = ? AND c.user2Id = ?) AND blockU1 = 1) AND blockU2 = 0) OR (((c.user1Id = ? AND c.user2Id = ?) AND blockU1 = 0) AND blockU2 = 1)\
//         ');
//     if (stmt.get(user1Id, user2Id, user2Id, user1Id))
//         return 1;
//     stmt = db.prepare('\
//         SELECT c.user1Id, c.user2Id \
//         FROM contact c \
//         WHERE (((c.user1Id = ? AND c.user2Id = ?) AND blockU1 = 0) AND blockU2 = 1) OR (((c.user1Id = ? AND c.user2Id = ?) AND blockU1 = 1) AND blockU2 = 0)\
//         ');
//     if (stmt.get(user1Id, user2Id, user2Id, user1Id))
//         return 2;
//     stmt = db.prepare('\
//         SELECT c.user1Id, c.user2Id \
//         FROM contact c \
//         WHERE (((c.user1Id = ? AND c.user2Id = ?) AND blockU1 = 1) AND blockU2 = 1) OR (((c.user1Id = ? AND c.user2Id = ?) AND blockU1 = 1) AND blockU2 = 1)\
//         ');
//     if (stmt.get(user1Id, user2Id, user2Id, user1Id))
//         return 3;
//     return 0;
// };
//
// export const checkPosContact = (user1Id: number, user2Id: number): number =>
// {
//     let stmt = db.prepare('\
//         SELECT c.user1Id, c.user2Id \
//         FROM contact c \
//         WHERE (c.user1Id = ? AND c.user2Id = ?) \
//         ');
//     if (stmt.get(user1Id, user2Id))
//         return 1;
//     stmt = db.prepare('\
//         SELECT c.user1Id, c.user2Id \
//         FROM contact c \
//         WHERE (c.user1Id = ? AND c.user2Id = ?) \
//         ');
//     if (stmt.get(user2Id, user1Id))
//         return 2;
//     return 0;
// };
