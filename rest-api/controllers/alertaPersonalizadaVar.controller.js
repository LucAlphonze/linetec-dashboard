const AlertaPersonalizadaVar = require("../models/alertaPersonalizadaVar.model");

const obtenerAlertasPersonalizadasVar = async (req, res) => {
  try {
    const alertasPersonalizadasVar = await AlertaPersonalizadaVar.find()
      .populate("id_alerta_personalizada", "denominacion creado")
      .populate("id_variable", "nombre");

    res.status(200).json({
      ok: true,
      datos: alertasPersonalizadasVar,
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      error,
    });
  }
};

const crearAlertaPersonalizada = async (req, res) => {
  const alertaPersonalizadaVar = new AlertaPersonalizadaVar(req.body);

  try {
    await alertaPersonalizadaVar.save();

    res.status(200).json({
      ok: true,
      datos: alertaPersonalizadaVar,
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      error,
    });
  }
};

module.exports = {
  obtenerAlertasPersonalizadasVar,
  crearAlertaPersonalizada,
};
