const Variable = require("../models/variable.model");
const Maquina = require("../models/maquina.model");
const Proceso = require("../models/proceso.model");
const Trigger = require("../models/trigger.model");

const obtenerVariables = async (req, res) => {
  try {
    const variables = await Variable.find()
      .populate("id_maquina", "nombre modelo")
      .populate("id_proceso", "descripcion")
      .populate("id_trigger", "nombre descripcion")
      .sort({ time_stamp: 1 });
    res.send(variables);
  } catch (error) {
    res.status(500).json({
      ok: false,
      error,
    });
  }
};
const obtenerVariableById = async (req, res) => {
  let id = req.params.id;
  try {
    const variables = await Variable.find({
      _id: id,
    })
      .populate("id_maquina", "nombre modelo")
      .populate("id_proceso", "nombre descripcion")
      .populate("id_trigger", "nombre descripcion");
    res.send(variables);
  } catch (error) {
    res.status(500).json({
      ok: false,
      error,
    });
  }
};
const obtenerVariableByNombre = async (req, res) => {
  let nombre = req.params.nombre;
  try {
    const variable = await Variable.find({
      nombre: nombre,
    }).populate("id_trigger", "nombre descripcion");
    res.send(variable);
  } catch (error) {
    res.status(500).json({
      ok: false,
      error,
    });
  }
};

const crearVariable = async (req, res) => {
  try {
    const existeMaquina = await Maquina.findOne({
      _id: req.body.id_maquina,
    });
    const existeProceso = await Proceso.findOne({
      _id: req.body.id_proceso,
    });
    const existeTrigger = await Trigger.findOne({
      _id: req.body.id_trigger,
    });
    if (existeMaquina && existeProceso && existeTrigger) {
      const existeVariable = await Variable.findOne({
        nombre: { $regex: new RegExp(req.body.nombre, "i") },
        id_maquina: req.body.id_maquina,
        id_proceso: req.body.id_proceso,
        id_trigger: req.body.id_trigger,
      });

      if (existeVariable) {
        return res.status(500).json({
          ok: false,
          error: "La variable ingresada ya está registrada",
        });
      }
    } else {
      let maquinaTexto = existeMaquina ? " " : "La maquina no existe";
      let procesoTexto = existeProceso ? " " : "El proceso no existe";
      let triggerTexto = existeTrigger ? " " : "El trigger no existe";
      return res.status(500).json({
        ok: false,
        error: `${maquinaTexto} ${procesoTexto} ${triggerTexto}`,
      });
    }
    const variable = new Variable(req.body);
    await variable.save();

    res.json({
      ok: true,
      datos: variable,
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      error,
    });
  }
};

const borrarVariable = async (req, res) => {
  const variableId = req.params.variableId;
  try {
    const variable = await Variable.deleteOne({ _id: variableId });

    res.status(204).json({
      ok: true,
      datos: variable,
    });
  } catch (err) {
    res.status(500).json({
      ok: false,
      error: err,
    });
  }
};

const editarVariable = async (req, res) => {
  const variableId = req.params.variableId;
  const body = req.body;
  try {
    const existeVariable = await Variable.find({
      _id: variableId,
    });
    if (existeVariable.length > 0) {
      const variable = await Variable.findByIdAndUpdate(variableId, body);
      res.status(204).json({
        ok: true,
        datos: variable,
      });
    } else {
      res.status(404).json({
        ok: false,
        datos: `La variable con el id: ${variableId} no existe`,
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
  obtenerVariables,
  crearVariable,
  obtenerVariableById,
  borrarVariable,
  editarVariable,
  obtenerVariableByNombre,
};
