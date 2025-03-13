// Fastify request and response to create the controllers for the API
import { FastifyRequest, FastifyReply } from 'fastify';
// Interactions with the DataBase to create and get Users
import { createUser, getUserByUsername, logUser, loUser } from '../../database/models/Users';
import { createContact, getUserContactById } from '../../database/models/Contact';
import { request } from 'http';
import { getMessageById, saveMessage } from '../../database/models/Message';

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

export const registerUser = async (request: FastifyRequest, reply: FastifyReply) => {
    const { username, password, avatar, connected } = request.body as { username: string; password: string; avatar: string; connected: boolean };

    const existingUser = getUserByUsername(username);
    if (existingUser) {
        return reply.status(400).send({ message: 'Username already exists' });
    }
    createUser({ username, password, avatar, connected });
    return reply.status(201).send({ message: 'User registered successfully' });
};

export const loginUser = async (request: FastifyRequest, reply: FastifyReply) => {
    const { username, password, avatar, connected} = request.body as { username: string; password: string; avatar: string; connected: boolean };

    let user = getUserByUsername(username);
    if (!user || user.password !== password) {
        return reply.status(401).send({ message: 'Invalid username or password' });
    }

    logUser({ username, password, avatar, connected });

    user = getUserByUsername(username);

    return reply.send({ message: 'Login successful', user });
};

export const logoutUser = async (request: FastifyRequest, reply: FastifyReply) => {
    const { username, password, avatar, connected} = request.body as { username: string; password: string; avatar: string; connected: boolean };

    let user = getUserByUsername(username);
    if (!user || user.password !== password) {
        return reply.status(401).send({ message: 'Invalid username or password' });
    }

    loUser({ username, password, avatar, connected });

    user = getUserByUsername(username);

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
        const   friend = 1;
        const   blocked = 0;
        createContact({ user1_id, user2_id, friend, blocked })

        return  reply.status(201).send({ message: '' });
    }
}

/*export const    addMessage = async (equest: FastifyRequest, reply: FastifyReply) => {
    const   { sender_id, recipient_id, content, date } = request.body as { sender_id: number, recipient_id: number, content:string, date:string };
}*/

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