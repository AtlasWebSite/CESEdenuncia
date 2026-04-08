const pool = require('./pool');

const createTableQuery = `
  CREATE TABLE IF NOT EXISTS denuncias (
    id BIGSERIAL PRIMARY KEY,
    nome VARCHAR(120),
    descricao TEXT NOT NULL,
    data TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
  );
`;

async function initializeDatabase() {
  await pool.query(createTableQuery);
}

module.exports = initializeDatabase;
