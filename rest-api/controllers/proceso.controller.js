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
  try {
    const existeProceso = await Proceso.findOne({
      nombre: { $regex: new RegExp(req.body.nombre, "i") },
    });
    if (existeProceso) {
      return res.status(500).json({
        ok: false,
        error: "El proceso ingresado ya está registrado",
      });
    }
    const proceso = new Proceso(req.body);
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

    if (existeVariable.length > 0) {
      return res.status(500).json({
        ok: false,
        status: 500,
        error: "El proceso tiene variables relacionadas",
        lineas: existeVariable,
      });
    }

    const proceso = await Proceso.deleteOne({ _id: procesoId });

    res.status(204).json({
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
const editarProceso = async (req, res) => {
  const procesoId = req.params.procesoId;
  const body = req.body;
  try {
    const existeProceso = await Proceso.find({
      _id: procesoId,
    });
    if (existeProceso.length > 0) {
      const proceso = await Proceso.findByIdAndUpdate(procesoId, body, {
        new: true,
      });
      res.status(204).json({
        ok: true,
        datos: proceso,
      });
    } else {
      res.status(404).json({
        ok: false,
        datos: `El proceso con el id: ${procesoId} no existe`,
      });
    }
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
  editarProceso,
};
