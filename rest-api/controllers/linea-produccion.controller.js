const LineaProduccion = require("../models/linea-produccion.model");
const Maquina = require("../models/maquina.model");
const EmpresaPlanta = require("../models/empresa-planta.model");

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
const lineaProduccionPorPlanta = async (req, res) => {
  var medidas = req.params.idPlanta;
  try {
    const lineas = await LineaProduccion.find({
      id_empresa_planta: medidas,
    }).populate("id_empresa_planta", "nombre");

    res.status(200).send(lineas);
  } catch (error) {
    res.status(500).json({
      ok: false,
      error,
    });
    console.log(error);
  }
};

const crearLineaProduccion = async (req, res) => {
  try {
    const existeEmpresaPlanta = await EmpresaPlanta.findOne({
      _id: req.body.id_empresa_planta,
    });
    if (existeEmpresaPlanta) {
      const existeLineaDeProduccion = await LineaProduccion.findOne({
        nombre: { $regex: new RegExp(req.body.nombre, "i") },
        id_empresa_planta: req.body.id_empresa_planta,
      });
      if (existeLineaDeProduccion) {
        return res.status(500).json({
          ok: false,
          error: "La linea de produccion ingresada ya está registrada",
        });
      }
    } else {
      return res.status(500).json({
        ok: false,
        error: "La planta no existe",
      });
    }

    const lineaProduccion = new LineaProduccion(req.body);
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

    res.status(204).json({
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
const editarLinea = async (req, res) => {
  const lineaId = req.params.lineaId;
  const body = req.body;
  try {
    const existeLineaDeProduccion = await LineaProduccion.find({
      _id: lineaId,
    });
    if (existeLineaDeProduccion.length > 0) {
      const linea = await LineaProduccion.findByIdAndUpdate(lineaId, body, {
        new: true,
      });
      res.status(204).json({
        ok: true,
        datos: linea,
      });
    } else {
      res.status(404).json({
        ok: false,
        datos: `La linea de produccion con el id: ${lineaId} no existe`,
      });
    }
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
  lineaProduccionPorPlanta,
  editarLinea,
};
