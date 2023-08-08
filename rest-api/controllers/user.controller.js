const User = require("../models/users.model");

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
  const user = new User(req.body);

  try {
    await user.save();

    res.json({
      ok: true,
      datos: user,
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      error,
    });
  }
};
const updateUser = async (req, res) => {
  var filter = { username: req.params.username };

  try {
    const user = await User.findOneAndUpdate(filter, req.body, {
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

module.exports = {
  obtenerUsers,
  obtenerUserByUserName,
  crearUser,
  updateUser,
};
