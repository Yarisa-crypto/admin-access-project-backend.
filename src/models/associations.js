const User = require('./user.model');
const Project = require('./project.model');
const UserProject = require('./userProject.model');

// Relación muchos a muchos entre User y Project a través de UserProject
User.belongsToMany(Project, { through: UserProject, foreignKey: 'usuario_id',as: 'proyectos' });
Project.belongsToMany(User, { through: UserProject, foreignKey: 'proyecto_id',as: 'usuarios' });

//Relación de administrador
Project.belongsTo(User, { foreignKey: 'administrador_id', as: 'administrador' });

module.exports = { User, Project, UserProject };