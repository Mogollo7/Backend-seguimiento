'use strict';

let express = require('express');
let mongoose = require('mongoose');
require('dotenv').config();

let app = express();
app.use(express.json());

app.use('/auth', require('./routes/auth'));
app.use('/profile', require('./routes/profile'));
app.use('/home', require('./routes/home'));

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB conectado'))
  .catch(err => console.log('Error MongoDB:', err));

// Captura errores no manejados
process.on('uncaughtException', (err) => {
  console.log('Error no manejado:', err);
});

app.listen(3000, () => console.log('Servidor en puerto 3000'));