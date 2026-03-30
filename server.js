require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const sequelize = require('./src/config/database');
require('./src/models/index');

const app = express();
const PORT = process.env.PORT || 3000;

// Seguridad
app.use(helmet());

// Parseo de JSON y cookies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Archivos estáticos
app.use(express.static('public'));

// Rutas
app.use('/api', require('./src/routes/index'));

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

sequelize.authenticate()
  .then(() => console.log('Conexión a la base de datos exitosa'))
  .catch(err => console.error('Error conectando a la BD:', err));