const User = require('../models/user.model');
const bcrypt = require('bcryptjs');

exports.createUser = async (nombre, email, password, rol_id, administrador_id) => {
    try{
        const userExists = await User.findOne({ where: { email } });
        if(userExists){
            throw new Error('El usuario ya existe');
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        
        const newUser = await User.create({
            nombre,
            email,
            password: hashedPassword,
            rol_id,
            administrador_id
        });

        return newUser;
    }catch(error){
        throw new Error(`Error al crear usuario: ${error.message}`);
    }
}

exports.updateUser = async (id, nombre, email, rol_id, administrador_id, admin_from_token) => {
    try{
        const user = await User.findByPk(id);
        if (!user){
            throw new Error('Usuario no encontrado');
        }

        if (user.administrador_id !== admin_from_token) {
            throw new Error(' Acceso denegado, este usuario no esta bajo su administracion');
        }

        if (email && email !== user.email) {
            const emailExists = await User.findOne({ where: { email } });
            if(emailExists){
                throw new Error('El email ya esta en uso');
            }
        }
        await user.update({
            nombre,
            email,
            rol_id,
            administrador_id
        });

        return user;
    }catch(error){
        throw new Error(`Error al actualizar usuario: ${error.message}`);
    }
};

exports.getAllUsersByAdministrador_id = async (administrador_id, email) => {
    try{
        const whereClause = { administrador_id };
        if (email) {
            whereClause.email = email;
        }
        const users = await User.findAll({ where: whereClause, attributes: { exclude: ['password'] } }); 
        return users;
    }catch(error){
        throw new Error(`Error al obtener los usuarios: ${error.message}`);
    }
};

exports.deleteUser = async (id, admin_from_token) => {
    try{
        const user = await User.findByPk(id);
        if (!user){
            throw new Error('Usuario no encontrado');
        }

        if (user.administrador_id !== admin_from_token) {
            throw new Error('Acceso denegado, este usuario no esta bajo su administracion');
        }

        await user.destroy();
        return { message: 'Usuario eliminado correctamente' };
    }catch(error){
        throw new Error(`Error al eliminar usuario: ${error.message}`);
    }  
};

exports.getAllUsersByRolId = async (rol_id) => {
    try{
        const users = await User.findAll({ where: { rol_id }, attributes: { exclude: ['password'] } });
        return users;
    }catch(error){
        throw new Error(`Error al obtener los usuarios: ${error.message}`);
    }
};