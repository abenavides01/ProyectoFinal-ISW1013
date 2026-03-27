require('dotenv').config();
require('./src/models/index'); // Carga modelos y sincroniza tablas
const express = require('express');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');

const app = express();
const PORT = process.env.PORT || 3000;
const sequelize = require('./src/config/database');

// Seguridad: headers HTTP automáticos (cubre RS-06 completo)
app.use(helmet());

// Parseo de JSON y cookies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Ruta de prueba
app.get('/', (req, res) => {
  res.json({ mensaje: 'Servidor funcionando correctamente' });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

sequelize.authenticate()
  .then(() => console.log('Conexión a la base de datos exitosa'))
  .catch(err => console.error('Error conectando a la BD:', err));