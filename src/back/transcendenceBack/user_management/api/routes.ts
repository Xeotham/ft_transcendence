import { FastifyInstance } from 'fastify';
import {
	registerUser,
	loginUser,
	logoutUser,
	getUserInfo,
	getFriends,
	addFriend,
	deleteFriend,
	addMessage,
	getMessage,
	createPongGame,
	getStat,
	getGameHistory,
	connectUser,
	disconnectUser,
	getAvatars,
	updatePassword,
	updateUsername, updateAvatar
} from './controllers';

export default async function userRoutes(fastify: FastifyInstance)
{
	fastify.post('/register', registerUser);
	fastify.post('/login', loginUser);
	fastify.post('/logout', logoutUser);
	fastify.get('/get-user', getUserInfo);
	fastify.post('/add-friend', addFriend);
	fastify.get('/get-friends', getFriends);
	fastify.post('/delete-friend', deleteFriend);
	fastify.post('/add-message', addMessage);
	fastify.get('/get-message', getMessage);
	fastify.get('/get-stat', getStat);
	fastify.get('/get-game-history', getGameHistory);
	fastify.post('/connect-user', connectUser);
	fastify.post('/disconnect-user', disconnectUser);
	fastify.get('/get-avatars', getAvatars);
	fastify.patch('/update-password', updatePassword);
	fastify.patch('/update-username', updateUsername);
	fastify.patch('/update-avatar', updateAvatar);
}
