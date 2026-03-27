const sequelize = require('../config/database');
const Usuario = require('./user');
const Producto = require('./product');
const LogAuditoria = require('./logAudit');

// Sincronizar modelos con la base de datos
// alter: true actualiza las tablas si hay cambios sin borrar datos
sequelize.sync({ alter: true })
  .then(() => console.log('Tablas sincronizadas con la base de datos'))
  .catch(err => console.error('Error sincronizando tablas:', err));

module.exports = { Usuario, Producto, LogAuditoria, sequelize };