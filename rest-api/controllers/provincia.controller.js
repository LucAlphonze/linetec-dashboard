const Provincia = require("../models/provincia.model");

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
    var medidas = req.params.idPais;
    const ppp = await Provincia.find({ id_pais: medidas }).populate(
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
    const existeProvincia = await Provincia.findOne({
      nombre: req.body.nombre,
    });

    if (existeProvincia) {
      return res.status(500).json({
        ok: false,
        error: "La provincia ingresada ya está registrado",
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

module.exports = {
  obtenerProvincias,
  provinciasPorPais,
  crearProvincia,
};
