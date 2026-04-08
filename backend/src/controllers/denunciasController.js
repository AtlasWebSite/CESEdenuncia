const denunciasService = require('../services/denunciasService');

async function createDenuncia(req, res) {
  const denuncia = await denunciasService.createDenuncia(req.sanitizedBody);

  return res.status(201).json({
    message: 'Denuncia enviada com seguranca.',
    denuncia
  });
}

async function listDenuncias(req, res) {
  const denuncias = await denunciasService.listDenuncias();

  return res.json({
    total: denuncias.length,
    denuncias
  });
}

async function deleteDenuncia(req, res) {
  const id = Number(req.params.id);

  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({
      error: 'Identificador invalido.'
    });
  }

  const deleted = await denunciasService.deleteDenunciaById(id);

  if (!deleted) {
    return res.status(404).json({
      error: 'Denuncia nao encontrada.'
    });
  }

  return res.json({
    message: 'Denuncia removida com sucesso.'
  });
}

async function deleteAllDenuncias(req, res) {
  const deletedCount = await denunciasService.deleteAllDenuncias();

  return res.json({
    message: 'Todas as denuncias foram removidas.',
    deletedCount
  });
}

async function exportDenuncias(req, res) {
  const denuncias = await denunciasService.listDenuncias();

  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Content-Disposition', 'attachment; filename="denuncias.json"');

  return res.status(200).send(JSON.stringify({
    exportedAt: new Date().toISOString(),
    total: denuncias.length,
    denuncias
  }, null, 2));
}

module.exports = {
  createDenuncia,
  listDenuncias,
  deleteDenuncia,
  deleteAllDenuncias,
  exportDenuncias
};
