const Chart = require("../models/chart.model");

const obtenerCharts = async (req, res) => {
  try {
    const charts = await Chart.find();

    res.json({
      ok: true,
      datos: charts,
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      error,
    });
  }
};

const crearChart = async (req, res) => {
  try {
    const existeChart = await Chart.findOne({
      nombre: { $regex: new RegExp(req.body.nombre, "i") },
    });

    if (existeChart) {
      return res.status(500).json({
        ok: false,
        status: 500,
        error: "El Chart ingresado ya está registrado",
      });
    }

    const chart = new Chart(req.body);

    await chart.save();

    res.json({
      ok: true,
      datos: chart,
    });
  } catch (err) {
    res.status(500).json({
      ok: false,
      error: err,
    });
  }
};

const borrarChart = async (req, res) => {
  const chartId = req.params.chartId;
  try {
    const chart = await Chart.deleteOne({ _id: chartId });

    res.status(204).json({
      ok: true,
      datos: chart,
      status: 204,
    });
  } catch (err) {
    res.status(500).json({
      ok: false,
      error: err,
    });
  }
};

module.exports = {
  obtenerCharts,
  crearChart,
  borrarChart,
};
