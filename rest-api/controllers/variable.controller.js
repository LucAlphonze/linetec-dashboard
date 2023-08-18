const Variable = require("../models/variable.model");

const obtenerVariables = async (req, res) => {
  try {
    const variables = await Variable.find()
      .populate("id_maquina", "nombre modelo")
      .populate("id_proceso", "descripcion")
      .populate("id_trigger", "nombre descripcion");
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
      .populate("id_proceso", "descripcion")
      .populate("id_trigger", "nombre descripcion");
    res.send(variables);
  } catch (error) {
    res.status(500).json({
      ok: false,
      error,
    });
  }
};

const crearVariable = async (req, res) => {
  const variable = new Variable(req.body);

  try {
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

module.exports = {
  obtenerVariables,
  crearVariable,
  obtenerVariableById,
};
