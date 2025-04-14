// Fastify request and response to create the controllers for the API
import { FastifyRequest, FastifyReply } from 'fastify';
// Interactions with the DataBase to create and get Users
import { createUser, updateUserById, getUserByUsername, getUserById, logUserById, logOutUserById } from '../../database/models/Users';
import { createContact, modifyContact, getUserContactById, checkFriendshipStatus, checkBlockStatus, checkPosContact } from '../../database/models/Contact';
import { createStats, getStatsById, updateStats } from '../../database/models/Stat' ;
import { request } from 'http';
import {createUserGameStats, getUserStatsGame} from '../../database/models/Games_users';
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

interface Contact {
    user1_id:			number;
    user2_id:			number;
    friend:				number;
    blocked:			number;
}

interface Message {
    id?:            number;
    sender_id:      number;
    recipient_id:   number;
    content:        string;
    date:           string;
}


/*----------------------------------------------------------------------------*/
/* User */


export const registerUser = async (request: FastifyRequest, reply: FastifyReply) => {
    const { username, password, avatar, connected } = request.body as { username: string; password: string; avatar: string; connected: boolean };

    if(!username || !password || !avatar )
        return reply.status(400).send({ message: 'Username, password and avatar can\'t be empty' });

    const existingUser = getUserByUsername(username);
    if (existingUser) {
        return reply.status(400).send({ message: 'Username already exists' });
    }
    const id = createUser({ username, password, avatar, connected });

    createStats(id);

    createParam(id);
    
    return reply.status(201).send({ message: 'User registered successfully', id });
};

export const updateUser = async (request: FastifyRequest, reply: FastifyReply) => {
    const { id, username, password, avatar, connected } = request.body as { id: number, username: string; password: string; avatar: string; connected: boolean };

    const user = getUserById(id);
    if (!user) {
        return reply.status(400).send({ message: 'User doesn\'t exist' });
    }
    updateUserById({ id, username, password, avatar, connected });
    return reply.status(201).send({ message: 'User updated successfully' });
};

export const loginUser = async (request: FastifyRequest, reply: FastifyReply) => {
    const { id, username, password, avatar, connected} = request.body as { id: number, username: string; password: string; avatar: string; connected: boolean };

    let user = getUserById(id);
    if (!user || user.password !== password) {
        return reply.status(401).send({ message: 'Invalid username or password' });
    }

    logUserById({id, username, password, avatar, connected });

    user = getUserById(id);

    return reply.send({ message: 'Login successful', user });
};

export const logoutUser = async (request: FastifyRequest, reply: FastifyReply) => {
    const { id, username, password, avatar, connected} = request.body as { id: number, username: string; password: string; avatar: string; connected: boolean };

    let user = getUserById(id);
    if (!user || user.password !== password) {
        return reply.status(401).send({ message: 'Invalid username or password' });
    }

    logOutUserById({ id, username, password, avatar, connected });

    user = getUserById(id);

    return reply.send({ message: 'Logout successful', user });
};

export const    getUserInfo = async (request: FastifyRequest, reply: FastifyReply) => {
    const   { username } = request.query as { username: string };

    const   user = getUserByUsername(username);

    if (!user) {
        return reply.status(401).send({ message: 'Invalid username' });
    }
    
    return reply.status(201).send({ message: 'Login successful', user });
}

/*----------------------------------------------------------------------------*/
/* Contact */

export const    getFriends = async (request: FastifyRequest, reply: FastifyReply) => {

    const   { id } = request.query as { id?: number };

    if (!id) {
        return reply.status(400).send({ message: 'Invalid request. ID is required.' });
    }

    const   contact = getUserContactById(id);

    if (!contact) {
        return reply.status(401).send({ message: 'Client does not have any contact.' });
    }
    return reply.status(201).send({ message: "Contacts founds", contact })
}

export const    addFriend = async (request: FastifyRequest, reply: FastifyReply) => {
    const   { username, id } = request.body as { username: string, id: number };

    const   user = getUserByUsername(username) as Users;

    if (!user) {
        return reply.status(401).send({ message: 'Invalid username' });
    }

    if (user.id)
    {
        const   user1_id = id;
        const   user2_id = user.id;
        let   friend_u1 = 1;
        let   friend_u2 = 0;
        let   block_u1 = 0;
        let   block_u2 = 0;

        if (checkBlockStatus(user1_id, user2_id) > 0)
            return  reply.status(301).send({ message: 'Contact is blocked' });

        let pos;
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
                friend_u2 = 1;
                if (pos == 1)
                    modifyContact({ user1_id, user2_id, friend_u1, friend_u2, block_u1, block_u2 });
                else if (pos == 2)
                    modifyContact({ user2_id, user1_id, friend_u2, friend_u1, block_u1, block_u2 });
                return  reply.status(201).send({ message: 'Friend request accepted' });

            case 3:
                return  reply.status(301).send({ message: 'Friend already added' });

            case 4:
                pos = checkPosContact(user1_id, user2_id);
                if (pos == 1)
                    modifyContact({ user1_id, user2_id, friend_u1, friend_u2, block_u1, block_u2 });
                else if (pos == 2)
                    modifyContact({ user2_id, user1_id, friend_u2, friend_u1, block_u1, block_u2 });
                return  reply.status(201).send({ message: 'Friend request sended' });

        }
    }
}

export const    deleteFriend = async (request: FastifyRequest, reply: FastifyReply) => {
    const   { username, id } = request.body as { username: string, id: number };

    const   user = getUserByUsername(username) as Users;

    if (!user) {
        return reply.status(401).send({ message: 'Invalid username' });
    }

    if (user.id)
    {
        const   user1_id = id;
        const   user2_id = user.id;
        const   friend_u1 = 0;
        const   friend_u2 = 0;
        const   block_u1 = 0;
        const   block_u2 = 0;
    
        const status = checkFriendshipStatus( user1_id, user2_id );

        if (status == 0 || status == 4)
            return  reply.status(301).send({ message: 'User is not a contact' });
        else
        {
            const pos = checkPosContact(user1_id, user2_id);
            if (pos == 1)
                modifyContact({ user1_id, user2_id, friend_u1, friend_u2, block_u1, block_u2 });
            else if (pos == 2)
                modifyContact({ user2_id, user1_id, friend_u2, friend_u1, block_u1, block_u2 });
            return  reply.status(201).send({ message: 'Friend deleted' });
        }
    }
}

export const    blockContact = async (request: FastifyRequest, reply: FastifyReply) => {
    const   { username, id } = request.body as { username: string, id: number };

    const   user = getUserByUsername(username) as Users;

    if (!user) {
        return reply.status(401).send({ message: 'Invalid username' });
    }

    if (user.id)
    {
        const   user1_id = id;
        const   user2_id = user.id;
        const   friend_u1 = 0;
        const   friend_u2 = 0;
        const   block_u1 = 1;
        let     block_u2 = 0;

        const block_status = checkBlockStatus(user1_id, user2_id)
        if (block_status == 0 || block_status == 3)
            return  reply.status(301).send({ message: 'Contact is already blocked' });

        let pos;
        const friend_status = checkFriendshipStatus( user1_id, user2_id );
        if (friend_status == 0)
        {
            createContact({ user1_id, user2_id, friend_u1, friend_u2, block_u1, block_u2 });
            return  reply.status(201).send({ message: 'User blocked' });
        }
        else
        {
            if (block_status == 2)
                block_u2 = 1;
            pos = checkPosContact(user1_id, user2_id);
            if (pos == 1)
                modifyContact({ user1_id, user2_id, friend_u1, friend_u2, block_u1, block_u2 });
            else
                modifyContact({ user2_id, user1_id, friend_u2, friend_u1, block_u2, block_u1 });
            return  reply.status(201).send({ message: 'User blocked' });
        }
    }
}

export const    unblockContact = async (request: FastifyRequest, reply: FastifyReply) => {
    const   { username, id } = request.body as { username: string, id: number };

    const   user = getUserByUsername(username) as Users;

    if (!user) {
        return reply.status(401).send({ message: 'Invalid username' });
    }

    if (user.id)
    {
        const   user1_id = id;
        const   user2_id = user.id;
        const   friend_u1 = 0;
        const   friend_u2 = 0;
        const   block_u1 = 0;
        let     block_u2 = 0;
        let     pos;
        
        const block_status = checkBlockStatus(user1_id, user2_id)
        switch (block_status)
        {
            case 0:
                return  reply.status(301).send({ message: 'Contact is already unblocked' });
            case 1:
                pos = checkPosContact(user1_id, user2_id);
                if (pos == 1)
                    modifyContact({ user1_id, user2_id, friend_u1, friend_u2, block_u1, block_u2 });
                else
                    modifyContact({ user2_id, user1_id, friend_u2, friend_u1, block_u2, block_u1 });
                return  reply.status(201).send({ message: 'Contact unblocked' });
            
            case 2:
                return  reply.status(301).send({ message: 'Contact is already unblocked' });
            case 3:
                block_u2 = 1;
                pos = checkPosContact(user1_id, user2_id);
                if (pos == 1)
                    modifyContact({ user1_id, user2_id, friend_u1, friend_u2, block_u1, block_u2 });
                else
                    modifyContact({ user2_id, user1_id, friend_u2, friend_u1, block_u2, block_u1 });
                return  reply.status(201).send({ message: 'Contact unblocked' });

        }
    }
}

/*--------------------------------------------------------------------------------------------*/
/* Message */


export const    addMessage = async (request: FastifyRequest, reply: FastifyReply) => {
    const   { id, username, content, date } = request.body as { id: number, username: string, content:string, date:string };

    const   user = getUserByUsername(username) as Users;

    if (!user) {
        return reply.status(401).send({ message: 'Invalid username' });
    }

    if (user.id)
    {
        const   sender_id = id;
        const   recipient_id = user.id;
        saveMessage({ sender_id, recipient_id, content, date })

        return  reply.status(201).send({ message: '' });
    }
}

export const    getMessage = async (request: FastifyRequest, reply: FastifyReply) => {
    const   { id, username } = request.query as { id: number, username: string };

    const   user = getUserByUsername(username) as Users;

    if (!user) {
        return reply.status(401).send({ message: 'Invalid username' });
    }

    if (user.id)
    {
        const   sender_id = id;
        const   recipient_id = user.id;
        const mess = getMessageById( sender_id, recipient_id )

        return  reply.status(201).send({ message: '', mess });
    }
}

/*--------------------------------------------------------------------------------------------*/
/* Game */

export const createGame = async (request: FastifyRequest, replyL:FastifyReply) => {
    const   { username1, username2, date, scorep1, scorep2, winner, type } = request.query as { username1:string, username2:string, date:string, scorep1:number, scorep2:number, winner:string, type:string }

    const   player1 = getUserByUsername(username1) as Users;
    const   player2 = getUserByUsername(username2) as Users;

    if (!player1 || !player2)
    {
        return replyL.status(401).send({ message: 'Invalid username'});
    }

    if (player1.id && player2.id)
    {
        if (scorep1 < 0 || scorep2 << 0)
            return replyL.status(401).send({ message: 'Invalid username'});

        const game_id = saveGame(date);

        createUserGameStats(player1.id, game_id, scorep1, username1 === winner, type);
        createUserGameStats(player2.id, game_id, scorep1, username2 === winner, type);

        updateStats(player1.id);
        updateStats(player2.id);
    }
}
