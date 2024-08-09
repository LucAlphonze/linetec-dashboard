const Pais = require("../models/pais.model");
const Provincia = require("../models/provincia.model");

const obtenerPaises = async (req, res) => {
  try {
    const paises = await Pais.find();

    res.json({
      ok: true,
      datos: paises,
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      error,
    });
  }
};

const crearPais = async (req, res) => {
  try {
    const existePais = await Pais.findOne({
      nombre: { $regex: new RegExp(req.body.nombre, "i") },
    });

    if (existePais) {
      return res.status(500).json({
        ok: false,
        status: 500,
        error: "El país ingresado ya está registrado",
      });
    }

    const pais = new Pais(req.body);

    await pais.save();

    res.json({
      ok: true,
      datos: pais,
    });
  } catch (err) {
    res.status(500).json({
      ok: false,
      error: err,
    });
  }
};

const borrarPais = async (req, res) => {
  const paisId = req.params.paisId;
  try {
    const existeProvincia = await Provincia.find({
      id_pais: paisId,
    });

    if (existeProvincia.length > 0) {
      return res.status(500).json({
        ok: false,
        status: 500,
        error: "El país tiene provincias relacionadas",
        provincias: existeProvincia,
      });
    }

    const pais = await Pais.deleteOne({ _id: paisId });

    res.status(204).json({
      ok: true,
      datos: pais,
      status: 204,
    });
  } catch (err) {
    res.status(500).json({
      ok: false,
      error: err,
    });
  }
};
const editarPais = async (req, res) => {
  const paisId = req.params.paisId;
  const body = req.body;
  try {
    const existePais = await Pais.find({
      _id: paisId,
    });
    if (existePais.length > 0) {
      const pais = await Pais.findByIdAndUpdate(paisId, body, { new: true });
      res.status(204).json({
        ok: true,
        datos: pais,
      });
    } else {
      res.status(404).json({
        ok: false,
        datos: `el pais con el id: ${paisId} no existe`,
      });
    }
  } catch (error) {
    res.status(500).json({
      ok: false,
      error: error,
    });
  }
};
module.exports = {
  obtenerPaises,
  crearPais,
  borrarPais,
  editarPais,
};
