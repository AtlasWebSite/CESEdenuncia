const express = require('express');
const adminAuth = require('../middlewares/adminAuth');
const validateDenuncia = require('../middlewares/validateDenuncia');
const controller = require('../controllers/denunciasController');

const router = express.Router();

router.post('/denuncias', validateDenuncia, controller.createDenuncia);
router.get('/denuncias', adminAuth, controller.listDenuncias);
router.delete('/denuncias/:id', adminAuth, controller.deleteDenuncia);
router.delete('/denuncias', adminAuth, controller.deleteAllDenuncias);
router.get('/export', adminAuth, controller.exportDenuncias);

module.exports = router;
