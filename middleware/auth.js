'use strict';

let jwt = require('jsonwebtoken');

module.exports = function(req, res, next) {
  let token = req.header('Authorization');
  if (!token) return res.status(401).json({ msg: 'No hay token' });

  // Extraer token de "Bearer <token>"
  if (token.startsWith('Bearer ')) {
    token = token.slice(7);
  }

  try {
    let decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ msg: 'Token inválido' });
  }
};