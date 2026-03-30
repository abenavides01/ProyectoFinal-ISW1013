const { LogAuditoria } = require('../models/index');

const registrarEvento = async ({ evento, descripcion, ip_origen, usuario_id, ruta }) => {
  try {
    await LogAuditoria.create({
      evento,
      descripcion,
      ip_origen,
      usuario_id: usuario_id || null,
      ruta: ruta || null
    });
  } catch (err) {
    console.error('Error registrando evento de auditoría:', err);
  }
};

module.exports = { registrarEvento };