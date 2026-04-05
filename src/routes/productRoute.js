const express = require('express');
const router = express.Router();

const { verificarToken } = require('../middlewares/auth');
const { verificarRol } = require('../middlewares/roles');
const { csrfProtection } = require('../middlewares/csrfProtection');
const {
  obtenerProductos,
  obtenerProductoPorId,
  crearProducto,
  actualizarProducto,
  eliminarProducto
} = require('../controllers/productController');

router.get(
  '/',
  verificarToken,
  verificarRol('SuperAdmin', 'Auditor', 'Registrador'),
  obtenerProductos
);

router.get(
  '/:id',
  verificarToken,
  verificarRol('SuperAdmin', 'Auditor', 'Registrador'),
  obtenerProductoPorId
);

router.post(
  '/',
  verificarToken,
  csrfProtection,
  verificarRol('SuperAdmin', 'Registrador'),
  crearProducto
);

router.put(
  '/:id',
  verificarToken,
  csrfProtection,
  verificarRol('SuperAdmin', 'Registrador'),
  actualizarProducto
);

router.delete(
  '/:id',
  verificarToken,
  csrfProtection,
  verificarRol('SuperAdmin', 'Registrador'),
  eliminarProducto
);

module.exports = router;