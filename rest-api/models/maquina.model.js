const { Schema, model } = require("mongoose");

const MaquinaSchema = Schema({
  nombre: {
    type: String,
    required: true,
  },
  modelo: {
    type: String,
  },
  detalle: {
    type: String,
  },
  marca: {
    type: String,
  },
  id_tipo_maquina: {
    type: Schema.Types.ObjectId,
    ref: "TipoMaquina",
    required: true,
  },
  id_linea_produccion: {
    type: Schema.Types.ObjectId,
    ref: "LineaProduccion",
    required: true,
  },
});

module.exports = model("Maquina", MaquinaSchema);
