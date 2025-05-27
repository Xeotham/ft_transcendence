// Fastify request and response to create the controllers for the API
import { FastifyRequest, FastifyReply } from 'fastify';
// Interactions with the DataBase to create and get Users
import { createUser, updateUserById, getUserByUsername, getUserById, logUserById, logOutUserById, getUsernameById, hashPassword } from '../../database/models/Users';
import { createContact, modifyContact, getUserContactById, checkFriendshipStatus, checkBlockStatus, checkPosContact } from '../../database/models/Contact';
import { createStats, getStatsById, updateStats } from '../../database/models/Stat' ;
import { request } from 'http';
import { createUserGameStatsPong, createUserGameStatsTetris, getUserStatsGame, getUserGameHistory, getGameDetailsById } from '../../database/models/GamesUsers';
import { getMessageById, saveMessage } from '../../database/models/Message';
import { saveGame, getGameById } from '../../database/models/Game';
import { createParam, updateParam, getParamById } from '../../database/models/Parameter';
import bcrypt from 'bcrypt';
import fs from 'fs';
import {player} from "../../pong_app/utils";
import jwt from 'jsonwebtoken';

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


export const registerUser = async (request: FastifyRequest, reply: FastifyReply) => 
{
    const { username, password, avatar } = request.body as { username: string, password: string, avatar: string };

    if(!username || !password || !avatar)
        return reply.status(400).send({ message: 'Username, password and avatar can\'t be empty' });

    const existingUser = getUserByUsername(username);
    if (existingUser)
        return reply.status(400).send({ message: 'Username already exists' });
    try
    {
        const hashedPassword = await hashPassword(password);

        // const base64Avatar = avatar.split(',')[1];

        const id = createUser( username, hashedPassword as string, avatar );

        createStats(id);

        createParam(id);

        return reply.status(201).send({ message: 'User registered successfully', id });
    }
    catch (err)
    {
        return reply.status(400).send({ error: (err as Error).message });
    }
};

export const updateUser = async (request: FastifyRequest, reply: FastifyReply) => 
{
    const { username, type, update } = request.body as { username: string, type: string, update: string };

    const user = getUserByUsername(username);
    if (!user)
        return reply.status(400).send({ message: 'User doesn\'t exist' });

    if (type === "password")
    {
        try
        {
            const hashedPassword = await hashPassword(update);

            updateUserById(user.id!, type, hashedPassword as string);

            return reply.status(201).send({ message: 'User updated successfully' });
        }
        catch (err)
        {
            return reply.status(400).send({ error: (err as Error).message });
        }
    }
    else
    {
        updateUserById( user.id as number, type, update);

        return reply.status(201).send({ message: 'User updated successfully' });
    }
};

export const loginUser = async (request: FastifyRequest, reply: FastifyReply) => 
{
    const { username, password } = request.body as { username: string, password: string };

    const user = getUserByUsername(username);


    if (!user || !(await bcrypt.compare(password, user.password)))
        return reply.status(401).send({ message: 'Invalid username or password' });

    // if (user?.connected)
    //     return reply.status(401).send({ message: 'User already connected' });

    const   payload = { username: user.username, id: user.id };
    const   authToken = jwt.sign(payload, authKey!, { expiresIn: '1h' });

    logUserById(user.id as number);

    return reply.send({ message: 'Login successful', token: authToken });
};

export const logoutUser = async (request: FastifyRequest, reply: FastifyReply) => 
{
    const   token = request.headers.authorization?.split(' ')[1];
    const { username } = request.body as { username: string, };

    const user = getUserByUsername(username);

    console.log(token);
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

/*----------------------------------------------------------------------------*/
/* Contact */

export const    getFriends = async (request: FastifyRequest, reply: FastifyReply) => 
{
    const   { username } = request.query as { username: string };

    const   user = getUserByUsername(username);

    if (!user)
        return reply.status(400).send({ message: 'Invalid username' });

    const   contacts = getUserContactById(user.id as number);

    const contactsUsername = await Promise.all(contacts.map(async (id) => {
        const friendUsername = await getUsernameById(id);
        return { friendId: id, friendUsername: friendUsername};
    }));

    if (!contacts.length)
        return reply.status(401).send({ message: 'Client does not have any contact.' });

    return reply.status(201).send({ message: "Contacts found", contactsUsername })
};

export const    addFriend = async (request: FastifyRequest, reply: FastifyReply) => 
{
    const   { username, usernameFriend } = request.body as { username: string, usernameFriend: string };

    const   user = getUserByUsername(username);

    const   userFriend = getUserByUsername(usernameFriend);

    if (!user || !userFriend)
        return reply.status(401).send({ message: 'Invalid username' });

    if (user.id === userFriend.id)
        return reply.status(401).send({ message: 'User cannot add himself' });

    if (userFriend.id)
    {
        const   user1Id = user.id as number;
        const   user2Id = userFriend.id as number;
        let     friendU1 = true;
        let     friendU2 = false;
        let     blockU1 = false;
        let     blockU2 = false;
        let     pos;

        if (checkBlockStatus(user1Id, user2Id) > 0)
            return  reply.status(301).send({ message: 'Contact is blocked' });

        
        const status = checkFriendshipStatus( user1Id, user2Id );
        switch (status)
        {
            case 0:
                createContact({ user1Id, user2Id, friendU1, friendU2, blockU1, blockU2 });
                return  reply.status(201).send({ message: 'Friend request sended' });

            case 1:
                return  reply.status(301).send({ message: 'Friend request already sended' });

            case 2:
                pos = checkPosContact(user1Id, user2Id);
                friendU2 = true;
                if (pos == 1)
                    modifyContact( user1Id, user2Id, friendU1, friendU2, blockU1, blockU2 );
                else if (pos == 2)
                    modifyContact( user2Id, user1Id, friendU2, friendU1, blockU2, blockU1 );
                return  reply.status(201).send({ message: 'Friend request accepted' });

            case 3:
                return  reply.status(301).send({ message: 'Friend already added' });

            case 4:
                pos = checkPosContact(user1Id, user2Id);
                if (pos == 1)
                    modifyContact( user1Id, user2Id, friendU1, friendU2, blockU1, blockU2 );
                else if (pos == 2)
                    modifyContact( user2Id, user1Id, friendU2, friendU1, blockU2, blockU1 );
                return  reply.status(201).send({ message: 'Friend request sended' });

        }
    }
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
        const   friendU1 = false;
        const   friendU2 = false;
        const   blockU1 = false;
        const   blockU2 = false;
    
        if (checkBlockStatus(user1Id, user2Id) > 0)
            return  reply.status(301).send({ message: 'Contact is blocked' });

        const status = checkFriendshipStatus( user1Id, user2Id );

        if (status == 0 || status == 4)
            return  reply.status(301).send({ message: 'User is not a contact' });
        else
        {
            const pos = checkPosContact(user1Id, user2Id);
            if (pos == 1)
                modifyContact( user1Id, user2Id, friendU1, friendU2, blockU1, blockU2 );
            else if (pos == 2)
                modifyContact( user2Id, user1Id, friendU2, friendU1, blockU2, blockU1 );
            return  reply.status(201).send({ message: 'Friend deleted' });
        }
    }
};

export const    blockContact = async (request: FastifyRequest, reply: FastifyReply) => 
{
    const   { username, usernameFriend } = request.body as { username: string, usernameFriend: string };

    const   user = getUserByUsername(username);

    const   contact = getUserByUsername(usernameFriend);

    if (!user || !contact)
        return reply.status(401).send({ message: 'Invalid username' });

    if (!user)
        return reply.status(401).send({ message: 'Invalid username' });

    if (contact.id)
    {
        const   user1Id = user.id as number;
        const   user2Id = contact.id as number;
        const   friendU1 = false;
        const   friendU2 = false;
        const   blockU1 = true;
        let     blockU2 = false;
        let     pos;

        const blockStatus = checkBlockStatus(user1Id, user2Id)
        if (blockStatus == 1 || blockStatus == 3)
            return  reply.status(301).send({ message: 'Contact is already blocked' });

        
        const friendStatus = checkFriendshipStatus( user1Id, user2Id );
        if (friendStatus == 0)
        {
            createContact({ user1Id, user2Id, friendU1, friendU2, blockU1, blockU2 });
            return  reply.status(201).send({ message: 'User blocked' });
        }
        else
        {
            if (blockStatus == 2)
                blockU2 = true;
            pos = checkPosContact(user1Id, user2Id);
            if (pos == 1)
                modifyContact( user1Id, user2Id, friendU1, friendU2, blockU1, blockU2 );
            else
                modifyContact( user2Id, user1Id, friendU2, friendU1, blockU2, blockU1 );
            return  reply.status(201).send({ message: 'User blocked' });
        }
    }
};

export const    unblockContact = async (request: FastifyRequest, reply: FastifyReply) => 
{
    const   { username, usernameFriend } = request.body as { username: string, usernameFriend: string };

    const   user = getUserByUsername(username);

    const   contact = getUserByUsername(usernameFriend);

    if (!user || !contact)
        return reply.status(401).send({ message: 'Invalid username' });

    if (!user)
        return reply.status(401).send({ message: 'Invalid username' });

    if (contact.id)
    {
        const   user1Id = user.id as number;
        const   user2Id = contact.id as number;
        const   friendU1 = false;
        const   friendU2 = false;
        const   blockU1 = false;
        let     blockU2 = false;
        let     pos;
        

        const blockStatus = checkBlockStatus(user1Id, user2Id)
        switch (blockStatus)
        {
            case 0:
                return  reply.status(301).send({ message: 'Contact is already unblocked' });
            case 1:
                pos = checkPosContact(user1Id, user2Id);
                if (pos == 1)
                    modifyContact( user1Id, user2Id, friendU1, friendU2, blockU1, blockU2 );
                else
                    modifyContact( user2Id, user1Id, friendU2, friendU1, blockU2, blockU1 );
                return  reply.status(201).send({ message: 'Contact unblocked' });
            
            case 2:
                return  reply.status(301).send({ message: 'Contact is already unblocked' });

            case 3:
                blockU2 = true;
                pos = checkPosContact(user1Id, user2Id);
                if (pos == 1)
                    modifyContact( user1Id, user2Id, friendU1, friendU2, blockU1, blockU2 );
                else
                    modifyContact( user2Id, user1Id, friendU2, friendU1, blockU2, blockU1 );
                return  reply.status(201).send({ message: 'Contact unblocked' });

        }
    }
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
    console.log(players.player1?.username, score, winner?.username, solo);
    if (solo === true && bot === false)
    {
        console.log("return solo game");
        return ;
    }

    if (bot === true)
    {
        const   player1 = getUserByUsername(players.player1?.username!) as Users;

        if (!player1)
        {
            console.log("Invalid User");
            return ;
        }


        if (player1.id)
        {
            if (score.player1.score < 0)
                return ;

            const gameId = saveGame("");

            if (winner === players.player1)
                createUserGameStatsPong(player1.id, gameId, score.player1, true, "pong");
            else
                createUserGameStatsPong(player1.id, gameId, score.player1, false, "pong");
            updateStats(player1.id);
            console.log("return bot game");
        }
    }
    else
    {
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
            console.log("return multiplayer game");
        }
    }
};

// export const createGame = async (request: FastifyRequest, reply:FastifyReply) => 
//     {
//         const   { username1, username2, date, scoreP1, scoreP2, winner, type, tetrisStatP1, tetrisStatP2
//             } = request.body as {
//             username1: string, username2: string, date: string, scoreP1: number, scoreP2: number, winner: string, type: string,  tetrisStatP1: any, tetrisStatP2: any}


//         const   player1 = getUserByUsername(username1) as Users;
//         const   player2 = getUserByUsername(username2) as Users;

//         console.log(username1, "|", username2);
//         if (!player1 || !player2)
//             return reply.status(401).send({ message: 'Invalid username'});

//         if (player1.id && player2.id)
//         {
//             if (scoreP1 < 0 || scoreP2 < 0)
//                 return reply.status(401).send({ message: 'Invalid score'});

//             const gameId = saveGame(date);

//             if (type === 'pong')
//             {
//                 createUserGameStatsPong(player1.id, gameId, scoreP1, username1 === winner, type);
//                 createUserGameStatsPong(player2.id, gameId, scoreP2, username2 === winner, type);
//                 updateStats(player1.id);
//                 updateStats(player2.id);
//                 return reply.status(401).send({ message: 'Pong game saved'});
//             }
//             else
//             {
//                 const validJsonString = tetrisStatP1.replace(/(\w+):/g, '"$1":');
//                 const tetrisStatP1J = JSON.parse(validJsonString);
//                 const validJsonString2 = tetrisStatP2.replace(/(\w+):/g, '"$1":');
//                 const tetrisStatP2J = JSON.parse(validJsonString2);
//                 const StatP1 = JSON.parse(JSON.stringify(tetrisStatP1J));
//                 const StatP2 = JSON.parse(JSON.stringify(tetrisStatP2J));
//                 console.log(StatP1);
//                 console.log(StatP2);
//                 createUserGameStatsTetris(player1.id, gameId, scoreP1, username1 === winner, type, StatP1);
//                 createUserGameStatsTetris(player2.id, gameId, scoreP2, username2 === winner, type, StatP2);
//                 updateStats(player1.id);
//                 updateStats(player2.id);
//                 return reply.status(401).send({ message: 'Tetris game saved'});
//             }




//         }
//     };


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
        // stats: added
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
        // history: added
        return  reply.status(201).send({ message: 'Game History sended', history:fullGameHistory });
    }
};

/*--------------------------------------------------------------------------------------------*/
/* Param */

export const updateParameter = async (request: FastifyRequest, reply: FastifyReply) => 
{
    const { username, control, key } = request.body as { username: string, control: string, key: string };

    const user = getUserByUsername(username);

    if (!user)
        return reply.status(400).send({ message: 'Invalid username' });

    updateParam( user.id as number, control, key);

    return reply.status(201).send({ message: 'Paramater updated successfully' });
};

export const    getParameter = async (request: FastifyRequest, reply: FastifyReply) => 
{
    const   { username } = request.query as { username: string };

    const   user = getUserByUsername(username) as Users;

    if (!user)
        return reply.status(401).send({ message: 'Invalid username' });

    if (user.id)
    {
        const parameter = getParamById(user.id);
        return  reply.status(201).send({ message: 'Parameter sended', parameter });
    }
};
