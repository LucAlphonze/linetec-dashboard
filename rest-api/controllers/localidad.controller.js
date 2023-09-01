const Localidad = require("../models/localidad.model");
const Empresa = require("../models/empresa.model");
const Provincia = require("../models/provincia.model");

const obtenerLocalidades = async (req, res) => {
  try {
    const localidades = await Localidad.find().populate(
      "id_provincia",
      "nombre"
    );

    res.json({
      ok: true,
      datos: localidades,
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      error,
    });
  }
};
const localidadPorProvincia = async (req, res) => {
  try {
    var medidas = req.params.idProvincia;
    const lpp = await Localidad.find({ id_provincia: medidas }).populate(
      "id_provincia",
      "nombre"
    );

    res.status(200).send(lpp);
  } catch (error) {
    res.status(500).json({
      ok: false,
      error,
    });
  }
};

const crearLocalidad = async (req, res) => {
  try {
    const existeProvincia = await Provincia.findOne({
      _id: req.body.id_provincia,
    });
    if (existeProvincia) {
      const existeLocalidad = await Localidad.findOne({
        nombre: { $regex: new RegExp(req.body.nombre, "i") },
        id_provincia: req.body.id_provincia,
      });

      if (existeLocalidad) {
        return res.status(500).json({
          ok: false,
          status: 500,
          error: "La Localidad ingresada ya está registrada",
        });
      }
    } else {
      return res.status(500).json({
        ok: false,
        error: "La provincia no existe",
      });
    }
    const localidad = new Localidad(req.body);

    await localidad.save();

    res.json({
      ok: true,
      datos: localidad,
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      error,
    });
  }
};

const borrarLocalidad = async (req, res) => {
  const localidadId = req.params.localidadId;
  try {
    const existeEmpresa = await Empresa.find({
      id_localidad: localidadId,
    });

    if (existeEmpresa.length > 0) {
      return res.status(500).json({
        ok: false,
        status: 500,
        error: "La Localidad tiene empresas relacionadas",
        empresas: existeEmpresa,
      });
    }

    const localidad = await Localidad.deleteOne({ _id: localidadId });

    res.status(204).json({
      ok: true,
      datos: localidad,
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
  obtenerLocalidades,
  localidadPorProvincia,
  crearLocalidad,
  borrarLocalidad,
};
