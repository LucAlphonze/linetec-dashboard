const { Schema, model } = require("mongoose");

const UserSchema = Schema({
  username: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  role: {
    type: Schema.Types.ObjectId,
    ref: "Role",
  },
  id_empresa_planta: {
    type: Schema.Types.ObjectId,
    ref: "EmpresaPlanta",
  },
  isActive: {
    type: Boolean,
    default: false,
  },
});

module.exports = model("User", UserSchema);
