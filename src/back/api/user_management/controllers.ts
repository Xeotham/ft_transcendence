// Fastify request and response to create the controllers for the API
import { FastifyRequest, FastifyReply } from 'fastify';
// Interactions with the DataBase to create and get Users
import { createUser, getUserByUsername } from '../../database/models/Users';

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
    const { username, password } = request.body as { username: string; password: string };

    const user = getUserByUsername(username);
    if (!user || user.password !== password) {
        return reply.status(401).send({ message: 'Invalid username or password' });
    }

    return reply.send({ message: 'Login successful', user });
};

export const    getUserInfo = async (request: FastifyRequest, reply: FastifyReply) => {
    const   { username } = request.body as { username: string };

    const   user = getUserByUsername(username);

    if (!user) {
        return reply.status(401).send({ message: 'Invalid username' });
    }

    return reply.status(201).send({ message: 'Login successful', user });
}