import db from '../db';

interface Parameter
{
	id?:					    number;
	userId:					    number;
	moveLeft:					string;
	moveRight:					string;
	rotateClockwise:			string;
	rotateCounterClockwise: 	string;
	rotate180:                  string;
	hardDrop:				    string;
	softDrop:				    string;
	hold:					    string;
	forfeit:				    string;
}

export const createParam = (id: number): void =>
{
	const stmt = db.prepare('\
		INSERT INTO parameter (userId) \
		VALUES (?) \
		');

	stmt.run(id);
};

export const getParamById = (id: number): Parameter | undefined =>
{
	const stmt = db.prepare('\
		SELECT p.moveLeft, p.moveRight, p.rotateClockwise, p.rotateCounterClockwise, p.hardDrop, p.softDrop, p.hold, p.forfeit, p.rotate180 \
		FROM user u \
		JOIN parameter p  ON p.userId = u.id \
		WHERE u.id = ? \
		');

	return stmt.get(id) as Parameter | undefined;
};

export const updateParam = (id: number, command: string, key: string ): void =>
{
    const comm = ["moveLeft", "moveRight", "rotateClockwise", "rotateCounterClockwise", "hardDrop", "softDrop", "hold", "forfeit", "rotate180"];
	let i = 0;
	let stmt;

	while (comm[i])
	{
		if (comm[i] == command)
			break;
		i++;
	}
	switch (i)
	{
		case 0:
			stmt = db.prepare('\
				UPDATE parameter \
				SET moveLeft = ? \
				WHERE id = ?\
				');
			stmt.run(key, id);
			break;
		case 1:
			stmt = db.prepare('\
				UPDATE parameter \
				SET moveRight = ? \
				WHERE id = ?\
				');
			stmt.run(key, id);
			break;
		case 2:
			stmt = db.prepare('\
				UPDATE parameter \
				SET  rotateClockwise = ? \
				WHERE id = ?\
				');
			stmt.run(key, id);
			break;
		case 3:
			stmt = db.prepare('\
				UPDATE parameter \
				SET rotateCounterClockwise = ? \
				WHERE id = ?\
				');
			stmt.run(key, id);
			break;
		case 4:
			stmt = db.prepare('\
				UPDATE parameter \
				SET hardDrop = ? \
				WHERE id = ?\
				');
			stmt.run(key, id);
			break;
		case 5:
			stmt = db.prepare('\
				UPDATE parameter \
				SET softDrop = ? \
				WHERE id = ?\
				');
			stmt.run(key, id);
			break;
		case 6:
			stmt = db.prepare('\
				UPDATE parameter \
				SET hold = ? \
				WHERE id = ?\
				');
			stmt.run(key, id);
			break;
		case 7:
			stmt = db.prepare('\
				UPDATE parameter \
				SET forfeit = ? \
				WHERE id = ?\
				');
			stmt.run(key, id);
			break;
		case 8:
			stmt = db.prepare('\
				UPDATE parameter \
				SET rotate180 = ? \
				WHERE id = ?\
				');
			stmt.run(key, id);
			break;
	}
};
