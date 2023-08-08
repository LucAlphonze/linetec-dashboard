const TipoMaquina = require("../models/tipo-maquina.model");

const obtenerTiposMaquinas = async (req, res) => {
  try {
    const tiposMaquinas = await TipoMaquina.find();

    res.json({
      ok: true,
      datos: tiposMaquinas,
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      error,
    });
  }
};

const crearTipoMaquina = async (req, res) => {
  const tipoMaquina = new TipoMaquina(req.body);

  try {
    await tipoMaquina.save();

    res.json({
      ok: true,
      datos: tipoMaquina,
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      error,
    });
  }
};

module.exports = {
  obtenerTiposMaquinas,
  crearTipoMaquina,
};
