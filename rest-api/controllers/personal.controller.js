const Personal = require("../models/personal.model");

const obtenerPersonal = async (req, res) => {
  try {
    const personal = await Personal.find().populate(
      "id_empresa_planta",
      "nombre"
    );

    res.json({
      ok: true,
      datos: personal,
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      error,
    });
  }
};

const crearPersonal = async (req, res) => {
  const personal = new Personal(req.body);

  try {
    await personal.save();
    res.json({
      ok: true,
      personal,
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      error,
    });
  }
};

module.exports = {
  obtenerPersonal,
  crearPersonal,
};
