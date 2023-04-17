const { Client } = require('pg');
const { migrate } = require('postgres-migrations')
const { join } = require('path');

const pathToMigrations = join(__dirname, 'migrations');

async function Migrate() {
    const pgClient = new Client({connectionString: process.env.DB_URL});
    
    await pgClient.connect()

    try {
        await migrate({client: pgClient}, pathToMigrations)
        console.log('Migrations applied');
    } catch (error) {
        console.error(error.message);
        console.log('Error during applying migrations');
    } finally {
        await pgClient.end();
    }
    return
}

module.exports = Migrate;
