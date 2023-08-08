const { Schema, model } = require("mongoose");

const AdministracionMonitoreoSchema = Schema({
  id_variable: {
    type: Schema.Types.ObjectId,
    ref: "Variable",
    required: true,
  },
  valor_minimo: {
    type: Number,
  },
  valor_optimo: {
    type: Number,
  },
  valor_maximo: {
    type: Number,
  },
  es_automatica: {
    //modificado, number -> boolean
    type: Boolean,
  },
  activa: {
    type: Number,
  },
  emite_alerta: {
    //modificado, number -> boolean
    type: Boolean,
  },
  tipo_alerta: {
    type: Number,
  },
  valor_fijo_alerta: {
    type: Number,
  },
});

module.exports = model(
  "AdministracionMonitoreo",
  AdministracionMonitoreoSchema
);
