const { Schema, model } = require("mongoose");

const AlertaPersonalizadaVarSchema = Schema({
  id_alerta_personalizada: {
    type: Schema.Types.ObjectId,
    ref: "AlertaPersonalizada",
    required: true,
  },
  id_variable: {
    type: Schema.Types.ObjectId,
    ref: "Variable",
    required: true,
  },
  valor_min: {
    type: Number,
  },
  valor_max: {
    type: Number,
  },
  valor_fijo: {
    type: Number,
  },
  activa: {
    type: Number,
  },
});

module.exports = model("AlertaPersonalizadaVar", AlertaPersonalizadaVarSchema);
