const userService = require('../services/user.service');

// Quita el hash de la contraseña antes de responder
const sinPassword = (user) => {
    const { password, ...datos } = user.toJSON();
    return datos;
};
 


exports.createUser = async (req, res) => {
    try {
        const { nombre, email, password, rol_id, administrador_id } = req.body;
        const newUser = await userService.createUser(nombre, email, password, rol_id, administrador_id);
        res.status(201).json({ message: 'Usuario creado exitosamente', user: sinPassword(newUser) });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updateUser = async (req, res) => {
    const { id } = req.params;
    const { nombre, email, rol_id, administrador_id } = req.body;
    const admin_from_token = req.user.id; // Obtener el ID del administrador desde el token
    try{
        const user = await userService.updateUser(id, nombre, email, rol_id, administrador_id, admin_from_token);
        res.status(200).json({ message: 'Usuario actualizado exitosamente', user: sinPassword(user) });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }   
};

exports.getAllUsersByAdministradorId = async (req, res) => {
    const admin_from_token = req.user.id; // Obtener el ID del administrador desde el token
    const { email } = req.query; // Obtener el email desde los parámetros de consulta
    try {
        const users = await userService.getAllUsersByAdministrador_id(admin_from_token, email);
        res.status(200).json({ users });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
 
exports.deleteUser = async (req, res) => {
    const { id } = req.params;
    const admin_from_token = req.user.id;
    try {
        const result = await userService.deleteUser(id, admin_from_token);
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
 
exports.getUserAllRolById = async (req, res) => {
    const { id } = req.params; // id del rol
    try {
        const users = await userService.getAllUsersByRolId(id);
        res.status(200).json({ users });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};