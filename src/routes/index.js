const express = require('express');
const router = express.Router();

const authRoutes = require('./authRoute');
const auditoriaRoutes = require('./auditoriaRoute');
const productRoutes = require('./productRoute');
const userRoutes = require('./userRoute');

router.use('/auth', authRoutes);
router.use('/auditoria', auditoriaRoutes);
router.use('/productos', productRoutes);
router.use('/usuarios', userRoutes);

module.exports = router;