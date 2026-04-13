'use strict';

let mongoose = require('mongoose');

let GastoSchema = new mongoose.Schema({
  categoria:    {
    type: String,
    required: true,
    enum: ['Compras', 'Alimentos', 'Telefono', 'Educacion', 'Salud']
  },
  subcategoria: {
    type: String,
    enum: ['Hogar', 'Mercado', 'Otros']
  },
  descripcion:  { type: String, required: true },
  valor:        { type: Number, required: true },
  fecha:        { type: Date, default: Date.now },
  id_user:      { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
});

module.exports = mongoose.model('Gasto', GastoSchema);