const { Op } = require('sequelize');
const Project = require('../models/project.model');
const User = require('../models/user.model');
const UserProject = require('../models/userProject.model');
const ROLES = require('../utils/constants');

exports.createProject = async (data) => {
    try {
        const { nombre, descripcion, administrador_id } = data;

          if (!nombre || !descripcion) {
            throw new Error('El nombre y la descripción son obligatorios');
        }

        if (!administrador_id) {
            throw new Error('El Proyecto debe tener un administrador');
        }
         
        const admin = await User.findByPk(administrador_id);
        if (!admin) {
            throw new Error('El administrador no existe');
        }

        if (admin.rol_id !== ROLES.ADMIN) {
            throw new Error('Solo el administrador puede crear un proyecto');
        }

        const projectExists = await Project.findOne({ where: { nombre, administrador_id } });
        if (projectExists) {
            throw new Error('Ya existe un proyecto con ese nombre');
        }

        const newProject = await Project.create({ nombre, descripcion, administrador_id });

        return newProject;
    } catch (error) {
        throw new Error(`Error al crear el proyecto: ${error.message}`);
    }
};

exports.getAllProjects = async () => {
    try {
        return await Project.findAll();
    } catch (error) {
        throw new Error(`Error al obtener los proyectos: ${error.message}`);
    }
};

exports.getProjectsByUserId = async (userId) => {
        try {
        const participaciones = await UserProject.findAll({
            where: { usuario_id: userId },
            attributes: ['proyecto_id']
        });
        const ids = participaciones.map(p => p.proyecto_id);
 
        return await Project.findAll({
            where: {
                [Op.or]: [
                    { administrador_id: userId },
                    { id: { [Op.in]: ids } }
                ]
            }
        });
    } catch (error) {
        throw new Error(`Error al obtener los proyectos del usuario: ${error.message}`);
    }
};

exports.assignUsersToProject = async (data) => {
    try {
        const { proyecto_id, usuarios_ids, admin_from_token } = data;
 
        const project = await Project.findByPk(proyecto_id);
        if (!project) {
            throw new Error('Proyecto no encontrado');
        }
 
        if (project.administrador_id !== admin_from_token) {
            throw new Error('Acceso denegado, este proyecto no esta bajo tu administracion');
        }
 
        const asignados = [];
        const yaEstaban = [];
 
        for (const usuario_id of usuarios_ids) {
            const user = await User.findByPk(usuario_id);
            if (!user) {
                throw new Error(`El usuario ${usuario_id} no existe`);
            }
 
            const existe = await UserProject.findOne({ where: { usuario_id, proyecto_id } });
 
            if (existe) {
                yaEstaban.push(usuario_id);
            } else {
                await UserProject.create({ usuario_id, proyecto_id });
                asignados.push(usuario_id);
            }
        }
 
        return { asignados, yaEstaban };
    } catch (error) {
        throw new Error(`Error al asignar usuarios: ${error.message}`);
    }
};

exports.removeUserFromProject = async (data) => {
    try {
        const { proyecto_id, usuario_id, admin_from_token } = data;
 
        const project = await Project.findByPk(proyecto_id);
        if (!project) {
            throw new Error('Proyecto no encontrado');
        }
 
        if (project.administrador_id !== admin_from_token) {
            throw new Error('Acceso denegado, este proyecto no esta bajo tu administracion');
        }
 
        const relacion = await UserProject.findOne({ where: { usuario_id, proyecto_id } });
        if (!relacion) {
            throw new Error('El usuario no participa en este proyecto');
        }
 
        await relacion.destroy();
 
        return { message: 'Usuario removido del proyecto' };
    } catch (error) {
        throw new Error(`Error al remover usuario: ${error.message}`);
    }
};

exports.updateProject = async (data) => {
    try {
        const { id, nombre, descripcion, admin_from_token } = data;
 
        const project = await Project.findByPk(id);
        if (!project) {
            throw new Error('Proyecto no encontrado');
        }
 
        if (project.administrador_id !== admin_from_token) {
            throw new Error('Acceso denegado, este proyecto no esta bajo tu administracion');
        }
 
        await project.update({ nombre, descripcion });
 
        return project;
    } catch (error) {
        throw new Error(`Error al actualizar proyecto: ${error.message}`);
    }
};

exports.deleteProject = async (id, admin_from_token) => {
    try {
        const project = await Project.findByPk(id);
        if (!project) {
            throw new Error('Proyecto no encontrado');
        }
 
        if (project.administrador_id !== admin_from_token) {
            throw new Error('Acceso denegado, este proyecto no esta bajo tu administracion');
        }
 
        await UserProject.destroy({ where: { proyecto_id: id } });
        await project.destroy();
 
        return { message: 'Proyecto eliminado correctamente' };
    } catch (error) {
        throw new Error(`Error al eliminar proyecto: ${error.message}`);
    }
};

exports.getProjectById = async (id, userId) => {
    try {
        const project = await Project.findByPk(id);
        if (!project) {
            throw new Error('Proyecto no encontrado');
        }
 
        const esAdmin = project.administrador_id === userId;
        const esParticipante = await UserProject.findOne({
            where: { usuario_id: userId, proyecto_id: id }
        });
 
        if (!esAdmin && !esParticipante) {
            throw new Error('Acceso denegado, no perteneces a este proyecto');
        }
 
        return project;
    } catch (error) {
        throw new Error(`Error al obtener proyecto: ${error.message}`);
    }
};