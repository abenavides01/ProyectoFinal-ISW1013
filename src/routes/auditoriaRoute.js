const express = require('express');
const router = express.Router();
const { verificarToken } = require('../middlewares/auth');
const { verificarRol } = require('../middlewares/roles');
const { LogAuditoria } = require('../models/index');

// Solo SuperAdmin puede ver los logs (RF-06)
router.get('/', verificarToken, verificarRol('SuperAdmin'), async (req, res) => {
  try {
    const logs = await LogAuditoria.findAll({
      order: [['createdAt', 'DESC']],
      limit: 100
    });
    return res.status(200).json(logs);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Error obteniendo logs de auditoría.' });
  }
});

module.exports = router;