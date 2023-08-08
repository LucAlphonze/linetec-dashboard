const LineaProduccion = require("../models/linea-produccion.model");

const obtenerLineasProducciones = async (req, res) => {
  try {
    const lineasDeProducciones = await LineaProduccion.find().populate(
      "id_empresa_planta",
      "nombre"
    );

    res.json({
      ok: true,
      datos: lineasDeProducciones,
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      error,
    });
  }
};

const crearLineaProduccion = async (req, res) => {
  const lineaProduccion = new LineaProduccion(req.body);

  try {
    await lineaProduccion.save();

    res.json({
      ok: true,
      datos: lineaProduccion,
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      error,
    });
  }
};

module.exports = {
  obtenerLineasProducciones,
  crearLineaProduccion,
};
