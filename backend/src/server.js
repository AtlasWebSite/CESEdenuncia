const app = require('./app');
const env = require('./config/env');
const initializeDatabase = require('./db/init');

async function startServer() {
  await initializeDatabase();

  app.listen(env.port, '0.0.0.0', () => {
    console.log(`Servidor iniciado na porta ${env.port}`);
  });
}

startServer().catch((error) => {
  console.error('Falha ao iniciar o servidor:', error);
  process.exit(1);
});
