const User = require("../models/users.model");
const authSerivce = require("./auth.controller");

const obtenerUsers = async (req, res) => {
  try {
    const users = await User.find().populate("role", "name");
    res.send(users);
  } catch (error) {
    res.status(500).json({
      ok: false,
      error,
    });
  }
};
const obtenerUserByUserName = async (req, res) => {
  var username = req.params.username;
  try {
    const users = await User.findOne({ username: username }).populate(
      "role",
      "name"
    );
    res.send(users);
  } catch (error) {
    res.status(500).json({
      ok: false,
      error,
    });
  }
};

const crearUser = async (req, res) => {
  try {
    const existeUser = await User.findOne({
      username: { $regex: new RegExp(req.body.username, "i") },
    });

    if (existeUser) {
      return res.status(500).json({
        ok: false,
        status: 500,
        error: "El nombre de usuario ingresado ya está registrado",
      });
    }

    const user = new User(req.body);

    await user.save();

    res.json({
      ok: true,
      datos: user,
    });
  } catch (err) {
    res.status(500).json({
      ok: false,
      error: err,
    });
  }
};

const updateUser = async (req, res) => {
  var username = { username: req.params.username };

  try {
    const user = await User.findOneAndUpdate(username, req.body, {
      new: true,
    });

    res.json({
      ok: true,
      datos: user,
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      err: error.message,
    });
  }
};

const login = async (req, res) => {
  var username = req.body.username,
    password = req.body.password;
  const usuario = { name: username };

  if (!username || !password) {
    return res.status(400).send("Error: Bad request!");
  }

  var doc = User.findOne({ username: username, password: password }).populate(
    "role",
    "name"
  );
  doc
    .then(function (user) {
      if (!user) {
        res.status(403).send("Error: Usuario y/o password incorrecto.");
      } else {
        res.status(200).json({
          datos: user,
          token: authSerivce.genTokens(usuario).accessToken,
          rtoken: authSerivce.genTokens(usuario).refreshToken,
          status: 200,
        });
      }
    })
    .catch(function (error) {
      res.status(500).send(`Login Error: ${error.message}`);
    });
};
const borrarUsuario = async (req, res) => {
  const usuarioId = req.params.usuarioId;
  try {
    const usuario = await User.deleteOne({ _id: usuarioId });

    res.status(204).json({
      ok: true,
      datos: usuario,
    });
  } catch (err) {
    res.status(500).json({
      ok: false,
      error: err,
    });
  }
};

module.exports = {
  obtenerUsers,
  obtenerUserByUserName,
  crearUser,
  updateUser,
  login,
  borrarUsuario,
};
