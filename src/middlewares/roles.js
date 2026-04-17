const { registrarEvento } = require('../utils/logger');

const verificarRol = (...rolesPermitidos) => {
  return async (req, res, next) => {
    if (!req.usuario) {
      return res.status(401).json({ error: 'No autenticado.' });
    }

    if (!rolesPermitidos.includes(req.usuario.rol)) {
      await registrarEvento({
        evento: 'ACCESO_DENEGADO',
        descripcion: `Acceso denegado para usuario ${req.usuario.username} con rol ${req.usuario.rol}`,
        ip_origen: req.ip,
        usuario_id: req.usuario.id,
        ruta: req.originalUrl
      });

      return res.status(403).json({
        error: 'No tienes permisos para realizar esta acción.'
      });
    }

    next();
  };
};

module.exports = { verificarRol };