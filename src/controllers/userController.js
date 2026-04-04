const bcrypt = require('bcryptjs');
const { Usuario } = require('../models');
const { registrarEvento } = require('../utils/logger');

const ROLES_VALIDOS = ['SuperAdmin', 'Auditor', 'Registrador'];

const validarUsuario = ({ username, email, password, rol }, esActualizacion = false) => {
  const errores = [];

  if (!username || typeof username !== 'string' || username.trim().length < 3) {
    errores.push('El username es obligatorio y debe tener al menos 3 caracteres.');
  }

  if (!email || typeof email !== 'string' || !/^\S+@\S+\.\S+$/.test(email.trim())) {
    errores.push('El email es obligatorio y debe tener un formato válido.');
  }

  if (!esActualizacion || password !== undefined) {
    if (!password || typeof password !== 'string' || password.length < 8) {
      errores.push('La contraseña es obligatoria y debe tener al menos 8 caracteres.');
    }
  }

  if (!rol || !ROLES_VALIDOS.includes(rol)) {
    errores.push('El rol es obligatorio y debe ser SuperAdmin, Auditor o Registrador.');
  }

  return errores;
};

const obtenerUsuarios = async (req, res) => {
  try {
    const usuarios = await Usuario.findAll({
      attributes: ['id', 'username', 'email', 'rol', 'ultimo_login', 'ultimo_login_ip', 'createdAt', 'updatedAt'],
      order: [['createdAt', 'DESC']]
    });

    return res.status(200).json(usuarios);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Error obteniendo usuarios.' });
  }
};

const obtenerUsuarioPorId = async (req, res) => {
  try {
    const { id } = req.params;

    const usuario = await Usuario.findByPk(id, {
      attributes: ['id', 'username', 'email', 'rol', 'ultimo_login', 'ultimo_login_ip', 'createdAt', 'updatedAt']
    });

    if (!usuario) {
      return res.status(404).json({ error: 'Usuario no encontrado.' });
    }

    return res.status(200).json(usuario);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Error obteniendo usuario.' });
  }
};

const crearUsuario = async (req, res) => {
  try {
    const { username, email, password, rol } = req.body;

    const errores = validarUsuario({ username, email, password, rol }, false);
    if (errores.length > 0) {
      return res.status(400).json({ errores });
    }

    const hash = await bcrypt.hash(password, 12);

    const usuario = await Usuario.create({
      username: username.trim(),
      email: email.trim(),
      password: hash,
      rol
    });

    await registrarEvento({
      evento: 'CREACION_USUARIO',
      descripcion: `Usuario creado: ${usuario.username} con rol ${usuario.rol}`,
      ip_origen: req.ip,
      usuario_id: req.usuario.id,
      ruta: req.originalUrl
    });

    return res.status(201).json({
      mensaje: 'Usuario creado exitosamente.',
      usuario: {
        id: usuario.id,
        username: usuario.username,
        email: usuario.email,
        rol: usuario.rol
      }
    });
  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({ error: 'El username o email ya están en uso.' });
    }

    console.error(error);
    return res.status(500).json({ error: 'Error creando usuario.' });
  }
};

const actualizarUsuario = async (req, res) => {
  try {
    const { id } = req.params;
    const { username, email, password, rol } = req.body;

    const usuario = await Usuario.findByPk(id);

    if (!usuario) {
      return res.status(404).json({ error: 'Usuario no encontrado.' });
    }

    const errores = validarUsuario({ username, email, password, rol }, true);
    if (errores.length > 0) {
      return res.status(400).json({ errores });
    }

    const datosActualizados = {
      username: username.trim(),
      email: email.trim(),
      rol
    };

    if (password) {
      datosActualizados.password = await bcrypt.hash(password, 12);
    }

    await usuario.update(datosActualizados);

    await registrarEvento({
      evento: 'ACTUALIZACION_USUARIO',
      descripcion: `Usuario actualizado: ${usuario.username}`,
      ip_origen: req.ip,
      usuario_id: req.usuario.id,
      ruta: req.originalUrl
    });

    return res.status(200).json({
      mensaje: 'Usuario actualizado exitosamente.',
      usuario: {
        id: usuario.id,
        username: usuario.username,
        email: usuario.email,
        rol: usuario.rol,
        ultimo_login: usuario.ultimo_login,
        ultimo_login_ip: usuario.ultimo_login_ip
      }
    });
  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({ error: 'El username o email ya están en uso.' });
    }

    console.error(error);
    return res.status(500).json({ error: 'Error actualizando usuario.' });
  }
};

const eliminarUsuario = async (req, res) => {
  try {
    const { id } = req.params;

    const usuario = await Usuario.findByPk(id);

    if (!usuario) {
      return res.status(404).json({ error: 'Usuario no encontrado.' });
    }

    const usernameEliminado = usuario.username;

    await usuario.destroy();

    await registrarEvento({
      evento: 'ELIMINACION_USUARIO',
      descripcion: `Usuario eliminado: ${usernameEliminado}`,
      ip_origen: req.ip,
      usuario_id: req.usuario.id,
      ruta: req.originalUrl
    });

    return res.status(200).json({
      mensaje: 'Usuario eliminado exitosamente.'
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Error eliminando usuario.' });
  }
};

module.exports = {
  obtenerUsuarios,
  obtenerUsuarioPorId,
  crearUsuario,
  actualizarUsuario,
  eliminarUsuario
};