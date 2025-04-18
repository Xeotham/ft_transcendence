import db from '../db';

interface Game 
{
    id?:    number;
    date:   string;
}

export const saveGame = (date: string): number => 
{
    const stmt = db.prepare(`
        INSERT INTO game (date)
        VALUES (?)
        `);

    const result = stmt.run(date);

    return result.lastInsertRowid as number;
};
