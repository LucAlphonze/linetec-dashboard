const Maquina = require("../models/maquina.model");

const obtenerMaquinas = async (req, res) => {
  try {
    const maquinas = await Maquina.find()
      .populate("id_tipo_maquina", "descripcion observaciones")
      .populate("id_linea_produccion", "descripcion");

    res.json({
      ok: true,
      datos: maquinas,
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      error,
    });
  }
};
const maquinasPorLinea = async (req, res) => {
  try {
    var medidas = req.params.idLineaProduccion;
    const MPl = await Maquina.find({ id_linea_produccion: medidas }).populate(
      "id_linea_produccion",
      "descripcion"
    );

    res.send(MPl);
  } catch (error) {
    res.status(500).json({
      ok: false,
      error,
    });
  }
};
const crearMaquina = async (req, res) => {
  const maquina = new Maquina(req.body);

  try {
    await maquina.save();

    res.json({
      ok: true,
      datos: maquina,
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      error,
    });
  }
};

module.exports = {
  obtenerMaquinas,
  maquinasPorLinea,
  crearMaquina,
};
