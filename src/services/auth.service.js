const jwt = require('jsonwebtoken');
const bycrpt = require('bcryptjs');
const dotenv = require('dotenv');
const User = require('../models/user.model');
const RolePermission = require('../models/rolePermission.model');

dotenv.config();

const SECRET_KEY = process.env.JWT_SECRET;

exports.loginUser = async (email, password) => {
    try {
        //Verificar si el usuario existe
        const user = await User.findOne({ where: { email } });
        if(!user){
            throw new Error('Usuario no encontrado');
        }

        //Verificar si la contraseña es correcta
        const isPasswordValid = await bycrpt.compare(password, user.password);
        if(!isPasswordValid){
            throw new Error('Contraseña incorrecta');
        }

        // Consultar los permisos del rol
        const rolePermissions = await RolePermission.findAll({ 
            where: { rol_id: user.rol_id },
            attributes: ['permiso_id']
        });

        const permissions = rolePermissions.map(rp => rp.permiso_id);

        // Generar el token JWT 
         const token = jwt.sign(
            { id: user.id,nombre: user.nombre, email: user.email, rol_id: user.rol_id, permissions }, 
            SECRET_KEY, 
            { expiresIn: '1h' }
        );
        

        return token;
    }catch(error){
        throw new Error(error.message || 'Error al iniciar sesión');
    }

}