const { Schema, model } = require("mongoose");

const VariableSchema = Schema({
  nombre: {
    type: String,
    required: true,
  },
  descripcion: {
    type: String,
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
  id_trigger: {
    type: Schema.Types.ObjectId,
    ref: "Trigger",
    required: true,
  },
  trigger_valor: {
    type: String,
  },
});

module.exports = model("Variable", VariableSchema);
