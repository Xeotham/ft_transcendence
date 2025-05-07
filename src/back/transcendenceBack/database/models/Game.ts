import db from '../db';

interface Game 
{
    id?:    number;
    date:   string;
}

export const saveGame = (date: string): number => 
{
    if (date)
    {

        const stmt = db.prepare(`
            INSERT INTO game (date)
            VALUES (?)
            `);
            
        const result = stmt.run(date);
        return result.lastInsertRowid as number;
    }
    else
    {
        const stmt = db.prepare(`
            INSERT INTO game DEFAULT VALUES
            `);
            
        const result = stmt.run();
        return result.lastInsertRowid as number;
    }
};
