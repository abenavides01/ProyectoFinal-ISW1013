const express = require('express');
const router = express.Router();

const authRoutes = require('./authRoute');
const auditoriaRoutes = require('./auditoriaRoute');

router.use('/auth', authRoutes);
router.use('/auditoria', auditoriaRoutes);

module.exports = router;