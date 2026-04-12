const mongoose = require('mongoose');

const IngresoSchema = new mongoose.Schema({
  categoria:   {
    type: String,
    required: true,
    enum: ['Pasivo', 'Activo']
  },
  descripcion: { type: String, required: true },
  valor:       { type: Number, required: true },
  fecha:       { type: Date, default: Date.now },
  id_user:     { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
});

module.exports = mongoose.model('Ingreso', IngresoSchema);