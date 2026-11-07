const projectService = require('../services/project.service');

exports.createProject = async (req, res) => {
    try {
        const { nombre, descripcion } = req.body;
        const administrador_id = req.user.id; // el administrador sale del token
        const project = await projectService.createProject({ nombre, descripcion, administrador_id });
        res.status(201).json({ message: 'Proyecto creado exitosamente', project });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getAllProjects = async (req, res) => {
    const admin_from_token = req.user.id;
    try {
        const projects = await projectService.getAllProjects(admin_from_token);
        res.status(200).json({ projects });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getMyProjects = async (req, res) => {
    try {
        const projects = await projectService.getProjectsByUserId(req.user.id);
        res.status(200).json({ projects });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getProjectById = async (req, res) => {
    const { id } = req.params;
    try {
        const project = await projectService.getProjectById(id, req.user.id);
        res.status(200).json({ project });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updateProject = async (req, res) => {
    const { id } = req.params;
    const { nombre, descripcion } = req.body;
    const admin_from_token = req.user.id;
    try {
        const project = await projectService.updateProject({ id, nombre, descripcion, admin_from_token });
        res.status(200).json({ message: 'Proyecto actualizado exitosamente', project });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.deleteProject = async (req, res) => {
    const { id } = req.params;
    const admin_from_token = req.user.id;
    try {
        const result = await projectService.deleteProject(id, admin_from_token);
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.assignUsersToProject = async (req, res) => {
    const { proyecto_id, usuarios_ids } = req.body;
    const admin_from_token = req.user.id;
    try {
        const result = await projectService.assignUsersToProject({ proyecto_id, usuarios_ids, admin_from_token });
        res.status(200).json({ message: 'Asignación procesada', ...result });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.removeUserFromProject = async (req, res) => {
    const { proyecto_id, usuario_id } = req.body;
    const admin_from_token = req.user.id;
    try {
        const result = await projectService.removeUserFromProject({ proyecto_id, usuario_id, admin_from_token });
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};