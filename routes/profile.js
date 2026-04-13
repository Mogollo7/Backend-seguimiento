'use strict';

let express = require('express');
let router = express.Router();
let auth = require('../middleware/auth');
let User = require('../models/User');

// GET /profile
// Retorna username y email del usuario autenticado
router.get('/', auth, async (req, res) => {
try {
    let user = await User.findById(req.user.id).select('-password');
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

module.exports = router;