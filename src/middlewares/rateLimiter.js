const rateLimit = require('express-rate-limit');
const { registrarEvento } = require('../utils/logger');

const loginLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // ventana de 5 minutos
  max: 5, // máximo 5 intentos
  skipSuccessfulRequests: true, // no cuenta los logins exitosos
  handler: async (req, res) => {
    await registrarEvento({
      evento: 'BLOQUEO_RATE_LIMIT',
      descripcion: `IP bloqueada por exceso de intentos de login fallidos`,
      ip_origen: req.ip,
      ruta: req.originalUrl
    });
    return res.status(429).json({
      error: 'Demasiados intentos fallidos. Tu IP ha sido bloqueada por 5 minutos.'
    });
  }
});

module.exports = { loginLimiter };