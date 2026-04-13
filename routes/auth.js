'use strict';

let express = require('express');
let router = express.Router();
let bcrypt = require('bcryptjs');
let jwt = require('jsonwebtoken');
let User = require('../models/User');

// ─── SIGNUP ───────────────────────────────────────────
router.post('/signup', async (req, res) => {
  let { username, email, password } = req.body;

  try {
    let existe = await User.findOne({ email });
    if (existe) return res.status(400).json({ msg: 'Usuario ya existe' });

    let salt = await bcrypt.genSalt(10);
    let hashedPassword = await bcrypt.hash(password, salt);

    let user = new User({ username, email, password: hashedPassword });
    await user.save();

    let token = jwt.sign(
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
  let { username, password } = req.body;

  try {
    let user = await User.findOne({ username });
    if (!user) return res.status(400).json({ msg: 'Credenciales inválidas' });

    let match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ msg: 'Credenciales inválidas' });

    let token = jwt.sign(
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