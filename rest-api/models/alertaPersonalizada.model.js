const { Schema, model } = require("mongoose");

const AlertaPersonalizadaSchema = Schema({
  denominacion: {
    type: String,
  },
  creado: {
    type: String,
  },
  id_empresa_planta: {
    type: Schema.Types.ObjectId,
    ref: "EmpresaPlanta",
    required: true,
  },
  id_variable: {
    type: Schema.Types.ObjectId,
    ref: "Variable",
    required: true,
  },
  emite_alerta: {
    //modificado, number -> boolean
    type: Boolean,
  },
});

module.exports = model("AlertaPersonalizada", AlertaPersonalizadaSchema);
