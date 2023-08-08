const Pais = require("../models/pais.model");

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

module.exports = {
  obtenerPaises,
  crearPais,
};
