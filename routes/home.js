'use strict';

let express = require('express');
let router = express.Router();
let auth = require('../middleware/auth');
let Ingreso = require('../models/Ingreso');
let Gasto = require('../models/Gasto');

// POST /home/AnadirIngreso
router.post('/AnadirIngreso', auth, async (req, res) => {
  let { categoria, descripcion, valor, fecha } = req.body;
  try {
    let ingreso = new Ingreso({
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
  let { categoria, descripcion, valor, fecha } = req.body;
  try {
    let gasto = new Gasto({
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
    let ingresos = await Ingreso.find({ id_user: req.user.id });
    let gastos = await Gasto.find({ id_user: req.user.id });

    let totalIngresos = ingresos.reduce((sum, i) => sum + i.valor, 0);
    let totalGastos = gastos.reduce((sum, g) => sum + g.valor, 0);
    let saldo = totalIngresos - totalGastos;

    res.json({ totalIngresos, totalGastos, saldo });
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: 'Error en el servidor' });
  }
});

// GET /home/VerGastos
router.get('/VerGastos', auth, async (req, res) => {
  try {
    let gastos = await Gasto.find({ id_user: req.user.id });
    res.json(gastos);
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: 'Error en el servidor' });
  }
});

// GET /home/VerIngresos
router.get('/VerIngresos', auth, async (req, res) => {
  try {
    let ingresos = await Ingreso.find({ id_user: req.user.id });
    res.json(ingresos);
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: 'Error en el servidor' });
  }
});

let getStartOfWeek = (date) => {
  let d = new Date(date);
  let day = d.getDay();
  let diff = (day + 6) % 7; // lunes como inicio
  d.setDate(d.getDate() - diff);
  d.setHours(0, 0, 0, 0);
  return d;
};

let getRange = (year, month, isYear = false) => {
  let start = isYear
    ? new Date(year, 0, 1)
    : new Date(year, month, 1);
  let end = isYear
    ? new Date(year + 1, 0, 1)
    : new Date(year, month + 1, 1);
  return { start, end };
};

let groupByCategoria = (items) => {
  return items.reduce((acc, item) => {
    acc[item.categoria] = (acc[item.categoria] || 0) + item.valor;
    return acc;
  }, {});
};

let filterByDateRange = (items, start, end) => {
  return items.filter((item) => {
    let fecha = new Date(item.fecha);
    return fecha >= start && fecha < end;
  });
};

let calculateTotals = (items) => {
  return items.reduce((sum, item) => sum + item.valor, 0);
};

let getStartOfISOWeek = (week, year) => {
  let jan4 = new Date(year, 0, 4);
  let dayOfWeek = jan4.getDay() || 7; // 1 = Monday, 7 = Sunday
  let mondayOfWeek1 = new Date(jan4);
  mondayOfWeek1.setDate(jan4.getDate() - (dayOfWeek - 1));
  let weekStart = new Date(mondayOfWeek1);
  weekStart.setDate(mondayOfWeek1.getDate() + (week - 1) * 7);
  weekStart.setHours(0, 0, 0, 0);
  return weekStart;
};

// GET /home/VerTodo
router.get('/VerTodo', auth, async (req, res) => {
  try {
    let ingresos = await Ingreso.find({ id_user: req.user.id });
    let gastos = await Gasto.find({ id_user: req.user.id });
    res.json({ ingresos, gastos });
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: 'Error en el servidor' });
  }
});

// GET /home/informe/mes/:month
router.get('/informe/mes/:month', auth, async (req, res) => {
  try {
    let now = new Date();
    let month = parseInt(req.params.month, 10);
    if (!Number.isInteger(month) || month < 1 || month > 12) {
      return res.status(400).json({ msg: 'Mes inválido. Use un número entre 1 y 12.' });
    }
    let year = parseInt(req.query.year, 10) || now.getFullYear();
    let { start, end } = getRange(year, month - 1);

    let ingresos = await Ingreso.find({ id_user: req.user.id });
    let gastos = await Gasto.find({ id_user: req.user.id });

    let ingresosMes = filterByDateRange(ingresos, start, end);
    let gastosMes = filterByDateRange(gastos, start, end);
    let totalIngresos = calculateTotals(ingresosMes);
    let totalGastos = calculateTotals(gastosMes);

    res.json({
      year,
      month,
      totalIngresos,
      totalGastos,
      saldo: totalIngresos - totalGastos,
      ingresos: ingresosMes,
      gastos: gastosMes
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: 'Error en el servidor' });
  }
});

// GET /home/informe/semana/:week
router.get('/informe/semana/:week', auth, async (req, res) => {
  try {
    let now = new Date();
    let week = parseInt(req.params.week, 10);
    let year = parseInt(req.query.year, 10) || now.getFullYear();

    if (!Number.isInteger(week) || week < 1 || week > 53) {
      return res.status(400).json({ msg: 'Semana inválida. Use un número entre 1 y 53.' });
    }

    let start = getStartOfISOWeek(week, year);
    let end = new Date(start);
    end.setDate(end.getDate() + 7);

    let ingresos = await Ingreso.find({ id_user: req.user.id });
    let gastos = await Gasto.find({ id_user: req.user.id });

    let ingresosSemana = filterByDateRange(ingresos, start, end);
    let gastosSemana = filterByDateRange(gastos, start, end);
    let totalIngresos = calculateTotals(ingresosSemana);
    let totalGastos = calculateTotals(gastosSemana);

    res.json({
      week,
      year,
      start: start.toISOString(),
      end: end.toISOString(),
      totalIngresos,
      totalGastos,
      saldo: totalIngresos - totalGastos,
      ingresos: ingresosSemana,
      gastos: gastosSemana
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: 'Error en el servidor' });
  }
});

// GET /home/informe/anio/:year
router.get('/informe/anio/:year', auth, async (req, res) => {
  try {
    let year = parseInt(req.params.year, 10);
    if (!Number.isInteger(year) || year < 1900) {
      return res.status(400).json({ msg: 'Año inválido. Use un año válido con 4 dígitos.' });
    }
    let { start, end } = getRange(year, 0, true);

    let ingresos = await Ingreso.find({ id_user: req.user.id });
    let gastos = await Gasto.find({ id_user: req.user.id });

    let ingresosAno = filterByDateRange(ingresos, start, end);
    let gastosAno = filterByDateRange(gastos, start, end);
    let totalIngresos = calculateTotals(ingresosAno);
    let totalGastos = calculateTotals(gastosAno);

    res.json({
      year,
      totalIngresos,
      totalGastos,
      saldo: totalIngresos - totalGastos,
      ingresos: ingresosAno,
      gastos: gastosAno
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: 'Error en el servidor' });
  }
});

// GET /home/informe/categoria
router.get('/informe/categoria', auth, async (req, res) => {
  try {
    let ingresos = await Ingreso.find({ id_user: req.user.id });
    let gastos = await Gasto.find({ id_user: req.user.id });

    res.json({
      ingresosPorCategoria: groupByCategoria(ingresos),
      gastosPorCategoria: groupByCategoria(gastos)
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: 'Error en el servidor' });
  }
});

// GET /home/informe/patrimonio
router.get('/informe/patrimonio', auth, async (req, res) => {
  try {
    let ingresos = await Ingreso.find({ id_user: req.user.id });
    let activos = ingresos.filter((item) => item.categoria === 'Activo');
    let pasivos = ingresos.filter((item) => item.categoria === 'Pasivo');
    let totalActivo = calculateTotals(activos);
    let totalPasivo = calculateTotals(pasivos);

    res.json({
      activos,
      pasivos,
      totalActivo,
      totalPasivo,
      patrimonio: totalActivo - totalPasivo
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: 'Error en el servidor' });
  }
});

module.exports = router;