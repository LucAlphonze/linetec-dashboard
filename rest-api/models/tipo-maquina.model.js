const { Schema, model } = require("mongoose");

const TipoMaquinaSchema = Schema({
  nombre: {
    type: String,
    required: true,
  },
  descripcion: {
    type: String,
    required: false,
  },
});

module.exports = model("TipoMaquina", TipoMaquinaSchema);
