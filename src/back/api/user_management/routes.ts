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
    fastify.post('/update_user', updateUser);
    fastify.post('/login', loginUser);
    fastify.post('/logout', logoutUser);
    fastify.get('/get_user', getUserInfo);
    fastify.post('/add_friend', addFriend);
    fastify.get('/get_friend', getFriends);
    fastify.post('/delete_friend', deleteFriend);
    fastify.post('/block_contact', blockContact);
    fastify.post('/unblock_contact', unblockContact);
    fastify.post('/add_message', addMessage);
    fastify.get('/get_message', getMessage);
    fastify.post('/create_game', createGame);
    fastify.get('/get_stat', getStat);
    
    
}
