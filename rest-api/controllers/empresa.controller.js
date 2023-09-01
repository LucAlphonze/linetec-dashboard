const Empresa = require("../models/empresa.model");
const EmpresaPlanta = require("../models/empresa-planta.model");
const Localidad = require("../models/localidad.model");

const obtenerEmpresas = async (req, res) => {
  try {
    const empresas = await Empresa.find().populate(
      "id_localidad",
      "nombre codigo_postal"
    );

    res.json({
      ok: true,
      datos: empresas,
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      error,
    });
    console.log(error);
  }
};

const obtenerEmpresa = async (req, res) => {
  var medidas = req.params.idRubroEmpresa;

  try {
    const EPR = await Empresa.find({ id_rubro_empresa: medidas }).populate(
      "id_localidad",
      "nombre codigo_postal"
    );

    res.status(200).send(EPR);
  } catch (error) {
    res.status(500).json({
      ok: false,
      error,
    });
    console.log(error);
  }
};

const empresaPorLocalidad = async (req, res) => {
  var medidas = req.params.idLocalidad;
  try {
    const empresa = await Empresa.find({ id_localidad: medidas }).populate(
      "id_localidad",
      "nombre codigo_postal"
    );

    res.status(200).send(empresa);
  } catch (error) {
    res.status(500).json({
      ok: false,
      error,
    });
    console.log(error);
  }
};

const crearEmpresa = async (req, res) => {
  try {
    const existeLocalidad = await Localidad.findOne({
      _id: req.body.id_localidad,
    });
    if (existeLocalidad) {
      const existeEmpresa = await Empresa.findOne({
        razon_social: { $regex: new RegExp(req.body.razon_social, "i") },
        id_localidad: req.body.localidad,
      });
      if (existeEmpresa) {
        return res.status(500).json({
          ok: false,
          error: "La empresa ingresada ya está registrada",
        });
      }
    } else {
      return res.status(500).json({
        of: false,
        error: "La localidad no existe",
      });
    }
    const empresa = new Empresa(req.body);

    await empresa.save();

    res.json({
      ok: true,
      datos: empresa,
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      error,
    });
  }
};

const borrarEmpresa = async (req, res) => {
  const empresaId = req.params.empresaId;
  try {
    const existePlanta = await EmpresaPlanta.find({
      id_empresa: empresaId,
    });

    if (existePlanta.length > 0) {
      return res.status(500).json({
        ok: false,
        status: 500,
        error: "La Empresa tiene plantas relacionadas",
        plantas: existePlanta,
      });
    }
    const empresa = await Empresa.deleteOne({ _id: empresaId });

    res.status(204).json({
      ok: true,
      datos: empresa,
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
  obtenerEmpresas,
  obtenerEmpresa,
  empresaPorLocalidad,
  crearEmpresa,
  borrarEmpresa,
};
