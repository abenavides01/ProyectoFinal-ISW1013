const { Producto } = require('../models');
const { registrarEvento } = require('../utils/logger');

const validarProducto = ({ codigo, nombre, cantidad, precio }) => {
  const errores = [];

  if (!codigo || typeof codigo !== 'string' || !/^[a-zA-Z0-9-]+$/.test(codigo.trim())) {
    errores.push('El código es obligatorio y debe ser alfanumérico.');
  }

  if (!nombre || typeof nombre !== 'string' || nombre.trim().length < 3) {
    errores.push('El nombre es obligatorio y debe tener al menos 3 caracteres.');
  }

  if (cantidad === undefined || !Number.isInteger(Number(cantidad)) || Number(cantidad) < 0) {
    errores.push('La cantidad debe ser un número entero mayor o igual a 0.');
  }

  if (precio === undefined || isNaN(Number(precio)) || Number(precio) < 0) {
    errores.push('El precio debe ser un número mayor o igual a 0.');
  }

  return errores;
};

const obtenerProductos = async (req, res) => {
  try {
    const productos = await Producto.findAll({
      order: [['createdAt', 'DESC']]
    });

    return res.status(200).json(productos);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Error obteniendo productos.' });
  }
};

const obtenerProductoPorId = async (req, res) => {
  try {
    const { id } = req.params;

    const producto = await Producto.findByPk(id);

    if (!producto) {
      return res.status(404).json({ error: 'Producto no encontrado.' });
    }

    return res.status(200).json(producto);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Error obteniendo el producto.' });
  }
};

const crearProducto = async (req, res) => {
  try {
    const { codigo, nombre, descripcion, cantidad, precio } = req.body;

    const errores = validarProducto({ codigo, nombre, cantidad, precio });
    if (errores.length > 0) {
      return res.status(400).json({ errores });
    }

    const producto = await Producto.create({
      codigo: codigo.trim(),
      nombre: nombre.trim(),
      descripcion: descripcion?.trim() || '',
      cantidad: Number(cantidad),
      precio: Number(precio)
    });

    await registrarEvento({
      evento: 'CREACION_PRODUCTO',
      descripcion: `Producto creado: ${producto.nombre} (${producto.codigo})`,
      ip_origen: req.ip,
      usuario_id: req.usuario.id,
      ruta: req.originalUrl
    });

    return res.status(201).json({
      mensaje: 'Producto creado exitosamente.',
      producto
    });
  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({ error: 'Ya existe un producto con ese código.' });
    }

    console.error(error);
    return res.status(500).json({ error: 'Error creando producto.' });
  }
};

const actualizarProducto = async (req, res) => {
  try {
    const { id } = req.params;
    const { codigo, nombre, descripcion, cantidad, precio } = req.body;

    const producto = await Producto.findByPk(id);

    if (!producto) {
      return res.status(404).json({ error: 'Producto no encontrado.' });
    }

    const errores = validarProducto({ codigo, nombre, cantidad, precio });
    if (errores.length > 0) {
      return res.status(400).json({ errores });
    }

    await producto.update({
      codigo: codigo.trim(),
      nombre: nombre.trim(),
      descripcion: descripcion?.trim() || '',
      cantidad: Number(cantidad),
      precio: Number(precio)
    });

    await registrarEvento({
      evento: 'ACTUALIZACION_PRODUCTO',
      descripcion: `Producto actualizado: ${producto.nombre} (${producto.codigo})`,
      ip_origen: req.ip,
      usuario_id: req.usuario.id,
      ruta: req.originalUrl
    });

    return res.status(200).json({
      mensaje: 'Producto actualizado exitosamente.',
      producto
    });
  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({ error: 'Ya existe un producto con ese código.' });
    }

    console.error(error);
    return res.status(500).json({ error: 'Error actualizando producto.' });
  }
};

const eliminarProducto = async (req, res) => {
  try {
    const { id } = req.params;

    const producto = await Producto.findByPk(id);

    if (!producto) {
      return res.status(404).json({ error: 'Producto no encontrado.' });
    }

    const nombreProducto = producto.nombre;
    const codigoProducto = producto.codigo;

    await producto.destroy();

    await registrarEvento({
      evento: 'ELIMINACION_PRODUCTO',
      descripcion: `Producto eliminado: ${nombreProducto} (${codigoProducto})`,
      ip_origen: req.ip,
      usuario_id: req.usuario.id,
      ruta: req.originalUrl
    });

    return res.status(200).json({
      mensaje: 'Producto eliminado exitosamente.'
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Error eliminando producto.' });
  }
};

module.exports = {
  obtenerProductos,
  obtenerProductoPorId,
  crearProducto,
  actualizarProducto,
  eliminarProducto
};