const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const LogAuditoria = sequelize.define('LogAuditoria', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  evento: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  descripcion: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  ip_origen: {
    type: DataTypes.STRING(45),
    allowNull: true
  },
  usuario_id: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  ruta: {
    type: DataTypes.STRING(255),
    allowNull: true
  }
}, {
  tableName: 'log_auditoria',
  timestamps: true
});

module.exports = LogAuditoria;