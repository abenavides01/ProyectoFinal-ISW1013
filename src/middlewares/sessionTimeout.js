const { registrarEvento } = require('../utils/logger');

const TIMEOUT_MS = 5 * 60 * 1000; // 5 minutos

const sessionTimeout = async (req, res, next) => {
  const token = req.cookies?.token;

  if (!token) return next();

  const ultimaActividad = req.cookies?.ultima_actividad;

  if (ultimaActividad) {
    const ahora = Date.now();
    const diferencia = ahora - parseInt(ultimaActividad);

    if (diferencia > TIMEOUT_MS) {
      // Sesión expirada por inactividad
      res.clearCookie('token');
      res.clearCookie('ultima_actividad');

      await registrarEvento({
        evento: 'SESION_EXPIRADA',
        descripcion: 'Sesión cerrada por inactividad de 5 minutos',
        ip_origen: req.ip,
        usuario_id: req.usuario?.id,
        ruta: req.originalUrl
      });

      return res.status(401).json({
        error: 'Sesión expirada por inactividad. Por favor iniciá sesión nuevamente.'
      });
    }
  }

  // Actualizar timestamp de última actividad
  res.cookie('ultima_actividad', Date.now().toString(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: TIMEOUT_MS
  });

  next();
};

module.exports = { sessionTimeout };