import pg from 'pg';
import fs from 'fs';

if (!process.env.DATABASE_URL) {
    throw new Error('Environment variable DATABASE_URL not found');
}

const pool = new pg.Pool({
    connectionString: process.env.DATABASE_URL
});

export const bootstrap = async () => {
    await query(`
    create table IF NOT EXISTS contacts (
        first_name VARCHAR(50),
        last_name VARCHAR(50),
        email VARCHAR(50),
        phone VARCHAR(50)
    );`);

    const contacts = await query('SELECT * from contacts');
    if (!contacts.rowCount) {
        console.log('Bootstrapping database');
        const schema = fs.readFileSync('db/schema.sql');
        await query(schema.toString('utf-8'))
    }
}

export const query = (text, params, callback) => {
    return pool.query(text, params, callback);
};