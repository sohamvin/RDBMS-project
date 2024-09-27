
const { Pool } = require('pg');

require('dotenv').config();

// Create a new pool using environment variables or hardcoded values
const pool = new Pool({
    user: process.env.PGUSER,
    host: process.env.PGHOST,
    database: process.env.PGDATABASE,
    password: process.env.PGPASSWORD,
    port: process.env.PGPORT,
});

module.exports = {
    query: (text, params) => pool.query(text, params),
    end: () => pool.end(),  // Add this line to properly end the pool connection
};
