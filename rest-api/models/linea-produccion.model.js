const { Schema, model } = require("mongoose");

const LineaProduccionSchema = Schema({
  nombre: {
    type: String,
    required: true,
  },
  descripcion: {
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
