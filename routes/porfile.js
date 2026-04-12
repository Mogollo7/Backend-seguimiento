const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/User');

// GET /profile
// Retorna username y email del usuario autenticado
router.get('/', auth, async (req, res) => {
try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) return res.status(404).json({ msg: 'Usuario no encontrado' });

    res.json({
    username: user.username,
    email: user.email
    });
} catch (err) {
    console.log(err);
    res.status(500).json({ msg: 'Error en el servidor' });
}
});

// POST /profile/logout
// Cierra sesión (el cliente debe eliminar el token)
router.post('/logout', auth, (req, res) => {
// JWT es stateless: el cierre de sesión real se maneja en el cliente
// eliminando el token almacenado. Aquí confirmamos la acción.
res.json({ msg: 'Sesión cerrada exitosamente' });
});

module.exports = router;