import db from '../db';

interface Message 
{
    id?:            number;
    sender_id:      number;
    recipient_id:   number;
    content:        string;
    date:           string;
}

export const saveMessage = (message: Message): void => 
{
    const { sender_id, recipient_id, content } = message;

    let stmt = db.prepare('\
        INSERT INTO message (sender_id, recipient_id, content) \
        VALUES (?, ?, ?)');

    stmt.run(sender_id, recipient_id, content);
};

export const getMessageById = (id: number, id2: number): Message[] | undefined => 
{
	const stmt = db.prepare('\
        SELECT * \
        FROM message m \
        WHERE (m.sender_id = ? AND m.recipient_id = ?) \
        OR (m.sender_id = ? AND m.recipient_id = ?) \
        ORDER BY m.date ASC');

	return stmt.all(id, id2, id2, id) as Message[] | undefined;
};