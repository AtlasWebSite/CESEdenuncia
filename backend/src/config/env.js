const path = require('path');
const dotenv = require('dotenv');

dotenv.config({
  path: path.resolve(__dirname, '../../.env')
});

const requiredVariables = ['DATABASE_URL', 'ADMIN_PASSWORD'];

requiredVariables.forEach((variableName) => {
  if (process.env[variableName]) {
    return;
  }

  throw new Error(`Variavel de ambiente obrigatoria ausente: ${variableName}`);
});

const env = {
  port: Number(process.env.PORT || 3000),
  databaseUrl: process.env.DATABASE_URL,
  adminPassword: process.env.ADMIN_PASSWORD,
  nodeEnv: process.env.NODE_ENV || 'development',
  frontendPath: path.resolve(__dirname, '../../../frontend')
};

module.exports = env;
