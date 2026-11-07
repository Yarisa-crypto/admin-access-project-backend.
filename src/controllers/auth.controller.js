const authService = require('../services/auth.service');
 
exports.login = async (req, res) => {
    const { email, password } = req.body;
 
    if (!email || !password) {
        return res.status(400).json({ message: 'El email y la contraseña son obligatorios' });
    }
 
    try {
        const token = await authService.loginUser(email, password);
        res.status(200).json({ message: 'Inicio de sesión exitoso', token });
    } catch (error) {
        res.status(401).json({ message: error.message });
    }
};