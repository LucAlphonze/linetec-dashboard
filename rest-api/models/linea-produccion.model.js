const { Schema, model } = require("mongoose");

const LineaProduccionSchema = Schema({
  descripcion: {
    type: String,
    required: true,
  },
  observaciones: {
    type: String,
  },
  id_empresa_planta: {
    type: Schema.Types.ObjectId,
    ref: "EmpresaPlanta",
    required: true,
  },
  identificador: {
    type: String,
  },
});

module.exports = model("LineaProduccion", LineaProduccionSchema);
