const Proceso = require("../models/proceso.model");

const obtenerProcesos = async (req, res) => {
  try {
    const procesos = await Proceso.find();

    res.status(200).json({
      ok: true,
      datos: procesos,
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      error,
    });
  }
};

const crearProceso = async (req, res) => {
  const proceso = new Proceso(req.body);

  try {
    await proceso.save();

    res.status(200).json({
      ok: true,
      datos: proceso,
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      error,
    });
    console.log(error);
  }
};

module.exports = {
  obtenerProcesos,
  crearProceso,
};
