const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Ingreso = require('../models/Ingreso');
const Gasto = require('../models/Gasto');

// POST /home/AnadirIngreso
router.post('/AnadirIngreso', auth, async (req, res) => {
  const { categoria, descripcion, valor, fecha } = req.body;
  try {
    const ingreso = new Ingreso({
      categoria, descripcion, valor,
      fecha: fecha || Date.now(),
      id_user: req.user.id
    });
    await ingreso.save();
    res.json(ingreso);
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: 'Error en el servidor' });
  }
});

// POST /home/AnadirGasto
router.post('/AnadirGasto', auth, async (req, res) => {
  const { categoria, descripcion, valor, fecha } = req.body;
  try {
    const gasto = new Gasto({
      categoria, descripcion, valor,
      fecha: fecha || Date.now(),
      id_user: req.user.id
    });
    await gasto.save();
    res.json(gasto);
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: 'Error en el servidor' });
  }
});

// GET /home/VerSaldo
router.get('/VerSaldo', auth, async (req, res) => {
  try {
    const ingresos = await Ingreso.find({ id_user: req.user.id });
    const gastos = await Gasto.find({ id_user: req.user.id });

    const totalIngresos = ingresos.reduce((sum, i) => sum + i.valor, 0);
    const totalGastos = gastos.reduce((sum, g) => sum + g.valor, 0);
    const saldo = totalIngresos - totalGastos;

    res.json({ totalIngresos, totalGastos, saldo });
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: 'Error en el servidor' });
  }
});

// GET /home/VerGastos
router.get('/VerGastos', auth, async (req, res) => {
  try {
    const gastos = await Gasto.find({ id_user: req.user.id });
    res.json(gastos);
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: 'Error en el servidor' });
  }
});

// GET /home/VerIngresos
router.get('/VerIngresos', auth, async (req, res) => {
  try {
    const ingresos = await Ingreso.find({ id_user: req.user.id });
    res.json(ingresos);
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: 'Error en el servidor' });
  }
});

// GET /home/VerTodo
router.get('/VerTodo', auth, async (req, res) => {
  try {
    const ingresos = await Ingreso.find({ id_user: req.user.id });
    const gastos = await Gasto.find({ id_user: req.user.id });
    res.json({ ingresos, gastos });
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: 'Error en el servidor' });
  }
});

module.exports = router;