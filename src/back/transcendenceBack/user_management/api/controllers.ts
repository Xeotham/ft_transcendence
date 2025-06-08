// Fastify request and response to create the controllers for the API
import { FastifyRequest, FastifyReply } from 'fastify';
// Interactions with the DataBase to create and get Users
import { createUser, updateUserById, getUserByUsername, getUserById, logUserById, logOutUserById, getUsernameById, hashPassword } from '../../database/models/Users';
import { createContact, deleteContact, getUserContactById } from '../../database/models/Contact';
import { createStats, getStatsById, updateStats } from '../../database/models/Stat' ;
import { createUserGameStatsPong, createUserGameStatsTetris, getUserStatsGame, getUserGameHistory, getGameDetailsById } from '../../database/models/GamesUsers';
import { getMessageById, saveMessage } from '../../database/models/Message';
import { saveGame, getGameById } from '../../database/models/Game';
import bcrypt from 'bcrypt';
import path from 'path';
import fs from 'fs';
import { player } from "../../pong_app/utils";
import jwt from 'jsonwebtoken';
import { TetrisGame } from "../../tetris_app/server/Game/TetrisGame";

interface Users {
	id?:            number;
	username:       string;
	password:       string;
	avatar:         string;
	connected:      boolean;
	createdAt?:    string;
}

const   authKey = process.env.AUTH_KEY;

export const   tokenBlacklist = new Set();

/*----------------------------------------------------------------------------*/
/* User */

const generateDefaultAvatar = () => {
	const filePath = path.join(__dirname, '../medias/defaultAvatar.png'); // Adjust the relative path
	const fileBuffer = fs.readFileSync(filePath, "base64"); // Read the file as a Buffer
	return fileBuffer;
};

export const    getAvatars = async (request: FastifyRequest, reply: FastifyReply) => {
	const avatars: string[] = [];

	for (let i = 1; i <= 24; ++i) {
		const filePath = path.join(__dirname, `../medias/avatar${i}.png`); // Adjust the relative path
		const fileBuffer = fs.readFileSync(filePath, "base64"); // Read the file as a Buffer
		avatars.push(fileBuffer); // Convert the Buffer to a Blob
	}
	reply.status(200).send({ avatars: avatars });
}

export const registerUser = async (request: FastifyRequest, reply: FastifyReply) =>
{
	const { username, password } = request.body as { username: string, password: string };

	const avatar = generateDefaultAvatar();

	if(!username || !password || !avatar)
		return reply.status(400).send({ message: 'Username, password and avatar can\'t be empty' });

	const existingUser = getUserByUsername(username);
	if (existingUser)
		return reply.status(400).send({ message: 'Username already exists' });
	try
	{
		const hashedPassword = await hashPassword(password);

		const id = await createUser( username, hashedPassword as string, avatar );

		createStats(Number(id));

		return reply.status(201).send({ message: 'User registered successfully', id });
	}
	catch (err)
	{
		return reply.status(400).send({ error: (err as Error).message });
	}
};

export const    updatePassword = async (request: FastifyRequest, reply: FastifyReply) => {
	try {
		const   { username, previousPassword, newPassword } = request.body as { username: string, previousPassword: string, newPassword: string };
		const   user = await getUserByUsername(username);

		if (!user || !(await bcrypt.compare(previousPassword, user.password)))
			return reply.status(401).send({ message: 'Invalid password' });
		const hashedPassword = await hashPassword(newPassword);

		updateUserById(user.id!, 'password', hashedPassword as string);
		return reply.status(201).send({message: 'Password Changed successfully'});
	}
	catch (e) {
		console.error('Error updating password', e);
		return reply.status(500).send({ message: 'Internal server error' });
	}
}

export const    updateUsername = async (request: FastifyRequest, reply: FastifyReply) => {
	try {
		const { username, newUsername } = request.body as { username: string, newUsername: string };

		const user = getUserByUsername(username);
		if (!user)
			return reply.status(400).send({message: 'User doesn\'t exist'});

		if (getUserByUsername(newUsername))
			return reply.status(400).send({message: 'Username already exists'});

		updateUserById(user.id!, 'username', newUsername);

		return reply.status(201).send({message: 'User updated successfully'});
	}
	catch (e) {
		console.error('Error updating username', e);
		return reply.status(500).send({ message: 'Internal server error' });
	}
}

export const    updateAvatar = async (request: FastifyRequest, reply: FastifyReply) => {
	try {
		const { username, avatar } = request.body as { username: string, avatar: string };

		const user = getUserByUsername(username);
		if (!user)
			return reply.status(400).send({message: 'User doesn\'t exist'});

		if (!avatar)
			return reply.status(400).send({message: 'Avatar can\'t be empty'});

		updateUserById(user.id!, 'avatar', avatar);

		return reply.status(201).send({message: 'User updated successfully'});
	}
	catch (e) {
		console.error('Error updating avatar', e);
		return reply.status(500).send({ message: 'Internal server error' });
	}
}

export const loginUser = async (request: FastifyRequest, reply: FastifyReply) =>
{
	const { username, password } = request.body as { username: string, password: string };

	const user = getUserByUsername(username);


	if (!user || !(await bcrypt.compare(password, user.password)))
		return reply.status(401).send({ message: 'Invalid username or password' });

	// if (user?.connected)
	//     return reply.status(401).send({ message: 'User already connected' });

	const   payload = { username: user.username, id: user.id };
	const   authToken = jwt.sign(payload, authKey!, { expiresIn: '10h' });
	// const   newAvatar = new Blob([user.avatar], { type: 'image/png' });

	// console.log(newAvatar);

	logUserById(user.id as number);

	return reply.send({ message: 'Login successful', token: authToken, user: { username: user.username, avatar: user.avatar } });
};

export const logoutUser = async (request: FastifyRequest, reply: FastifyReply) =>
{
	const   token = request.headers.authorization?.split(' ')[1];
	const { username } = request.body as { username: string, };

	const user = getUserByUsername(username);

	// console.log(token);
	if (token) {
		tokenBlacklist.add(token);
	}
	if (!user)
		return reply.status(401).send({ message: 'Invalid username' });

	if (!user?.connected)
		return reply.status(401).send({ message: 'User already disconnected' });


	logOutUserById(user.id as number);

	return reply.send({ message: 'Logout successful' });
};

export const    getUserInfo = async (request: FastifyRequest, reply: FastifyReply) =>
{
	const   { username } = request.query as { username: string };

	const   user = getUserByUsername(username);

	if (!user)
		return reply.status(401).send({ message: 'Invalid username' });

	return reply.status(201).send({ message: 'User\'s infos sended', user });
};

export const    connectUser = async (request: FastifyRequest, reply: FastifyReply) => {
	const { username } = request.body as { username: string };

	const user = getUserByUsername(username);

	if (!user)
		return reply.status(401).send({ message: 'Invalid username' });

	logUserById(user.id as number);

	return reply.status(201).send({ message: 'User connected successfully', user: { username: user.username, avatar: user.avatar } });
}

export const    disconnectUser = async (request: FastifyRequest, reply: FastifyReply) => {
	const { username } = request.body as { username: string };

	const user = getUserByUsername(username);

	if (!user)
		return reply.status(401).send({ message: 'Invalid username' });

	if (!user.connected)
		return reply.status(401).send({ message: 'User already disconnected' });

	logOutUserById(user.id as number);

	return reply.status(201).send({ message: 'User disconnected successfully' });
}

/*----------------------------------------------------------------------------*/
/* Contact */

export const    getFriends = async (request: FastifyRequest, reply: FastifyReply) =>
{
	try {
		const   { username } = request.query as { username: string };

		const   user = getUserByUsername(username);

		if (!user)
			return reply.status(400).send({ message: 'Invalid username' });

		const   contacts = getUserContactById(user.id as number);

		const contactsUsername = await Promise.all(contacts.map(async (id) => {
			const friendUsername = getUserById(id.friendId);
			return { username: friendUsername?.username, avatar: friendUsername?.avatar, connected: friendUsername?.connected };
		}));

		if (!contacts.length)
			return reply.status(201).send({ message: 'Client does not have any contact.', friendList: [] });

		return reply.status(201).send({ message: "Contacts found", friendList: contactsUsername })
	}
	catch (error) {
		console.error('Error getting friends:', error);
		return reply.status(500).send({ message: 'Internal server error' });
	}

};


export const    addFriend = async (request: FastifyRequest, reply: FastifyReply) =>
{
	const   { username, usernameFriend } = request.body as { username: string, usernameFriend: string };

	const   user = getUserByUsername(username);

	const   userFriend = getUserByUsername(usernameFriend);

	if (!user)
		return reply.status(401).send({ message: 'Invalid username', disconnect: true });
	if (!userFriend)
		return reply.status(401).send({ message: "User with this username doesn't exist" });

	if (user.id === userFriend.id)
		return reply.status(401).send({ message: 'User cannot add himself' });

	try {
		if (userFriend.id) {
			const user1Id = user.id as number;
			const user2Id = userFriend.id as number;

			createContact(user1Id, user2Id);
		}
	}
	catch (error) {
		return reply.status(401).send({ message: 'User already added as a friend' });
	}
	return reply.status(201).send({ message: 'Friend request sent' });
};

export const    deleteFriend = async (request: FastifyRequest, reply: FastifyReply) =>
{
	const   { username, usernameFriend } = request.body as { username: string, usernameFriend: string };

	const   user = getUserByUsername(username);

	const   userFriend = getUserByUsername(usernameFriend);

	if (!user || !userFriend)
		return reply.status(401).send({ message: 'Invalid username' });

	if (userFriend.id)
	{
		const   user1Id = user.id as number;
		const   user2Id = userFriend.id as number;

		deleteContact(user1Id, user2Id);
	}
	return reply.status(201).send({ message: 'Friend deleted' });
};

/*--------------------------------------------------------------------------------------------*/
/* Message */


export const    addMessage = async (request: FastifyRequest, reply: FastifyReply) =>
{
	const   { username, usernameContact, content, date } = request.body as { username: string, usernameContact: string, content:string, date:string };

	const   user = getUserByUsername(username);

	const   userContact = getUserByUsername(usernameContact);

	if (!user || !userContact)
		return reply.status(401).send({ message: 'Invalid username' });

	if (user.id)
	{
		const   senderId = user.id as number;
		const   recipientId = userContact.id as number;
		saveMessage({ senderId, recipientId, content, date });

		return  reply.status(201).send({ message: 'Message saved' });
	}
};

export const    getMessage = async (request: FastifyRequest, reply: FastifyReply) =>
{
	const   { id, username } = request.query as { id: number, username: string };

	const   user = getUserByUsername(username) as Users;

	if (!user)
		return reply.status(401).send({ message: 'Invalid username' });

	if (user.id)
	{
		const   senderId = id;
		const   recipientId = user.id;
		const   mess = getMessageById( senderId, recipientId );

		return  reply.status(201).send({ message: 'Message received', mess });
	}
};

/*--------------------------------------------------------------------------------------------*/
/* Game */

// createGame modified
export const createPongGame = (players: {player1: player | null, player2: player | null}, score: any, winner: player | null, solo: boolean, bot: boolean) =>
{
	if (solo === true)
		return ;

	if (players.player1?.username === players.player2?.username)
		return;

    if (players.player1?.username === players.player2?.username)
        return;

		const   player1 = getUserByUsername(players.player1?.username!) as Users;
		const   player2 = getUserByUsername(players.player2?.username!) as Users;

		if (!player1 || !player2)
			return ;

		if (player1.id && player2.id)
		{
			if (score.player1.score < 0 && score.player2.score < 0)
				return ;

			const gameId = saveGame("");

			createUserGameStatsPong(player1.id, gameId, score.player1, players.player1?.username === winner?.username, "pong");
			createUserGameStatsPong(player2.id, gameId, score.player2, players.player2?.username === winner?.username, "pong");

			updateStats(player1.id);
			updateStats(player2.id);
		}
};

export const createTetrisGame = (data: TetrisGame) =>
{
	const   player1 = getUserByUsername(data.getUsername()) as Users;

	if (!player1)
	{
		console.log("Invalid User");
		return ;
	}
	if (player1.id)
	{
		if (data.getScore() < 0)
		{
			console.log("Invalid score");
			return ;
		}

		const gameId = saveGame("");

		const gameTetrisId = data.getGameId();

		createUserGameStatsTetris(player1.id, gameId, data.getScore(), true, "tetris", gameTetrisId, data.getStats());
		updateStats(player1.id);

	}
};


/*--------------------------------------------------------------------------------------------*/
/* Stat */

export const    getStat = async (request: FastifyRequest, reply: FastifyReply) =>
{
	const   { username } = request.query as { username: string };

	const   user = getUserByUsername(username) as Users;

	if (!user)
		return reply.status(401).send({ message: 'Invalid username' });

	if (user.id)
	{
		const stat = getStatsById(user.id);
		return  reply.status(201).send({ message: 'Stat sended', stats:stat });
	}
};

/*--------------------------------------------------------------------------------------------*/
/* GamesUsers */

export const    getGameHistory = async (request: FastifyRequest, reply: FastifyReply) =>
{
	const   { username } = request.query as { username: string };

	const   user = getUserByUsername(username) as Users;

	if (!user)
		return reply.status(401).send({ message: 'Invalid username' });

	if (user.id)
	{
		const gamesId = getUserGameHistory(user.id);
		const fullGameHistory = await Promise.all(gamesId.map(async (id) => {
			const gameDetails = await getGameDetailsById(id); // Pass individual ID
			gameDetails.forEach((gameDetail) => {
				gameDetail.username = getUsernameById(gameDetail.userId);
				gameDetail.userId = -1;
				gameDetail.date = getGameById(id)?.date!;
			})
			return { gameId: id, players: gameDetails };
		}));
		return  reply.status(201).send({ message: 'Game History sended', history:fullGameHistory });
	}
};
