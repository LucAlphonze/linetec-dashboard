const AdministracionMonitoreo = require("../models/administracionMonitoreo.model");

const obtenerAdministracionesMonitoreos = async (req, res) => {
  try {
    const administracionMonitoreo = await AdministracionMonitoreo.find()
      // .populate('id_linea_produccion', 'descripcion observaciones')
      // .populate('id_maquina', 'nombre modelo')
      // .populate('id_proceso', 'descripcion')
      .populate("id_variable", "descripcion");

    res.status(200).json({
      ok: true,
      datos: administracionMonitoreo,
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      error,
    });
  }
};

const crearAdministracionMonitoreo = async (req, res) => {
  const administracionMonitoreo = new AdministracionMonitoreo(req.body);

  try {
    await administracionMonitoreo.save();
    res.status(200).json({
      ok: true,
      datos: administracionMonitoreo,
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      error,
    });
  }
};

module.exports = {
  obtenerAdministracionesMonitoreos,
  crearAdministracionMonitoreo,
};
