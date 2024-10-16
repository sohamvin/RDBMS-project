const { Pool } = require('pg');
require('dotenv').config();

// Create a new pool using environment variables or hardcoded values
const pool = new Pool({
    user: process.env.PGUSER,
    host: process.env.PGHOST,
    database: process.env.PGDATABASE,
    password: process.env.PGPASSWORD,
    port: process.env.PGPORT,
    connectionTimeoutMillis: 10000, // 5 seconds timeout
});


// Test the connection
pool.connect((err, client, release) => {
    if (err) {
        console.error('Failed to connect to the database:', err.stack);
    } else {
        console.log('Connected to the database successfully.');
    }
    // Release the client back to the pool
    if (client) release();
});

module.exports = {
    query: (text, params) => pool.query(text, params),
    end: () => pool.end(),  // Properly end the pool connection
};
