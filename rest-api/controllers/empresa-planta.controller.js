const EmpresaPlanta = require("../models/empresa-planta.model");
const LineaProduccion = require("../models/linea-produccion.model");

const obtenerEmpresasPlantas = async (req, res) => {
  try {
    const empresasPlantas = await EmpresaPlanta.find().populate(
      "id_localidad",
      "nombre codigo_postal"
    );

    res.status(200).json({
      ok: true,
      datos: empresasPlantas,
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      error,
    });
  }
};
const plantaPorEmpresa = async (req, res) => {
  var medidas = req.params.idEmpresa;
  try {
    const planta = await EmpresaPlanta.find({ id_empresa: medidas }).populate(
      "id_localidad",
      "nombre codigo_postal"
    );

    res.status(200).send(planta);
  } catch (error) {
    res.status(500).json({
      ok: false,
      error,
    });
    console.log(error);
  }
};

const crearEmpresaPlanta = async (req, res) => {
  const empresaPlanta = new EmpresaPlanta(req.body);

  try {
    await empresaPlanta.save();

    res.status(200).json({
      ok: true,
      datos: empresaPlanta,
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      error,
    });
  }
};

const borrarPlanta = async (req, res) => {
  const plantaId = req.params.plantaId;
  try {
    const existeLinea = await LineaProduccion.find({
      id_empresa_planta: plantaId,
    });

    if (existeLinea.length > 0) {
      return res.status(500).json({
        ok: false,
        status: 500,
        error: "La Planta tiene lineas de produccion relacionadas",
        lineas: existeLinea,
      });
    }
    const planta = await EmpresaPlanta.deleteOne({ _id: plantaId });

    res.status(204).json({
      ok: true,
      datos: planta,
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
  obtenerEmpresasPlantas,
  plantaPorEmpresa,
  crearEmpresaPlanta,
  borrarPlanta,
};
