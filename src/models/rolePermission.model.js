const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
 
const RolePermission = sequelize.define('roles_permisos', {
    rol_id: { type: DataTypes.INTEGER, primaryKey: true, allowNull: false },
    permiso_id: { type: DataTypes.INTEGER, primaryKey: true, allowNull: false }
}, {
    timestamps: false,
    tableName: 'roles_permisos',
});
 
module.exports = RolePermission;
 