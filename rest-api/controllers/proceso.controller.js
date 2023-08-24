const Proceso = require("../models/proceso.model");
const Variable = require("../models/variable.model");

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

const borrarProceso = async (req, res) => {
  const procesoId = req.params.procesoId;
  try {
    const existeVariable = await Variable.find({
      id_proceso: procesoId,
    });

    if (existeVariable) {
      return res.status(500).json({
        ok: false,
        status: 500,
        error: "El proceso tiene variables relacionadas",
        lineas: existeVariable,
      });
    }

    const proceso = await Proceso.deleteOne({ _id: procesoId });

    res.json({
      ok: true,
      datos: proceso,
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
  obtenerProcesos,
  crearProceso,
  borrarProceso,
};
