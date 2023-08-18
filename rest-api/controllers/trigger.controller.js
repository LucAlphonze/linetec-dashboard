const Trigger = require("../models/trigger.model");

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

module.exports = {
  obtenerTrigger,
  crearTrigger,
};
