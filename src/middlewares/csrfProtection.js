const { registrarEvento } = require('../utils/logger');

const metodosProtegidos = ['POST', 'PUT', 'DELETE', 'PATCH'];

const csrfProtection = async (req, res, next) => {
  try {
    if (!metodosProtegidos.includes(req.method)) {
      return next();
    }

    const origin = req.get('origin');
    const referer = req.get('referer');
    const host = req.get('host');

    const origenValido = origin && origin.includes(host);
    const refererValido = referer && referer.includes(host);

    if (origenValido || refererValido) {
      return next();
    }

    await registrarEvento({
      evento: 'CSRF_BLOQUEADO',
      descripcion: `Petición bloqueada por validación CSRF en ${req.method} ${req.originalUrl}`,
      ip_origen: req.ip,
      usuario_id: req.usuario?.id,
      ruta: req.originalUrl
    });

    return res.status(403).json({
      error: 'Petición bloqueada por política CSRF. Origin o Referer inválido.'
    });
  } catch (error) {
    console.error('Error en middleware CSRF:', error);
    return res.status(500).json({
      error: 'Error interno validando protección CSRF.'
    });
  }
};

module.exports = { csrfProtection };