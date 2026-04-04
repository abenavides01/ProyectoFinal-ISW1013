const express = require('express');
const router = express.Router();

const { verificarToken } = require('../middlewares/auth');
const { verificarRol } = require('../middlewares/roles');
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
  verificarRol('SuperAdmin'),
  crearUsuario
);

router.put(
  '/:id',
  verificarToken,
  verificarRol('SuperAdmin'),
  actualizarUsuario
);

router.delete(
  '/:id',
  verificarToken,
  verificarRol('SuperAdmin'),
  eliminarUsuario
);

module.exports = router;