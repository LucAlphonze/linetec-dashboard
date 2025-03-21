const Provincia = require("../models/provincia.model");
const Localidad = require("../models/localidad.model");
const Pais = require("../models/pais.model");

const obtenerProvincias = async (req, res) => {
  try {
    const provincias = await Provincia.find().populate("id_pais", "nombre");

    res.json({
      ok: true,
      datos: provincias,
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      error,
    });
  }
};

const provinciasPorPais = async (req, res) => {
  try {
    var pais = req.params.idPais;
    const ppp = await Provincia.find({ id_pais: pais }).populate(
      "id_pais",
      "nombre"
    );

    res.status(200).send(ppp);
  } catch (error) {
    res.status(500).json({
      ok: false,
      error,
    });
  }
};

const crearProvincia = async (req, res) => {
  try {
    const existePais = await Pais.findOne({
      _id: req.body.id_pais,
    });
    if (existePais) {
      const existeProvincia = await Provincia.findOne({
        nombre: { $regex: new RegExp(req.body.nombre, "i") },
        id_pais: req.body.id_pais,
      });

      if (existeProvincia) {
        return res.status(500).json({
          ok: false,
          error: "La provincia ingresada ya está registrado",
        });
      }
    } else {
      return res.status(500).json({
        ok: false,
        error: "El pais de la provincia no existe",
      });
    }

    const provincia = new Provincia(req.body);
    await provincia.save();

    res.status(200).json({
      ok: true,
      datos: provincia,
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      error,
    });
  }
};

const borrarProvincia = async (req, res) => {
  const provinciaId = req.params.provinciaId;
  try {
    const existeLocalidad = await Localidad.find({
      id_provincia: provinciaId,
    });

    if (existeLocalidad.length > 0) {
      return res.status(500).json({
        ok: false,
        status: 500,
        error: "La provincia tiene localidades relacionadas",
        localidades: existeLocalidad,
      });
    }

    const provincia = await Provincia.deleteOne({ _id: provinciaId });

    res.status(204).json({
      ok: true,
      datos: provincia,
      status: 204,
    });
  } catch (err) {
    res.status(500).json({
      ok: false,
      error: err,
    });
  }
};

const editarProvincia = async (req, res) => {
  const provinciaId = req.params.provinciaId;
  const body = req.body;
  try {
    const existeProvincia = await Provincia.find({
      _id: provinciaId,
    });
    if (existeProvincia.length > 0) {
      const provincia = await Provincia.findByIdAndUpdate(provinciaId, body, {
        new: true,
      });
      res.status(204).json({
        ok: true,
        datos: provincia,
      });
    } else {
      res.status(404).json({
        ok: false,
        datos: `La provincia con el id: ${provinciaId} no existe`,
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
  obtenerProvincias,
  provinciasPorPais,
  crearProvincia,
  borrarProvincia,
  editarProvincia,
};
