const Role = require("../models/role.model");

const obtenerRoles = async (req, res) => {
  try {
    const roles = await Role.find();
    res.send(roles);
  } catch (error) {
    res.status(500).json({
      ok: false,
      error,
    });
  }
};

const crearRol = async (req, res) => {
  const role = new Role(req.body);

  try {
    await role.save();

    res.status(200).json({
      ok: true,
      datos: role,
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      error,
    });
  }
};

module.exports = {
  obtenerRoles,
  crearRol,
};
