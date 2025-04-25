import Fastify, { FastifyRequest, FastifyReply } from 'fastify';
import { WebSocket } from "ws";
import { movePaddle } from '../api/game-controllers';
import { getRoomById } from '../utils';
import { Room } from './Room';

export const botLogic = async (request: any, id: number) => 
{
    const room: Room | undefined = getRoomById(id);

    if (!room)
        return ;

    const { paddle1, paddle2, ball } = request.body as { paddle1: {x: number, y: number, x_size: number, y_size: number}, paddle2: { x: number, y: number, x_size: number, y_size: number }, ball: { x: number, y: number, size: number, orientation: number, speed: number } };
    if (paddle2.y - ball.y > 0)
        room.getGame()?.movePaddle("P2", "up");
    else
        room.getGame()?.movePaddle("P2", "down");
};