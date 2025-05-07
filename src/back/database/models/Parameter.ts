import db from '../db';

interface Parameter 
{
	id?:					number;
	userId:					number;
	left:					string;
	right:					string;
	clockwiseRot:			string;
	countClockwiseRot:	string;
	hardDrop:				string;
	softDrop:				string;
	hold:					string;
	forfeit:				string;
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
		SELECT p.left, p.right, p.clockwiseRot, p.countClockwiseRot, p.hardDrop, p.softDrop, p.hold, p.forfeit \
		FROM user u \
		JOIN parameter p  ON p.userId = u.id \
		WHERE u.id = ? \
		');

	return stmt.get(id) as Parameter | undefined;
};

export const updateParam = (id: number, command: string, key: string ): void => 
{
    const comm = ["left", "right", "clockwiseRot", "countClockwiseRot", "hardDrop", "softDrop", "hold", "forfeit"];
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
				SET left = ? \
				WHERE id = ?\
				');
			stmt.run(key, id);
			break;
		case 1:
			stmt = db.prepare('\
				UPDATE parameter \
				SET right = ? \
				WHERE id = ?\
				');
			stmt.run(key, id);
			break;
		case 2:
			stmt = db.prepare('\
				UPDATE parameter \
				SET  clockwiseRot = ? \
				WHERE id = ?\
				');
			stmt.run(key, id);
			break;
		case 3:
			stmt = db.prepare('\
				UPDATE parameter \
				SET countClockwiseRot = ? \
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
	}
};
