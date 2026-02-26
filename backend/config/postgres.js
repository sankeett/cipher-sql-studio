const { Pool } = require('pg');

const pool = new Pool({
  user: process.env.SANDBOX_DB_USER,
  host: process.env.SANDBOX_DB_HOST,
  database: process.env.SANDBOX_DB_NAME,
  password: process.env.SANDBOX_DB_PASSWORD,
  port: process.env.SANDBOX_DB_PORT,
});

module.exports = pool;
