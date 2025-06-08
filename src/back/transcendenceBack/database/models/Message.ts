import db from '../db';

interface Message 
{
	id?:			number;
	senderId:	 	number;
	recipientId:	number;
	content:		string;
	date:			string;
}

export const saveMessage = (message: Message): void => 
{
	const { senderId, recipientId, content } = message;

	let stmt = db.prepare('\
		INSERT INTO message (senderId, recipientId, content) \
		VALUES (?, ?, ?)');

	stmt.run(senderId, recipientId, content);
};

export const getMessageById = (id: number, id2: number): Message[] | undefined => 
{
	const stmt = db.prepare('\
		SELECT * \
		FROM message m \
		WHERE (m.senderId = ? AND m.recipientId = ?) \
		OR (m.senderId = ? AND m.recipientId = ?) \
		ORDER BY m.date ASC');

	return stmt.all(id, id2, id2, id) as Message[] | undefined;
};
