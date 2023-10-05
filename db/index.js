import pg from 'pg';
import fs from 'fs';

if (!process.env.DATABASE_URL) {
    throw new Error('Environment variable DATABASE_URL not found');
}

const pool = new pg.Pool({
    connectionString: process.env.DATABASE_URL
});

export const bootstrap = async () => {

    const res = await query('SELECT * from contacts');
    if (!res.rowCount) {
        console.log('Bootstrapping database');
        const schema = fs.readFileSync('db/schema.sql');
        await query(schema.toString('utf-8'))
    }
}

export const query = (text, params, callback) => {
    return pool.query(text, params, callback);
};