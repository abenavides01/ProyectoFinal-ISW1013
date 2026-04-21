const express = require('express');
const router = express.Router();

const { registro, login, logout, me } = require('../controllers/authController');
const { verificarToken } = require('../middlewares/auth');
const { loginLimiter } = require('../middlewares/rateLimiter');
const { csrfProtection } = require('../middlewares/csrfProtection');

router.post('/registro', csrfProtection, registro);
router.post('/login', csrfProtection, loginLimiter, login);
router.post('/logout', verificarToken, csrfProtection, logout);
router.get('/me', verificarToken, me);

module.exports = router;