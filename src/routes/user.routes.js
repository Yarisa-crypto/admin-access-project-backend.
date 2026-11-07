const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const {authenticateToken, checkRole} = require('../middleware/auth.middleware');
const ROLES = require('../utils/constants');
const errorHandler = require('../middleware/error.middleware');

// Rutas de usuarios
router.post('/users/create', authenticateToken, checkRole(ROLES.ADMIN), userController.createUser);
router.put('/users/update/:id', authenticateToken, checkRole(ROLES.ADMIN), userController.updateUser);
router.get('/users', authenticateToken, checkRole(ROLES.ADMIN), userController.getAllUsersByAdministradorId);
router.delete('/users/delete/:id', authenticateToken, checkRole(ROLES.ADMIN), userController.deleteUser);
router.get('/users/rol/:id', authenticateToken, checkRole(ROLES.ADMIN), userController.getUserAllRolById);

// Middleware de manejo de errores
router.use(errorHandler.errorHandler);

module.exports = router;