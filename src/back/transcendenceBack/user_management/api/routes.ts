import { FastifyInstance } from 'fastify';
import {
    registerUser, updateUser, loginUser, logoutUser,
    getUserInfo, getFriends, addFriend, deleteFriend, addMessage, getMessage, createPongGame, getStat,
    getGameHistory, updateParameter, getParameter, connectUser, disconnectUser, getAvatars, updatePassword
} from './controllers';


// TODO: (Maybe) delete a user

export default async function userRoutes(fastify: FastifyInstance)
{
    fastify.post('/register', registerUser);
    fastify.patch('/update-user', updateUser);
    fastify.post('/login', loginUser);
    fastify.post('/logout', logoutUser);
    fastify.get('/get-user', getUserInfo);
    fastify.post('/add-friend', addFriend);
    fastify.get('/get-friends', getFriends);
    fastify.post('/delete-friend', deleteFriend);
    // fastify.post('/block-contact', blockContact);
    // fastify.post('/unblock-contact', unblockContact);
    fastify.post('/add-message', addMessage);
    fastify.get('/get-message', getMessage);
    fastify.get('/get-stat', getStat);
    fastify.get('/get-parameter', getParameter);
    fastify.patch('/update-parameter', updateParameter);
    fastify.get('/get-game-history', getGameHistory);
    fastify.post('/connect-user', connectUser);
    fastify.post('/disconnect-user', disconnectUser);
    fastify.get('/get-avatars', getAvatars);
    fastify.patch('/update-password', updatePassword);
}
