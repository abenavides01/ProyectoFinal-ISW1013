const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Usuario = sequelize.define('Usuario', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  username: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true
  },
  password: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  email: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true
  },
  rol: {
    type: DataTypes.ENUM('SuperAdmin', 'Auditor', 'Registrador'),
    allowNull: false,
    defaultValue: 'Registrador'
  },
  ultimo_login: {
    type: DataTypes.DATE,
    allowNull: true
  },
  ultimo_login_ip: {
    type: DataTypes.STRING(45),
    allowNull: true
  }
}, {
  tableName: 'usuarios',
  timestamps: true
});

module.exports = Usuario;