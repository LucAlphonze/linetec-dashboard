const LineaProduccion = require("../models/linea-produccion.model");
const Maquina = require("../models/maquina.model");

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

const borrarLinea = async (req, res) => {
  const lineaId = req.params.lineaId;
  try {
    const existeMaquina = await Maquina.find({
      id_linea_produccion: lineaId,
    });

    if (existeMaquina.length > 0) {
      return res.status(500).json({
        ok: false,
        status: 500,
        error: "La Linea de produccion tiene maquinas relacionadas",
        lineas: existeMaquina,
      });
    }

    const linea = await LineaProduccion.deleteOne({ _id: lineaId });

    res.json({
      ok: true,
      datos: linea,
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
  obtenerLineasProducciones,
  crearLineaProduccion,
  borrarLinea,
};
