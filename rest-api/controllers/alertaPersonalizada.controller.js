const AlertaPersonalizada = require("../models/alertaPersonalizada.model");

const obtenerAlertasPersonalizadas = async (req, res) => {
  try {
    const alertasPersonalizadas = await AlertaPersonalizada.find()
      .populate("id_empresa_planta", "nombre calle")
      .populate("id_variable", "descripcion");
    // .populate('id_linea_produccion', 'descripcion')
    // .populate('id_maquina', 'nombre')
    // .populate('id_proceso', 'nombre_apellido');

    res.status(200).json({
      ok: true,
      datos: alertasPersonalizadas,
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      error,
    });
  }
};

const crearAlertaPersonalizada = async (req, res) => {
  const alertaPersonalizada = new AlertaPersonalizada(req.body);

  try {
    await alertaPersonalizada.save();

    res.status(200).json({
      ok: true,
      datos: alertaPersonalizada,
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      error,
    });
  }
};

module.exports = {
  obtenerAlertasPersonalizadas,
  crearAlertaPersonalizada,
};
