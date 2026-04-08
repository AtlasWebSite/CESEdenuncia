const { Pool } = require('pg');
const env = require('../config/env');

const useSsl = env.nodeEnv === 'production';

const pool = new Pool({
  connectionString: env.databaseUrl,
  ssl: useSsl ? { rejectUnauthorized: false } : false
});

module.exports = pool;
