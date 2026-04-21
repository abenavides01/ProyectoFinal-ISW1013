const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Usuario } = require('../models/index');
const { registrarEvento } = require('../utils/logger');

const registro = async (req, res) => {
    try {
        const { username, password, email, rol } = req.body;

        // Validaciones básicas
        if (!username || !password || !email) {
            return res.status(400).json({ error: 'Username, password y email son obligatorios.' });
        }

        if (password.length < 8) {
            return res.status(400).json({ error: 'La contraseña debe tener al menos 8 caracteres.' });
        }

        // Hash de la contraseña con bcrypt (factor de costo 12, cumple RF-02)
        const hash = await bcrypt.hash(password, 12);

        const usuario = await Usuario.create({
            username,
            password: hash,
            email,
            rol: rol || 'Registrador'
        });

        await registrarEvento({
            evento: 'REGISTRO_USUARIO',
            descripcion: `Usuario ${username} creado con rol ${usuario.rol}`,
            ip_origen: req.ip,
            usuario_id: usuario.id
        });

        return res.status(201).json({ mensaje: 'Usuario creado exitosamente.', id: usuario.id });

    } catch (err) {
        if (err.name === 'SequelizeUniqueConstraintError') {
            return res.status(400).json({ error: 'El username o email ya están en uso.' });
        }
        console.error(err);
        return res.status(500).json({ error: 'Error interno del servidor.' });
    }
};

const login = async (req, res) => {
    try {
        const { username, password } = req.body;
        const ip = req.ip;

        if (!username || !password) {
            return res.status(400).json({ error: 'Username y password son obligatorios.' });
        }

        const usuario = await Usuario.findOne({ where: { username } });

        // Si no existe el usuario
        if (!usuario) {
            await registrarEvento({
                evento: 'LOGIN_FALLIDO',
                descripcion: `Intento de login con username inexistente: ${username}`,
                ip_origen: ip
            });
            return res.status(401).json({ error: 'Credenciales incorrectas.' });
        }

        // Verificar contraseña
        const passwordValido = await bcrypt.compare(password, usuario.password);

        if (!passwordValido) {
            await registrarEvento({
                evento: 'LOGIN_FALLIDO',
                descripcion: `Contraseña incorrecta para usuario: ${username}`,
                ip_origen: ip,
                usuario_id: usuario.id
            });
            return res.status(401).json({ error: 'Credenciales incorrectas.' });
        }

        // Actualizar último login e IP
        await usuario.update({
            ultimo_login: new Date(),
            ultimo_login_ip: ip
        });

        // Generar JWT (guardado en cookie HttpOnly, cumple RS-05)
        const token = jwt.sign(
            { id: usuario.id, username: usuario.username, rol: usuario.rol },
            process.env.JWT_SECRET,
            { algorithm: 'HS256', expiresIn: process.env.JWT_EXPIRES_IN }
        );

        res.cookie('token', token, {
            httpOnly: true,   // No accesible desde JS del cliente
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 60 * 60 * 1000 // 1 hora
        });

        // Cookie de última actividad para el timeout de sesión
        res.cookie('ultima_actividad', Date.now().toString(), {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 60 * 60 * 1000
        });

        await registrarEvento({
            evento: 'LOGIN_EXITOSO',
            descripcion: `Usuario ${username} inició sesión`,
            ip_origen: ip,
            usuario_id: usuario.id
        });

        return res.status(200).json({
            mensaje: 'Login exitoso.',
            usuario: { id: usuario.id, username: usuario.username, rol: usuario.rol }
        });

    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Error interno del servidor.' });
    }
};

const logout = (req, res) => {
    res.clearCookie('token');
    return res.status(200).json({ mensaje: 'Sesión cerrada exitosamente.' });
};

const me = (req, res) => {
  return res.status(200).json({ usuario: req.usuario });
};

module.exports = { registro, login, logout, me };