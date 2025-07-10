const pool = require('./db/pool');

async function populateDB() {
    try {
        // Clear existing data
        await pool.query('DELETE FROM usernames');
        
        // Add sample usernames
        const usernames = ['alice', 'bob', 'charlie', 'diana', 'eve'];
        
        for (const username of usernames) {
            await pool.query('INSERT INTO usernames (username) VALUES ($1)', [username]);
        }
        
        console.log('Database populated successfully!');
    } catch (error) {
        console.error('Error:', error);
    } finally {
        await pool.end(); // Properly close the pool
        process.exit();
    }
}

populateDB();