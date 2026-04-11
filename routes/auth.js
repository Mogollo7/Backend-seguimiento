const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// ─── SIGNUP ───────────────────────────────────────────
router.post('/signup', async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const existe = await User.findOne({ email });
    if (existe) return res.status(400).json({ msg: 'Usuario ya existe' });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = new User({ username, email, password: hashedPassword });
    await user.save();

    const token = jwt.sign(
      { id: user._id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.json({ token });
  } catch (err) {
    console.log(err); // ← ahora muestra el error real
    res.status(500).json({ msg: 'Error en el servidor' });
  }
});

// ─── SIGNIN ───────────────────────────────────────────
router.post('/signin', async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });
    if (!user) return res.status(400).json({ msg: 'Credenciales inválidas' });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ msg: 'Credenciales inválidas' });

    const token = jwt.sign(
      { id: user._id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.json({ token });
  } catch (err) {
    console.log(err); // ← ahora muestra el error real
    res.status(500).json({ msg: 'Error en el servidor' });
  }
});

module.exports = router;