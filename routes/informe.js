const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Ingreso = require('../models/Ingreso');
const Gasto = require('../models/Gasto');
const mongoose = require('mongoose');

// GET /informe/mes/:mes
router.get('/mes/:mes', auth, async (req, res) => {
  try {
    const mes = parseInt(req.params.mes);
    const anio = new Date().getFullYear();

    const inicio = new Date(anio, mes - 1, 1);
    const fin = new Date(anio, mes, 1);

    const ingresos = await Ingreso.find({ id_user: req.user.id, fecha: { $gte: inicio, $lt: fin } });
    const gastos = await Gasto.find({ id_user: req.user.id, fecha: { $gte: inicio, $lt: fin } });

    const totalIngresos = ingresos.reduce((sum, i) => sum + i.valor, 0);
    const totalGastos = gastos.reduce((sum, g) => sum + g.valor, 0);

    res.json({ totalIngresos, totalGastos, balance: totalIngresos - totalGastos });
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: 'Error en el servidor' });
  }
});

// GET /informe/semana/:semana
router.get('/semana/:semana', auth, async (req, res) => {
  try {
    const semana = parseInt(req.params.semana);
    const anio = new Date().getFullYear();

    const inicio = new Date(anio, 0, 1 + (semana - 1) * 7);
    const fin = new Date(anio, 0, 1 + semana * 7);

    const ingresos = await Ingreso.find({ id_user: req.user.id, fecha: { $gte: inicio, $lt: fin } });
    const gastos = await Gasto.find({ id_user: req.user.id, fecha: { $gte: inicio, $lt: fin } });

    const totalIngresos = ingresos.reduce((sum, i) => sum + i.valor, 0);
    const totalGastos = gastos.reduce((sum, g) => sum + g.valor, 0);

    res.json({ totalIngresos, totalGastos, balance: totalIngresos - totalGastos });
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: 'Error en el servidor' });
  }
});

// GET /informe/año/:anio
router.get('/anio/:anio', auth, async (req, res) => {
  try {
    const anio = parseInt(req.params.anio);

    const inicio = new Date(anio, 0, 1);
    const fin = new Date(anio + 1, 0, 1);

    const ingresos = await Ingreso.find({ id_user: req.user.id, fecha: { $gte: inicio, $lt: fin } });
    const gastos = await Gasto.find({ id_user: req.user.id, fecha: { $gte: inicio, $lt: fin } });

    const totalIngresos = ingresos.reduce((sum, i) => sum + i.valor, 0);
    const totalGastos = gastos.reduce((sum, g) => sum + g.valor, 0);

    res.json({ totalIngresos, totalGastos, balance: totalIngresos - totalGastos });
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: 'Error en el servidor' });
  }
});

// GET /informe/PatrimonioList
router.get('/PatrimonioList', auth, async (req, res) => {
  try {
    const ingresos = await Ingreso.find({ id_user: req.user.id });
    const totalIngresos = ingresos.reduce((sum, i) => sum + i.valor, 0);

    res.json({ ingresos, totalIngresos });
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: 'Error en el servidor' });
  }
});

// GET /informe/InformeCategoria/:tipo (Ingreso o Gasto)
router.get('/InformeCategoria/:tipo', auth, async (req, res) => {
  try {
    const tipo = req.params.tipo;
    const Modelo = tipo === 'Ingreso' ? Ingreso : Gasto;

    const resultado = await Modelo.aggregate([
      { $match: { id_user: new mongoose.Types.ObjectId(req.user.id) } },
      { $group: { _id: '$categoria', valor: { $sum: '$valor' } } },
      { $project: { categoria: '$_id', valor: 1, _id: 0 } }
    ]);

    res.json(resultado);
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: 'Error en el servidor' });
  }
});

module.exports = router;