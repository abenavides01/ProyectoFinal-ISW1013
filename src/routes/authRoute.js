const express = require('express');
const router = express.Router();
const { registro, login, logout } = require('../controllers/authController');
const { verificarToken } = require('../middlewares/auth');

//rutas de autenticación
router.post('/registro', registro);
router.post('/login', login);
router.post('/logout', verificarToken, logout);

module.exports = router;