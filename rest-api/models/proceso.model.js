const { Schema, model } = require("mongoose");

const ProcesoSchema = Schema({
  nombre: {
    type: String,
    required: true,
  },
  descripcion: {
    type: String,
    required: true,
  },
});

module.exports = model("Proceso", ProcesoSchema);
