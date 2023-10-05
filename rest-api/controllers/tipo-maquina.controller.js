const TipoMaquina = require("../models/tipo-maquina.model");
const Maquina = require("../models/maquina.model");

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
const borrarTipoMaquina = async (req, res) => {
  const tipoMaquinaId = req.params.tipoMaquinaId;
  try {
    const existeMaquina = await Maquina.find({
      id_tipo_maquina: tipoMaquinaId,
    });

    if (existeMaquina.length > 0) {
      return res.status(500).json({
        ok: false,
        status: 500,
        error: "El tipo de maquina tiene maquinas relacionadas",
        lineas: existeMaquina,
      });
    }

    const tipoMaquina = await TipoMaquina.deleteOne({ _id: tipoMaquinaId });

    res.status(204).json({
      ok: true,
      datos: tipoMaquina,
      status: 204,
    });
  } catch (err) {
    res.status(500).json({
      ok: false,
      error: err,
    });
  }
};
const editarTipoMaquina = async (req, res) => {
  const tipoMaquinaId = req.params.tipoMaquinaId;
  const body = req.body;
  try {
    const tipoMaquina = await TipoMaquina.findByIdAndUpdate(
      tipoMaquinaId,
      body
    );

    res.status(204).json({
      ok: true,
      datos: tipoMaquina,
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
  obtenerTiposMaquinas,
  crearTipoMaquina,
  borrarTipoMaquina,
  editarTipoMaquina,
};
