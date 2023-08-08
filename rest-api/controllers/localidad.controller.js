const Localidad = require("../models/localidad.model");

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
  const localidad = new Localidad(req.body);

  try {
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

module.exports = {
  obtenerLocalidades,
  localidadPorProvincia,
  crearLocalidad,
};
