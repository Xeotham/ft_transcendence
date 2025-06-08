import { getRoomById } from '../utils';
import { Room } from './Room';
import * as constants from "./constants";
import { mod } from '../../tetris_app/server/Game/utils';

let intervalIds: {[id: number]: number} = {};

export const botLogic = async (gameData: any, id: number) => 
{
    const room: Room | undefined = getRoomById(id);

    if (!room)
        return ;

	if (mod(gameData.ball.orientation, 360) > 90 && mod(gameData.ball.orientation, 360) < 270)
		movePaddleBot(gameData.paddle2.y, (constants.HEIGHT / 2 - constants.PADDLE_HEIGHT / 2), room);
	else
	{
		const noise = (Math.random() * constants.PADDLE_HEIGHT / 1.7) * (Math.random() < 0.5 ? 1 : -1);
		movePaddleBot(gameData.paddle2.y, predictY(gameData.ball) + noise, room);
	}
};

export const predictY = (ballData: any): number => 
{
	while (ballData.x < constants.PADDLE2_X && ballData.x > 0)
	{
		if (ballData.y < 0 || ballData.y + ballData.size >= constants.HEIGHT)
			ballData.orientation = -ballData.orientation;
		if (ballData.y < 0)
			ballData.y = ballData.size;
		if (ballData.y + ballData.size > constants.HEIGHT)
			ballData.y = constants.HEIGHT - ballData.size;

		ballData.x +=  Math.cos(ballData.orientation);
		ballData.y +=  Math.sin(ballData.orientation);
	}
	if (ballData.y + (ballData.size / 2) < 0)
		ballData.y *= -1; 
	return ballData.y;
};

export const movePaddleBot = (y_paddle: number, y_predicted: number, room: Room) =>
{
	let move;
	if (y_predicted < y_paddle + constants.PADDLE_HEIGHT / 2)
		move = "up";
	else
		move = "down";
	clearInterval(intervalIds[room.getId()]);
	intervalIds[room.getId()] = setInterval(() => 
	{
		if ((move === "up" && y_predicted > (y_paddle + constants.PADDLE_HEIGHT / 2)) ||
			(move === "down" && y_predicted < (y_paddle + constants.PADDLE_HEIGHT / 2)))
			clearInterval(intervalIds[room.getId()]);
		room.getGame()?.movePaddle("P2", move);
		if (move === "up")
			y_paddle -= constants.PADDLE_SPEED;
		else
			y_paddle += constants.PADDLE_SPEED;
	}, 20) as unknown as number;
};

export const resetBot = (id: number, param: number) =>
{
	const room: Room | undefined = getRoomById(id);

	if (room)
	{
		if (param === 0)
			clearInterval(intervalIds[room.getId()]);
		else
			delete intervalIds[room.getId()];
	}
};
