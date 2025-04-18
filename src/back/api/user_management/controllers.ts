// Fastify request and response to create the controllers for the API
import { FastifyRequest, FastifyReply } from 'fastify';
// Interactions with the DataBase to create and get Users
import { createUser, updateUserById, getUserByUsername, getUserById, logUserById, logOutUserById, getUsernameById } from '../../database/models/Users';
import { createContact, modifyContact, getUserContactById, checkFriendshipStatus, checkBlockStatus, checkPosContact } from '../../database/models/Contact';
import { createStats, getStatsById, updateStats } from '../../database/models/Stat' ;
import { request } from 'http';
import {createUserGameStats, getUserStatsGame, getUserGameHistory, getGameDetailsById } from '../../database/models/Games_users';
import { getMessageById, saveMessage } from '../../database/models/Message';
import { saveGame } from '../../database/models/Game';
import { createParam, updateParam, getParamById } from '../../database/models/Parameter';

interface Users {
    id?:            number;
    username:       string;
    password:       string;
    avatar:         string;
    connected:      boolean;
    created_at?:    string;
}


/*----------------------------------------------------------------------------*/
/* User */


export const registerUser = async (request: FastifyRequest, reply: FastifyReply) => 
{
    const { username, password, avatar } = request.body as { username: string, password: string, avatar: string };

    if(!username || !password || !avatar )
        return reply.status(400).send({ message: 'Username, password and avatar can\'t be empty' });

    const existingUser = getUserByUsername(username);
    if (existingUser)
        return reply.status(400).send({ message: 'Username already exists' });

    const id = createUser( username, password, avatar );

    createStats(id);

    createParam(id);
    
    return reply.status(201).send({ message: 'User registered successfully', id });
};

export const updateUser = async (request: FastifyRequest, reply: FastifyReply) => 
{
    const { username, type, update } = request.body as { username: string, type: string, update: string };

    const user = getUserByUsername(username);
    if (!user)
        return reply.status(400).send({ message: 'User doesn\'t exist' });

    updateUserById( user.id as number, type, update);

    return reply.status(201).send({ message: 'User updated successfully' });
};

export const loginUser = async (request: FastifyRequest, reply: FastifyReply) => 
{
    const { username, password } = request.body as { username: string, password: string };

    let user = getUserByUsername(username);
    if (!user || user.password !== password)
        return reply.status(401).send({ message: 'Invalid username or password' });

    logUserById(user.id as number);

    user = getUserById(user.id as number);

    return reply.send({ message: 'Login successful', user });
};

export const logoutUser = async (request: FastifyRequest, reply: FastifyReply) => 
{
    const { username, password } = request.body as { username: string, password: string };

    let user = getUserByUsername(username);
    if (!user || user.password !== password)
        return reply.status(401).send({ message: 'Invalid username or password' });

    logOutUserById(user.id as number);

    user = getUserById(user.id as number);

    return reply.send({ message: 'Logout successful', user });
};

export const    getUserInfo = async (request: FastifyRequest, reply: FastifyReply) => 
{
    const   { username } = request.query as { username: string };

    const   user = getUserByUsername(username);

    if (!user)
        return reply.status(401).send({ message: 'Invalid username' });
    
    return reply.status(201).send({ message: 'User\s infos sended', user });
};

/*----------------------------------------------------------------------------*/
/* Contact */

export const    getFriends = async (request: FastifyRequest, reply: FastifyReply) => 
{
    const   { username } = request.query as { username: string };

    const   user = getUserByUsername(username);

    if (!user)
        return reply.status(400).send({ message: 'Invalid username' });

    const   contacts = getUserContactById(user.id as number);

    const contacts_username = await Promise.all(contacts.map(async (id) => {
        const friend_username = await getUsernameById(id);
        return { friend_id: id, friend_username: friend_username};
    }));

    if (!contacts.length)
        return reply.status(401).send({ message: 'Client does not have any contact.' });

    return reply.status(201).send({ message: "Contacts found", contacts_username })
};

export const    addFriend = async (request: FastifyRequest, reply: FastifyReply) => 
{
    const   { username, username_friend } = request.body as { username: string, username_friend: string };

    const   user = getUserByUsername(username);

    const   user_friend = getUserByUsername(username_friend);

    if (!user || !user_friend)
        return reply.status(401).send({ message: 'Invalid username' });

    if (user.id == user_friend.id)
        return reply.status(401).send({ message: 'User cannot add himself' });

    if (user_friend.id)
    {
        const   user1_id = user.id as number;
        const   user2_id = user_friend.id as number;
        let     friend_u1 = true;
        let     friend_u2 = false;
        let     block_u1 = false;
        let     block_u2 = false;
        let     pos;

        if (checkBlockStatus(user1_id, user2_id) > 0)
            return  reply.status(301).send({ message: 'Contact is blocked' });

        
        const status = checkFriendshipStatus( user1_id, user2_id );
        switch (status)
        {
            case 0:
                createContact({ user1_id, user2_id, friend_u1, friend_u2, block_u1, block_u2 });
                return  reply.status(201).send({ message: 'Friend request sended' });

            case 1:
                return  reply.status(301).send({ message: 'Friend request already sended' });

            case 2:
                pos = checkPosContact(user1_id, user2_id);
                friend_u2 = true;
                if (pos == 1)
                    modifyContact( user1_id, user2_id, friend_u1, friend_u2, block_u1, block_u2 );
                else if (pos == 2)
                    modifyContact( user2_id, user1_id, friend_u2, friend_u1, block_u2, block_u1 );
                return  reply.status(201).send({ message: 'Friend request accepted' });

            case 3:
                return  reply.status(301).send({ message: 'Friend already added' });

            case 4:
                pos = checkPosContact(user1_id, user2_id);
                if (pos == 1)
                    modifyContact( user1_id, user2_id, friend_u1, friend_u2, block_u1, block_u2 );
                else if (pos == 2)
                    modifyContact( user2_id, user1_id, friend_u2, friend_u1, block_u2, block_u1 );
                return  reply.status(201).send({ message: 'Friend request sended' });

        }
    }
};

export const    deleteFriend = async (request: FastifyRequest, reply: FastifyReply) => 
{
    const   { username, username_friend } = request.body as { username: string, username_friend: string };

    const   user = getUserByUsername(username);

    const   user_friend = getUserByUsername(username_friend);

    if (!user || !user_friend)
        return reply.status(401).send({ message: 'Invalid username' });

    if (user_friend.id)
    {
        const   user1_id = user.id as number;
        const   user2_id = user_friend.id as number;
        const   friend_u1 = false;
        const   friend_u2 = false;
        const   block_u1 = false;
        const   block_u2 = false;
    
        if (checkBlockStatus(user1_id, user2_id) > 0)
            return  reply.status(301).send({ message: 'Contact is blocked' });

        const status = checkFriendshipStatus( user1_id, user2_id );

        if (status == 0 || status == 4)
            return  reply.status(301).send({ message: 'User is not a contact' });
        else
        {
            const pos = checkPosContact(user1_id, user2_id);
            if (pos == 1)
                modifyContact( user1_id, user2_id, friend_u1, friend_u2, block_u1, block_u2 );
            else if (pos == 2)
                modifyContact( user2_id, user1_id, friend_u2, friend_u1, block_u2, block_u1 );
            return  reply.status(201).send({ message: 'Friend deleted' });
        }
    }
};

export const    blockContact = async (request: FastifyRequest, reply: FastifyReply) => 
{
    const   { username, username_friend } = request.body as { username: string, username_friend: string };

    const   user = getUserByUsername(username);

    const   user_friend = getUserByUsername(username_friend);

    if (!user || !user_friend)
        return reply.status(401).send({ message: 'Invalid username' });

    if (!user)
        return reply.status(401).send({ message: 'Invalid username' });

    if (user_friend.id)
    {
        const   user1_id = user.id as number;
        const   user2_id = user_friend.id as number;
        const   friend_u1 = false;
        const   friend_u2 = false;
        const   block_u1 = true;
        let     block_u2 = false;
        let     pos;

        const block_status = checkBlockStatus(user1_id, user2_id)
        if (block_status == 1 || block_status == 3)
            return  reply.status(301).send({ message: 'Contact is already blocked' });

        
        const friend_status = checkFriendshipStatus( user1_id, user2_id );
        if (friend_status == 0)
        {
            createContact({ user1_id, user2_id, friend_u1, friend_u2, block_u1, block_u2 });
            return  reply.status(201).send({ message: 'User blocked' });
        }
        else
        {
            if (block_status == 2)
                block_u2 = true;
            pos = checkPosContact(user1_id, user2_id);
            if (pos == 1)
                modifyContact( user1_id, user2_id, friend_u1, friend_u2, block_u1, block_u2 );
            else
                modifyContact( user2_id, user1_id, friend_u2, friend_u1, block_u2, block_u1 );
            return  reply.status(201).send({ message: 'User blocked' });
        }
    }
};

export const    unblockContact = async (request: FastifyRequest, reply: FastifyReply) => 
{
    const   { username, username_friend } = request.body as { username: string, username_friend: string };

    const   user = getUserByUsername(username);

    const   user_friend = getUserByUsername(username_friend);

    if (!user || !user_friend)
        return reply.status(401).send({ message: 'Invalid username' });

    if (!user)
        return reply.status(401).send({ message: 'Invalid username' });

    if (user_friend.id)
    {
        const   user1_id = user.id as number;
        const   user2_id = user_friend.id as number;
        const   friend_u1 = false;
        const   friend_u2 = false;
        const   block_u1 = false;
        let     block_u2 = false;
        let     pos;
        

        const block_status = checkBlockStatus(user1_id, user2_id)
        switch (block_status)
        {
            case 0:
                return  reply.status(301).send({ message: 'Contact is already unblocked' });
            case 1:
                pos = checkPosContact(user1_id, user2_id);
                if (pos == 1)
                    modifyContact( user1_id, user2_id, friend_u1, friend_u2, block_u1, block_u2 );
                else
                    modifyContact( user2_id, user1_id, friend_u2, friend_u1, block_u2, block_u1 );
                return  reply.status(201).send({ message: 'Contact unblocked' });
            
            case 2:
                return  reply.status(301).send({ message: 'Contact is already unblocked' });

            case 3:
                block_u2 = true;
                pos = checkPosContact(user1_id, user2_id);
                if (pos == 1)
                    modifyContact( user1_id, user2_id, friend_u1, friend_u2, block_u1, block_u2 );
                else
                    modifyContact( user2_id, user1_id, friend_u2, friend_u1, block_u2, block_u1 );
                return  reply.status(201).send({ message: 'Contact unblocked' });

        }
    }
};

/*--------------------------------------------------------------------------------------------*/
/* Message */


export const    addMessage = async (request: FastifyRequest, reply: FastifyReply) => 
{
    const   { username, username_contact, content, date } = request.body as { username: string, username_contact: string, content:string, date:string };

    const   user = getUserByUsername(username);

    const   user_contact = getUserByUsername(username_contact);

    if (!user || !user_contact)
        return reply.status(401).send({ message: 'Invalid username' });

    if (user.id)
    {
        const   sender_id = user.id as number;
        const   recipient_id = user_contact.id as number;
        saveMessage({ sender_id, recipient_id, content, date });

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
        const   sender_id = id;
        const   recipient_id = user.id;
        const mess = getMessageById( sender_id, recipient_id );

        return  reply.status(201).send({ message: 'Message received', mess });
    }
};

/*--------------------------------------------------------------------------------------------*/
/* Game */

export const createGame = async (request: FastifyRequest, reply:FastifyReply) => 
{
    const   { username1, username2, date, scorep1, scorep2, winner, type } = request.body as { username1:string, username2:string, date:string, scorep1:number, scorep2:number, winner:string, type:string }

    
    const   player1 = getUserByUsername(username1) as Users;
    const   player2 = getUserByUsername(username2) as Users;

    console.log(username1, username2);
    if (!player1 || !player2)
        return reply.status(401).send({ message: 'Invalid username'});

    if (player1.id && player2.id)
    {
        if (scorep1 < 0 || scorep2 << 0)
            return reply.status(401).send({ message: 'Invalid username'});

        const game_id = saveGame(date);

        createUserGameStats(player1.id, game_id, scorep1, username1 === winner, type);
        createUserGameStats(player2.id, game_id, scorep1, username2 === winner, type);

        updateStats(player1.id);
        updateStats(player2.id);
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
        return  reply.status(201).send({ message: 'Stat received', stat });
    }
};

/*--------------------------------------------------------------------------------------------*/
/* Games_Users */

export const    getGameHistory = async (request: FastifyRequest, reply: FastifyReply) => 
{
    const   { username } = request.query as { username: string };

    const   user = getUserByUsername(username) as Users;

    if (!user)
        return reply.status(401).send({ message: 'Invalid username' });

    if (user.id)
    {
        const games_id = getUserGameHistory(user.id);
        const full_game_history = await Promise.all(games_id.map(async (id) => {
            const gameDetails = await getGameDetailsById(id); // Pass individual ID
            return { game_id: id, players: gameDetails };
        }));

        return  reply.status(201).send({ message: 'Stat received', full_game_history });
    }
};

/*--------------------------------------------------------------------------------------------*/
/* Param */

export const updateParameter = async (request: FastifyRequest, reply: FastifyReply) => 
{
    const { username, control, key } = request.body as { username: string, control: string, key: string };

    const user = getUserByUsername(username);

    if (!user)
        return reply.status(400).send({ message: 'User doesn\'t exist' });

    updateParam( user.id as number, control, key);

    return reply.status(201).send({ message: 'User updated successfully' });
};

export const    getParameter = async (request: FastifyRequest, reply: FastifyReply) => 
{
    const   { username } = request.query as { username: string };

    const   user = getUserByUsername(username) as Users;

    if (!user)
        return reply.status(401).send({ message: 'Invalid username' });

    if (user.id)
    {
        const stat = getParamById(user.id);
        return  reply.status(201).send({ message: 'Stat received', stat });
    }
};
