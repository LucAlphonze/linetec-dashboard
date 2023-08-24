const Trigger = require("../models/trigger.model");
const Variable = require("../models/variable.model");

const obtenerTrigger = async (req, res) => {
  try {
    const triggers = await Trigger.find();
    res.send(triggers);
  } catch (error) {
    res.status(500).json({
      ok: false,
      error,
    });
  }
};

const crearTrigger = async (req, res) => {
  const trigger = new Trigger(req.body);

  try {
    await trigger.save();

    res.json({
      ok: true,
      datos: trigger,
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      error,
    });
  }
};

const borrarTrigger = async (req, res) => {
  const triggerId = req.params.triggerId;
  try {
    const existeVariable = await Variable.find({
      id_trigger: triggerId,
    });

    if (existeVariable) {
      return res.status(500).json({
        ok: false,
        status: 500,
        error: "El trigger tiene variables relacionadas",
        lineas: existeVariable,
      });
    }

    const trigger = await Trigger.deleteOne({ _id: triggerId });

    res.json({
      ok: true,
      datos: trigger,
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
  obtenerTrigger,
  crearTrigger,
  borrarTrigger,
};
