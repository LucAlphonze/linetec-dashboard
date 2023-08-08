const { Schema, model } = require("mongoose");

const VariableSchema = Schema({
  nombre: {
    type: String,
    required: true,
  },
  id_maquina: {
    type: Schema.Types.ObjectId,
    ref: "Maquina",
    required: true,
  },
  id_proceso: {
    type: Schema.Types.ObjectId,
    ref: "Proceso",
    required: true,
  },
  es_automatica: {
    type: Boolean,
  },
});

module.exports = model("Variable", VariableSchema);
