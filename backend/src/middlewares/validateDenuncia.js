const { sanitizeText } = require('../utils/sanitize');

function validateDenuncia(req, res, next) {
  const nome = sanitizeText(req.body.nome, 120);
  const descricao = sanitizeText(req.body.descricao, 5000);

  if (!descricao) {
    return res.status(400).json({
      error: 'A descricao da denuncia e obrigatoria.'
    });
  }

  req.sanitizedBody = {
    nome,
    descricao
  };

  return next();
}

module.exports = validateDenuncia;
