const express = require('express');
const router = express.Router();
const projectController = require('../controllers/project.controller');
const ROLES = require('../utils/constants');
const { authenticateToken, checkRole } = require('../middleware/auth.middleware');

const onlyAdmin = [authenticateToken, checkRole([ROLES.ADMIN])];
const anyRole = [authenticateToken, checkRole([ROLES.ADMIN, ROLES.USER])];

// Admin
router.post('/projects/create', onlyAdmin, projectController.createProject);
router.put('/projects/update/:id', onlyAdmin, projectController.updateProject);
router.delete('/projects/delete/:id', onlyAdmin, projectController.deleteProject);
router.get('/projects', onlyAdmin, projectController.getAllProjects);

router.post('/projects/associate', onlyAdmin, projectController.assignUsersToProject);
router.delete('/projects/disassociate', onlyAdmin, projectController.removeUserFromProject);

// Admin y User (/mine ANTES de /:id)
router.get('/projects/mine', anyRole, projectController.getMyProjects);
router.get('/projects/:id', anyRole, projectController.getProjectById);

module.exports = router;