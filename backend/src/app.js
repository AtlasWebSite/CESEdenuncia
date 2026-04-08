const express = require('express');
const helmet = require('helmet');
const path = require('path');
const env = require('./config/env');
const denunciasRoutes = require('./routes/denunciasRoutes');
const notFound = require('./middlewares/notFound');
const errorHandler = require('./middlewares/errorHandler');

const app = express();
const frontendIndexPath = path.join(env.frontendPath, 'index.html');

app.disable('x-powered-by');
app.use(helmet({
  contentSecurityPolicy: false
}));
app.use(express.json({
  limit: '1mb'
}));
app.use(express.urlencoded({
  extended: false
}));
app.use(express.static(env.frontendPath));

app.get('/health', (req, res) => {
  return res.json({
    status: 'ok'
  });
});

app.use('/', denunciasRoutes);

app.get('*', (req, res, next) => {
  if (req.path.startsWith('/denuncias')) {
    return next();
  }

  if (req.path === '/export') {
    return next();
  }

  return res.sendFile(frontendIndexPath);
});

app.use(notFound);
app.use(errorHandler);

module.exports = app;
