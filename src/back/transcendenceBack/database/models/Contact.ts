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
