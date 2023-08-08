const { Schema, model } = require("mongoose");

const TipoMaquinaSchema = Schema({
  descripcion: {
    type: String,
    required: true,
  },
  observaciones: {
    type: String,
    required: false,
  },
});

module.exports = model("TipoMaquina", TipoMaquinaSchema);
