const express = require('express');
const router = express.Router();

const { verificarToken } = require('../middlewares/auth');
const { verificarRol } = require('../middlewares/roles');
const { csrfProtection } = require('../middlewares/csrfProtection');
const {
  obtenerUsuarios,
  obtenerUsuarioPorId,
  crearUsuario,
  actualizarUsuario,
  eliminarUsuario
} = require('../controllers/userController');

router.get(
  '/',
  verificarToken,
  verificarRol('SuperAdmin', 'Auditor', 'Registrador'),
  obtenerUsuarios
);

router.get(
  '/:id',
  verificarToken,
  verificarRol('SuperAdmin', 'Auditor', 'Registrador'),
  obtenerUsuarioPorId
);

router.post(
  '/',
  verificarToken,
  csrfProtection,
  verificarRol('SuperAdmin'),
  crearUsuario
);

router.put(
  '/:id',
  verificarToken,
  csrfProtection,
  verificarRol('SuperAdmin'),
  actualizarUsuario
);

router.delete(
  '/:id',
  verificarToken,
  csrfProtection,
  verificarRol('SuperAdmin'),
  eliminarUsuario
);

module.exports = router;