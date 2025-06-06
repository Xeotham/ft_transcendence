import { FastifyInstance } from 'fastify';
import { registerUser, updateUser, loginUser, logoutUser,
    getUserInfo, getFriends, addFriend , deleteFriend, blockContact,
    unblockContact, addMessage, getMessage, createGame, getStat,
    getGameHistory, updateParameter, getParameter  } from './controllers';
import { create } from 'domain';


// TODO: (Maybe) delete a user

export default async function userRoutes(fastify: FastifyInstance)
{
    fastify.post('/register', registerUser);
    fastify.patch('/update-user', updateUser);
    fastify.patch('/login', loginUser);
    fastify.patch('/logout', logoutUser);
    fastify.get('/get-user', getUserInfo);
    fastify.post('/add-friend', addFriend);
    fastify.get('/get-friend', getFriends);
    fastify.post('/delete-friend', deleteFriend);
    fastify.post('/block-contact', blockContact);
    fastify.post('/unblock-contact', unblockContact);
    fastify.post('/add-message', addMessage);
    fastify.get('/get-message', getMessage);
    fastify.post('/create-game', createGame);
    fastify.get('/get-stat', getStat);
    fastify.get('/get-parameter', getParameter);
    fastify.patch('/update-parameter', updateParameter);
    fastify.get('/get-game-history', getGameHistory);
}
