const crypto = require('crypto');
const env = require('../config/env');

function timingSafeEqual(a, b) {
  const bufferA = Buffer.from(a);
  const bufferB = Buffer.from(b);

  if (bufferA.length !== bufferB.length) {
    return false;
  }

  return crypto.timingSafeEqual(bufferA, bufferB);
}

function adminAuth(req, res, next) {
  const password = req.header('x-admin-password');

  if (!password) {
    return res.status(401).json({
      error: 'Senha de administrador ausente.'
    });
  }

  if (!timingSafeEqual(password, env.adminPassword)) {
    return res.status(401).json({
      error: 'Senha de administrador invalida.'
    });
  }

  return next();
}

module.exports = adminAuth;
