const Maquina = require("../models/maquina.model");
const Variable = require("../models/variable.model");
const LineaProduccion = require("../models/linea-produccion.model");
const TipoMaquina = require("../models/tipo-maquina.model");

const obtenerMaquinas = async (req, res) => {
  try {
    const maquinas = await Maquina.find()
      .populate("id_tipo_maquina", "nombre descripcion")
      .populate("id_linea_produccion", "descripcion");

    res.json({
      ok: true,
      datos: maquinas,
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      error,
    });
  }
};
const maquinasPorLinea = async (req, res) => {
  try {
    var medidas = req.params.idLineaProduccion;
    const MPl = await Maquina.find({ id_linea_produccion: medidas }).populate(
      "id_linea_produccion",
      "descripcion"
    );

    res.send(MPl);
  } catch (error) {
    res.status(500).json({
      ok: false,
      error,
    });
  }
};
const crearMaquina = async (req, res) => {
  try {
    const existeLineaDeProduccion = await LineaProduccion.findOne({
      _id: req.body.id_linea_produccion,
    });
    const existeTipoMaquina = await TipoMaquina.findOne({
      _id: req.body.id_tipo_maquina,
    });
    if (existeLineaDeProduccion && existeTipoMaquina) {
      const existeMaquina = await Maquina.findOne({
        nombre: { $regex: new RegExp(req.body.nombre, "i") },
        id_linea_produccion: req.body.id_linea_produccion,
        id_tipo_maquina: req.body.id_tipo_maquina,
      });

      if (existeMaquina) {
        return res.status(500).json({
          ok: false,
          error: "La maquina ingresada ya está registrada",
        });
      }
    } else {
      let tipoMaquinaTexto = existeTipoMaquina
        ? " "
        : "El tipo de maquina no existe";
      let lineaProduccionTexto = existeLineaDeProduccion
        ? " "
        : "La linea de produccion no existe";

      return res.status(500).json({
        ok: false,
        error: `${tipoMaquinaTexto} ${lineaProduccionTexto}`,
      });
    }

    const maquina = new Maquina(req.body);
    await maquina.save();

    res.json({
      ok: true,
      datos: maquina,
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      error,
    });
  }
};

const borrarMaquina = async (req, res) => {
  const maquinaId = req.params.maquinaId;
  try {
    const existeVariable = await Variable.find({
      id_maquina: maquinaId,
    });

    if (existeVariable.length > 0) {
      return res.status(500).json({
        ok: false,
        status: 500,
        error: "La maquina  tiene variables relacionadas",
        lineas: existeVariable,
      });
    }

    const maquina = await Maquina.deleteOne({ _id: maquinaId });

    res.status(204).json({
      ok: true,
      datos: maquina,
      status: 204,
    });
  } catch (err) {
    res.status(500).json({
      ok: false,
      error: err,
    });
  }
};

const editarMaquina = async (req, res) => {
  const maquinaId = req.params.maquinaId;
  const body = req.body;
  try {
    const existeMaquina = await Maquina.find({
      _id: maquinaId,
    });
    if (existeMaquina.length > 0) {
      const maquina = await Maquina.findByIdAndUpdate(maquinaId, body, {
        new: true,
      });
      res.status(204).json({
        ok: true,
        datos: maquina,
      });
    } else {
      res.status(404).json({
        ok: false,
        datos: `la maquina con el id: ${maquinaId} no existe`,
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
  obtenerMaquinas,
  maquinasPorLinea,
  crearMaquina,
  borrarMaquina,
  editarMaquina,
};
