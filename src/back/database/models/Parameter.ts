import db from '../db';

interface Parameter
{
	id?:					number;
	user_id:				number;
	left:					string;
	right:					string;
	clockwise_rot:			string;
	count_clockwise_rot:	string;
	hard_drop:				string;
	soft_drop:				string;
	hold:					string;
	forfeit:				string;
}

export const createParam = (id: number): void =>
{
	const stmt = db.prepare('\
		INSERT INTO parameter (user_id) \
		VALUES (?) \
		');

	stmt.run(id);
};

export const getParamById = (id: number): Parameter | undefined =>
{
	const stmt = db.prepare('\
		SELECT * \
		FROM user u \
		JOIN parameter p  ON p.user_id = u.id \
		WHERE u.id = ? \
		');

	return stmt.get(id) as Parameter | undefined;
};

export const updateParam = (id: number, command: string, key: string ): void =>
{
    const comm = ["left", "right", "clockwise_rot", "count_clockwise_rot", "hard_drop", "soft_drop", "hold", "forfeit"];
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
				SET  clockwise_rot = ? \
				WHERE id = ?\
				');
			stmt.run(key, id);
			break;
		case 3:
			stmt = db.prepare('\
				UPDATE parameter \
				SET count_clockwise_rot = ? \
				WHERE id = ?\
				');
			stmt.run(key, id);
			break;
		case 4:
			stmt = db.prepare('\
				UPDATE parameter \
				SET hard_drop = ? \
				WHERE id = ?\
				');
			stmt.run(key, id);
			break;
		case 5:
			stmt = db.prepare('\
				UPDATE parameter \
				SET soft_drop = ? \
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
