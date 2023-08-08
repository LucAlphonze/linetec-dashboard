const { Schema, model } = require("mongoose");

const PersonalSchema = Schema({
  nombre_apellido: {
    type: String,
    required: true,
  },
  codigo_id: {
    type: String,
    required: true,
  },
  id_empresa_planta: {
    type: Schema.Types.ObjectId,
    ref: "EmpresaPlanta",
    required: true,
  },
});

module.exports = model("Personal", PersonalSchema);
